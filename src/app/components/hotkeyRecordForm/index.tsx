/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';
import { getHotkeyNameOnThisPlatform } from '@utils/index';
import StyledInput from '../styledInput';
import useKey from '../../../external/use-key-capture/src';

type IProps = {
  hotkey: string;
  onHotkeyChange: (e: React.FormEvent<HTMLInputElement>) => void;
  canBeEmpty?: boolean;
  style?: any;
  className?: string;
};

const HotkeyRecordForm = (props: IProps) => {
  const { canBeEmpty, className, hotkey, onHotkeyChange, style } = props;

  const { keyData } = useKey();

  const [hotkeyFormFocused, setHotkeyFormFocused] = useState<boolean>(false);

  const hotkeyChangedEventHandler = () => {
    if (hotkeyFormFocused) {
      console.log('Recorded keyData', keyData);

      if (canBeEmpty && keyData.isBackspace) {
        onHotkeyChange({
          currentTarget: {
            value: '',
          },
        } as React.FormEvent<HTMLInputElement>);
      }

      let result = '';
      const modifiers = {
        // On mac, cmd key is handled by meta;
        cmd: keyData.isWithMeta,
        ctrl: keyData.isWithCtrl,
        shift: keyData.isWithShift,
        alt: keyData.isWithAlt,
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

      const normalKey = keyData.key;
      if (normalKey) {
        if (keyData.isSpace) {
          result += 'Space';
        } else {
          result += normalKey;
        }
      }
      // Modifier key without normal key is not allowed
      else if (!normalKey && !keyData.doubleKeyPressed) {
        return;
      }
      // Double modifier key
      else {
        // remove last ' + '
        result = result.substring(0, result.length - 3);
      }

      const doubledStr = keyData.doubleKeyPressed ? 'Double ' : '';

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
    hotkeyChangedEventHandler();
  }, [keyData]);

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
      onBlur={(e: any) => {
        setHotkeyFormFocused(false);
      }}
      onFocus={(e: any) => {
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
