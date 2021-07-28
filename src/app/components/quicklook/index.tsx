/* eslint-disable react/require-default-props */
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import fse from 'fs-extra';
import Spinner from '../searchWindowSpinner';
import { QuicklookWebview } from './quicklookWebview';
import { QuicklookText } from './quicklookText';
import MarkdownRenderer from '../markdownRenderer';

// Ref: For better boxShadow styles, refer to https://getcssscan.com/css-box-shadow-examples
const outerStyle: any = {
  position: 'absolute',
  right: 0,
  width: 350,
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
  const { type, data, active, searchbarHeight } = props;

  const [initialRendering, setInitialRendering] = useState<boolean>(true);
  const [hovering, setHovering] = useState<boolean>(false);

  const modalAnimation = useModalAnimation({
    initialRendering,
    reverse: !active && !hovering,
  });

  const [contents, setContents] = useState<any>();

  const getInnerContainer = async () => {
    if (!type || !data) return <div>No data to display</div>;
    switch (type) {
      case 'html':
      case 'image':
        return <QuicklookWebview data={data} />;
      case 'text': {
        const fileSize = (await fse.stat(data)).size;
        if (fileSize >= 1024 * 100) {
          return <div>Too big text file</div>;
        }

        return (
          <QuicklookText>
            {await fse.readFile(data, { encoding: 'utf-8' })}
          </QuicklookText>
        );
      }
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

  const renderLoading = () => {
    return (
      <Spinner
        style={{
          top: '50%',
        }}
      />
    );
  };

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

  useEffect(() => {
    setContents(renderLoading());
    getInnerContainer().then(setContents).catch(console.error);
  }, [data]);

  return (
    <animated.div
      onMouseEnter={onMouseEnterEventHandler}
      onMouseLeave={onMouseLeaveEnterHandler}
      onDragStart={onDragStartEventHandler}
      onDrag={onDragEventHandler}
      onDragEnd={onDragEndEventHandler}
      style={{
        ...outerStyle,
        color: '#000',
        height: `calc(100% - ${searchbarHeight}px)`,
        backgroundColor: '#fff',
        borderRadius: modalAnimation.borderRadius,
        marginTop: searchbarHeight,
        opacity: modalAnimation.opacity,
        transform: modalAnimation.horizontalOffset.to(
          (offset) => `translate(${offset}px, 0px)`
        ),
      }}
    >
      {contents}
    </animated.div>
  );
};
