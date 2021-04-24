<h1 align="center">
use-key-capture ⌨️
</h1>

<p align="center" style="font-size: 1.2rem;">A custom hook to ease the key-press listeners of a target/global.</p>

> Check the
> [demo](https://use-key-capture.netlify.com/demo)
> here

<hr />

## The problem

Listening for key-press might be tedious when it comes to listening for combination keys such as <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> or the entered letter is a caps or small varient or a number.

## The Solution

use-key-capture is a custom hook which will lets you not to worry about the key-press event. Just plugin in use-key-capture hook to the **target** you want to listen for key press event or by default it can listen for key-press event **globally**.It gives simple API, which helps you listen for complex key combinations with ease.

Example: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> - `useKeyCapture` gives

```js
{
    key: 'A',
    isCaps: true,
    isWithCtrl: true,
    isWithShift: true
}
```

## installation

**npm**

```bash
npm i use-key-capture
```

**yarn**

```bash
yarn add use-key-capture
```

## Usage

This same working demo is [here](https://use-key-capture.netlify.com/demo).

```jsx
import React from 'react';
import useKey from 'use-key-capture';
import './styles.css';

const displayKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'Backspace'];

const TargetEventComponent = () => {
  /* 
    keyData - gives the data of pressed key, i.e) isCaps, isNumber, isWithShift. 
    getTargetProps - a prop getter to be given if a target (input, textarea) have 
    to be listened for key-press.
    */
  const { keyData, getTargetProps } = useKey();

  const getIsActive = key => (keyData.key === key ? 'active' : '');

  return (
    <div className="container-target">
      <div className="message">
        Type QWERTY in the input element below. If the focus is outside the
        target, we won't see any change.
      </div>
      <input {...getTargetProps()} />
      <div className="container">
        {displayKeys.map(key => {
          return (
            <div key={key} className={`box ${getIsActive(key)}`}>
              {key}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TargetEventComponent;
```

## Props

### keyData

It will be the most used props from `useKeyCapture`. It gives the key/key varient/key combinations pressed.

| Property           | Type    |
| ------------------ | ------- |
| key                | String  |
| isEnter            | Boolean |
| isBackspace        | Boolean |
| isEscape           | Boolean |
| isCapsLock         | Boolean |
| isTab              | Boolean |
| isSpace            | Boolean |
| isArrow            | Boolean |
| isArrowRight       | Boolean |
| isArrowLeft        | Boolean |
| isArrowUp          | Boolean |
| isArrowDown        | Boolean |
| isWithShift        | Boolean |
| isWithCtrl         | Boolean |
| isWithMeta         | Boolean |
| isWithAlt          | Boolean |
| isCaps             | Boolean |
| isSmall            | Boolean |
| isNumber           | Boolean |
| isSpecialCharacter | Boolean |

### getTargetProps

`type: function({})`

A prop getter to be given if a target (input, textarea) have to be listened for key-press.

### resetKeyData

`type: function({})`

It will reset all the values in `keyData` props to the initial values.
