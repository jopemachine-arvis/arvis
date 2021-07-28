/* eslint-disable react/require-default-props */
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { QuicklookWebview } from './quicklookWebview';
import { QuicklookText } from './quicklookText';
import MarkdownRenderer from '../markdownRenderer';

// Ref: For better boxShadow styles, refer to https://getcssscan.com/css-box-shadow-examples
const outerStyle: any = {
  position: 'absolute',
  right: 0,
  width: 350,
  height: '100%',
  zIndex: 2000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px',
};

type IProps = {
  type?: 'html' | 'image' | 'markdown' | 'text';
  data?: string;
  active: boolean;
  backgroundColor: string;
  searchbarHeight: number;
};

const deactivedModalWindowWidth = 15;

const useModalAnimation = ({
  initialRendering,
  reverse,
}: {
  initialRendering: boolean;
  reverse: boolean;
}) =>
  useSpring({
    from: {
      opacity: 0,
      horizontalOffset: 350 - deactivedModalWindowWidth,
      borderRadius: 0,
    },
    to: {
      opacity: 1,
      horizontalOffset: 0,
      borderRadius: 5,
    },
    immediate: initialRendering,
    reverse,
  });

export default (props: IProps) => {
  const { type, data, active, searchbarHeight, backgroundColor } = props;

  const [initialRendering, setInitialRendering] = useState<boolean>(true);
  const [hovering, setHovering] = useState<boolean>(false);

  const modalAnimation = useModalAnimation({
    initialRendering,
    reverse: !active && !hovering,
  });

  const renderInnerContainer = () => {
    if (!type || !data) return <div>No data to display</div>;
    switch (type) {
      case 'html':
      case 'image':
        return <QuicklookWebview data={data} />;
      case 'text':
        return <QuicklookText>{data}</QuicklookText>;
      case 'markdown':
        return (
          <MarkdownRenderer
            dark={false}
            width="100%"
            height="100%"
            data={data}
            padding={15}
          />
        );
      default:
        break;
    }

    throw new Error(`Not proper quicklook data type:\n${type}`);
  };

  const onMouseEnterEventHandler = () => {
    setHovering(true);
  };

  const onMouseLeaveEnterHandler = () => {
    setHovering(false);
  };

  const onDragStartEventHandler = () => {};

  const onDragEndEventHandler = () => {};

  const onDragEventHandler = () => {};

  useEffect(() => {
    if (initialRendering) {
      setInitialRendering(false);
      return;
    }

    if (!active) {
      setHovering(false);
    }

    modalAnimation.opacity.start();
    modalAnimation.horizontalOffset.start();
  }, [active]);

  return (
    <animated.div
      onMouseEnter={onMouseEnterEventHandler}
      onMouseLeave={onMouseLeaveEnterHandler}
      onDragStart={onDragStartEventHandler}
      onDrag={onDragEventHandler}
      onDragEnd={onDragEndEventHandler}
      style={{
        ...outerStyle,
        backgroundColor: '#fff',
        borderRadius: modalAnimation.borderRadius,
        marginTop: searchbarHeight,
        opacity: modalAnimation.opacity,
        transform: modalAnimation.horizontalOffset.to(
          (offset) => `translate(${offset}px, 0px)`
        ),
      }}
    >
      {renderInnerContainer()}
    </animated.div>
  );
};
