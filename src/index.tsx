import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  PanResponder,
  Animated,
  TouchableOpacity,
  Easing,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

// local puzzle
const defaultPuzzle = {
  puzzle: require('./images/puzzle.jpg'),
  puzzlePiece: require('./images/puzzlePiece.png'),
  pieceOffsetX: 79,
  allowableOffsetError: 3,
};

const generateSlidingStyles = (
  iconName: any,
  iconColor = 'white',
  buttonColor: any,
  borderColor = buttonColor,
  indicatorColor: any
) => ({
  icon: <Feather name={iconName} size={25} color={iconColor} />,
  buttonColor,
  borderColor,
  indicatorColor,
});

const slidingStyles = {
  READY: generateSlidingStyles(
    'arrow-right',
    '#5C6167',
    'white',
    '#e4e7eb',
    '#e4e7eb',
  ),
  MOVING: generateSlidingStyles(
    'arrow-right',
    undefined,
    '#1991fa',
    undefined,
    '#d1e9fe',
  ),
  VERIFY_PASS: generateSlidingStyles(
    'check',
    undefined,
    '#52ccba',
    undefined,
    '#d2f4ef',
  ),
  VERIFY_FAIL: generateSlidingStyles(
    'x',
    undefined,
    '#f57a7a',
    undefined,
    '#fce1e1',
  )
};

type Props = {
  imageSize: {
    puzzleWidth: any,
    puzzlePieceWidth: any,
    puzzleHeight: any
  }
  puzzleWidth: any,
  puzzleHeight: any
  puzzlePieceWidth: any,
  useDefault: Boolean
  slideVerify: any
  onVerifyPassed: Function
  onVerifyFailed: Function
  showRefresh: Boolean
  refresh: Function
  displayType: String
  slideTips: String
  puzzle: any
  puzzlePiece: any
}

