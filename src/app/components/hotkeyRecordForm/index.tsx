/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';
import { getHotkeyNameOnThisPlatform } from '@utils/index';
import useKeyRecord from '@hooks/useKeyRecord';
import { keyCodeToString, isNormalKey } from '@utils/iohook/keyTbl';
import StyledInput from '../styledInput';

type IProps = {
  hotkey: string;
  onHotkeyChange: (e: React.FormEvent<HTMLInputElement>) => void;
  canBeEmpty?: boolean;
  style?: any;
  className?: string;
};

const HotkeyRecordForm = (props: IProps) => {
  const { canBeEmpty, className, hotkey, onHotkeyChange, style } = props;

  const [hotkeyFormFocused, setHotkeyFormFocused] = useState<boolean>(false);

  const { recordedKeyData } = useKeyRecord({ actived: hotkeyFormFocused });

  const hotkeyChangedEventHandler = () => {
    if (recordedKeyData && hotkeyFormFocused) {
      if (!isNormalKey(recordedKeyData.keycode)) return;

      const normalKey = keyCodeToString(recordedKeyData.keycode);

      if (canBeEmpty && normalKey === 'Backspace') {
        onHotkeyChange({
          currentTarget: {
            value: '',
          },
        } as React.FormEvent<HTMLInputElement>);
      }

      let result = '';

      const modifiers = {
        // On mac, cmd key is handled by meta;
        cmd: recordedKeyData.metaKey,
        ctrl: recordedKeyData.ctrlKey,
        shift: recordedKeyData.shiftKey,
        alt: recordedKeyData.altKey,
      };

      if (
        !modifiers.cmd &&
        !modifiers.ctrl &&
        !modifiers.shift &&
        !modifiers.alt
      ) {
        return;
      }

      for (const modifier in modifiers) {
        if ((modifiers as any)[modifier]) {
          result += `${modifier} + `;
        }
      }

      if (normalKey) {
        if (normalKey === 'Space') {
          result += 'Space';
        } else {
          result += normalKey;
        }
      }
      // Modifier key without normal key is not allowed
      else if (!normalKey && !recordedKeyData.doubleKeyPressed) {
        return;
      }
      // Double modifier key
      else {
        // remove last ' + '
        result = result.substring(0, result.length - 3);
      }

      const doubledStr = recordedKeyData.doubleKeyPressed ? 'Double ' : '';

      if (doubledStr + result !== hotkey) {
        onHotkeyChange({
          currentTarget: {
            value: doubledStr + result,
          },
        } as React.FormEvent<HTMLInputElement>);
      }
    }
  };

  useEffect(() => {
    if (recordedKeyData) {
      hotkeyChangedEventHandler();
    }
  }, [recordedKeyData]);

  return (
    <StyledInput
      style={{
        textTransform: 'capitalize',
        color: 'transparent',
        textShadow: '0px 0px 0px #fff',
        ...style,
      }}
      className={className}
      type="text"
      onChange={() => {}}
      onBlur={(e: React.MouseEvent) => {
        setHotkeyFormFocused(false);
      }}
      onFocus={(e: React.MouseEvent) => {
        setHotkeyFormFocused(true);
      }}
      value={getHotkeyNameOnThisPlatform(hotkey)}
    />
  );
};

HotkeyRecordForm.defaultProps = {
  canBeEmpty: false,
  className: '',
  style: {},
};

export default HotkeyRecordForm;
