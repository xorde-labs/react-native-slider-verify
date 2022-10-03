import React from 'react';
import { SafeAreaView, StyleSheet, Text, Button } from 'react-native';
import SlideVerify from 'rn-slide-verify';

const App = () => {
  const [refresh, setRefresh] = React.useState(1);
  return (
    <SafeAreaView style={styles.container}>
      <SlideVerify
        key={refresh}
        useDefault
        onVerifyPassed={() => alert('Passed')}
        onVerifyFailed={() => alert('Failed')}
        slideTips={'Solve Puzzle To Verify'}
        slideVerify={offset => {
          console.log(offset);
          return Promise.resolve();
        }}
        displayType={'embedded'}
      />
      <Button onPress={() => setRefresh(new Date())} title={'Reset'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default App;