const SlideVerification = (props: Props) => {


  const [state, setState] = useState({
    offsetXAnim: new Animated.Value(0),
    slideStatus: slidingStyles.READY,
    moving: false,
    verifying: false,
    result: null,
    lastResult: null,
    useDefault: false,
    imageSize: {
      puzzleWidth: 300,
      puzzleHeight: 150,
      puzzlePieceWidth: 50,
    },
    displayType: 'triggered',
    showRefresh: false,
    slideTips: '',
    puzzle: null,
    puzzlePiece: null,
    onVerifyPassed: () => { },
    onVerifyFailed: () => { },
    slideVerify: () => { },
    refresh: () => { },
  })



  const hanldeShouldBeResponder = () =>
    state.lastResult !== true && !state.moving;

  const handlePanResponderGrant = () =>
    setState({
      ...state,
      moving: true,
      result: null,
      slideStatus: slidingStyles.MOVING,
    });

  // bind accumulated distance to offsetAnim.x
  const handlePanResponderMove = () => {
    const { offsetXAnim } = state;
    // const {
    //   imageSize: { puzzleWidth, puzzlePieceWidth },
    // } = props;
    const maxMoving = props.puzzleWidth - props.puzzlePieceWidth;

    return Animated.event([null, { dx: offsetXAnim }], {
      useNativeDriver: false,
      // limit sliding out of box
      listener: (gestureState) => {
        // @ts-expect-error
        if (gestureState.dx < 0) {
          offsetXAnim.setValue(0);
          // @ts-expect-error
        } else if (gestureState.dx > maxMoving) {
          offsetXAnim.setValue(maxMoving);
        }
      },
    });
  };
  // @ts-expect-error
  const handlePanResponderRelease = async (event: any, gestureState: any) => {
    const offset = gestureState.dx;

    // handle local puzzle
    if (props.useDefault) {
      const { pieceOffsetX, allowableOffsetError } = defaultPuzzle;
      const minOffsetX = pieceOffsetX - allowableOffsetError;
      const maxOffsetX = pieceOffsetX + allowableOffsetError;
      offset >= minOffsetX && offset <= maxOffsetX
        ? handleVerifyPassed()
        : handleVerifyFailed();
    } else {
      // invoke external verify
      const { slideVerify } = props;
      if (slideVerify) {
        setState({ ...state, verifying: true });
        try {
          await slideVerify(offset);
          handleVerifyPassed();
        } catch (error) {
          handleVerifyFailed();
        }
        setState({ ...state, verifying: false });
      }
    }
  };

  const handleVerifyPassed = () => {
    const { useDefault, onVerifyPassed } = props;
    setState({
      ...state,
      moving: false,
      // @ts-expect-error
      result: true,
      slideStatus: slidingStyles.VERIFY_PASS,
      // @ts-expect-error
      lastResult: true,
    });
    useDefault && onVerifyPassed && onVerifyPassed();
  };

  const handleVerifyFailed = () => {
    const { useDefault, onVerifyFailed } = props;

    setState({
      ...state,
      // @ts-expect-error
      result: false,
      slideStatus: slidingStyles.VERIFY_FAIL,
    });

    useDefault && onVerifyFailed && onVerifyFailed();

    Animated.timing(state.offsetXAnim, {
      toValue: 0,
      delay: 500,
      easing: Easing.linear,
      useNativeDriver: false
    }).start(() => {
      // back to initial status
      setState({
        ...state,
        slideStatus: slidingStyles.READY,
        moving: false,
        result: null,
        // @ts-expect-error
        lastResult: false,
      });
    });
  };

  const panResponder = React.useMemo(() => PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: hanldeShouldBeResponder,
    onStartShouldSetPanResponderCapture: hanldeShouldBeResponder,
    onMoveShouldSetPanResponder: hanldeShouldBeResponder,
    onMoveShouldSetPanResponderCapture: hanldeShouldBeResponder,

    onPanResponderGrant: handlePanResponderGrant, // begin sliding
    onPanResponderMove: handlePanResponderMove(), // sliding
    onPanResponderRelease: handlePanResponderRelease, // slide end
  }), []);



  const {
    useDefault,
    // imageSize: { puzzleHeight, puzzlePieceWidth },
    puzzlePieceWidth,
    puzzleHeight,
    showRefresh,
    refresh,
    displayType,
    slideTips,
  } = props;
  const { slideStatus, moving, verifying, result, lastResult, offsetXAnim, } = state;

  let puzzle;
  let puzzlePiece;

  // image from local or external
  if (useDefault) {
    ({ puzzle, puzzlePiece } = state);
  } else {
    ({ puzzle, puzzlePiece } = props);
  }

  return (
    <View style={{ width: state.imageSize.puzzleWidth, }}>
      <View
        style={[
          styles.puzzleContainer,
          {
            height: state.imageSize.puzzleHeight,
            opacity:
              displayType === 'triggered'
                ? moving || lastResult === false
                  ? 1
                  : 0
                : 1,
          },
          displayType === 'triggered'
            ? { ...StyleSheet.absoluteFillObject, top: -(state.imageSize.puzzleHeight + 20) }
            : styles.puzzleContainerEmbedded,
        ]}
      >
        {useDefault ? (
          <Image
            source={defaultPuzzle.puzzle}
            style={[StyleSheet.absoluteFill, { zIndex: 2 }, styles.image]}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={puzzle}
            style={[StyleSheet.absoluteFill, { zIndex: 2 }, styles.image]}
            resizeMode="cover"
          />
        )}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              zIndex: 3,
              transform: [
                { translateX: offsetXAnim },
                // without this line this Animation will not render on Android while working fine on iOS
                { perspective: 1000 },
              ],
            },
          ]}>
          {useDefault ? (
            <Image
              source={defaultPuzzle.puzzlePiece}
              style={{ width: state.imageSize.puzzlePieceWidth, height: state.imageSize.puzzleHeight }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={puzzlePiece}
              style={{ width: puzzlePieceWidth, height: puzzleHeight }}
              resizeMode="cover"
            />
          )}
        </Animated.View>
        {showRefresh && (
          <TouchableOpacity
            // @ts-expect-error
            onPress={refresh}
            activeOpacity={0.7}
            style={styles.refresh}
            disabled={verifying}>
            <Ionicons name="ios-refresh" size={35} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.slideBox}>
        <Animated.View
          style={[
            styles.slideIndicator,
            {
              width: offsetXAnim,
              borderColor: slideStatus.borderColor,
              backgroundColor: slideStatus.indicatorColor,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.slider,
            {
              width: state.imageSize.puzzlePieceWidth,
              backgroundColor: slideStatus.buttonColor,
              borderColor: slideStatus.borderColor,
              transform: [{ translateX: offsetXAnim }, { perspective: 1000 }],
            },
          ]}
          {...panResponder.panHandlers}>
          {verifying ? <ActivityIndicator color="white" /> : slideStatus.icon}
        </Animated.View>
        {
          !moving && result === null && (
            <Text style={styles.slideTips}>{slideTips}</Text>
          )
        }
      </View >
    </View >
  )
}

export default SlideVerification