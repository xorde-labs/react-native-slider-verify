import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface SlideVerifyProps {
	/* Optional props */
	darkMode?: boolean;
	allowRetry?: boolean;
	style?: ViewStyle;
	imageUri?: string;
	fragmentUri?: string;

	/* Handlers */
	onPassed?: () => void;
	onFailed?: () => void;
}

export const SliderVerify: React.FC<SlideVerifyProps> = ({
	darkMode = false,
	allowRetry = true,
	...props
}) => {
	return (
		<View
			style={[styles.container, darkMode ? styles.darkColors : styles.lightColors, props.style]}>
			<Text>SliderVerify allowRetry={allowRetry}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	lightColors: {
		backgroundColor: 'white',
		color: 'black',
	},
	darkColors: {
		backgroundColor: 'black',
		color: 'white',
	},
});
