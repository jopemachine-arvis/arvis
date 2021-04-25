"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _useKeyCaptureReducer = _interopRequireDefault(require("./useKeyCaptureReducer"));

var _useKeyCaptureUtils = require("./useKeyCaptureUtils");

function useKeys() {
  var _useReducer = (0, _react.useReducer)((0, _useKeyCaptureUtils.useEnhancedReducer)(_useKeyCaptureReducer.default), _useKeyCaptureUtils.initialState),
      _useReducer2 = (0, _slicedToArray2.default)(_useReducer, 2),
      keyData = _useReducer2[0],
      dispatch = _useReducer2[1];

  var targetItemRef = (0, _react.useRef)(null);

  var dispatchWithActionDetails = function dispatchWithActionDetails(event) {
    dispatch((0, _useKeyCaptureUtils.getAction)(event));
  };
  /**
   * It resets all state values to initial values
   */


  var resetKeyData = function resetKeyData() {
    dispatch({
      type: _useKeyCaptureUtils.useKeyActionTypes.RESET_CAPTURES
    });

    if (targetItemRef && targetItemRef.current) {
      targetItemRef.current.value = '';
    }
  };

  (0, _react.useEffect)(function () {// example for IS_TRUSTED as false
    // setTimeout(() => {
    //   document.dispatchEvent(new KeyboardEvent('keydown'), { key: 'Escape' });
    // }, 2000);
  }, [keyData]);
  (0, _react.useEffect)(function () {
    var listenerItem = targetItemRef.current || document;
    listenerItem.addEventListener('keydown', dispatchWithActionDetails);
    return function () {
      listenerItem.removeEventListener('keydown', dispatchWithActionDetails);
    };
  }, []);

  var getTargetProps = function getTargetProps() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        ref = _ref.ref,
        type = _ref.type;

    return {
      type: type || _useKeyCaptureUtils.targetItemPropsDefaultValue.type,
      ref: (0, _useKeyCaptureUtils.handleRefAssignment)(ref, function (targetItemNode) {
        targetItemRef.current = targetItemNode;
      }),
      originalRef: targetItemRef,
    };
  };

  return {
    keyData: keyData,
    resetKeyData: resetKeyData,
    getTargetProps: getTargetProps
  };
}

var _default = useKeys;
exports.default = _default;