# react-native-slider-verify

Slide To Verify

## Installation

```sh
npm install react-native-slider-verify
```

A pure JavaScript component for react-native. Drag the slider to fill the puzzle for verifying normal operation.

## Installation

```shell
yarn add react-native-slide-verify
```

> ensure to link react-native-vector-icons

## Usage

```js
import SlideVerify from 'react-native-slider-verify'

...

render() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 20}}>

      // use default verify images
      <SlideVerify
        useDefault
        onVerifyPassed={alert('passed')}
        onVerifyFailed={alert('failed')}
      />

      // use specified verify images
      <SlideVerify
        puzzle={{ url: 'url/to/image'}}
        puzzlePiece={require('path/to/image')}
        slideVerify={offset => { console.log(offset); return Promise.resolve() }}
        showRefresh
        refresh={() => alert('refresh')}
        slideTips={I18n.t('slideTips')}
      >
    </View>
  )
}
```

## Component Props

**use default verify images**

| Property         | Type                      | Description               |
| ---------------- | ------------------------- | ------------------------- |
| `useDefault`     | bool (default false)      | use default verify images |
| `onVerifyPassed` | func (default `() => {}`) | verify passed callback    |
| `onVerifyFaild`  | func (default `() => {}`) | verify failed callback    |

**use specified verify images**

| Property      | Type                                                                                                                   | Description                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `imageSize`   | object (`{puzzleWidth: number(default 300), puzzleHeight: number(default 150), puzzlePieceWidth: number(default 50)}`) | optional. custom image diplay size, related to slide offset (`puzzleWidth` decides the container width)                                    |
| `puzzle`      | object or number                                                                                                       | background image. object with `{url: 'xxx'}` or result of `require('path/to/image')`                                                       |
| `puzzlePiece` | object or number                                                                                                       | piece image. object with `{url: 'xxx'}` or result of `require('path/to/image')`                                                            |
| `showRefresh` | bool (default `false`)                                                                                                 | show refresh icon on the top right corner                                                                                                  |
| `refresh`     | func (default `() => {}`)                                                                                              | refresh icon onPress listener                                                                                                              |
| `slideVerify` | func (default `() => {}`)                                                                                              | called to verify when releasing finger on the dragging slider. pass `offset` as param. **The func should return promise of verify result** |

**common props**

| Property      | Type                                          | Description                                                  |
| ------------- | --------------------------------------------- | ------------------------------------------------------------ |
| `displayType` | string (default `'triggered'`)                | puzzle image display type. enum(`'triggered'`, `'embedded'`) |
| `slideTips`   | string (default `'向右滑动左侧箭头填充拼图'`) | slide tips showed in slide box                               |

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---
```
