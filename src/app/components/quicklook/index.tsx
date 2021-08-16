/* eslint-disable react/require-default-props */
import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import fse from 'fs-extra';
import isPromise from 'is-promise';
import Spinner from '../searchWindowSpinner';
import { QuicklookWebview } from './quicklookWebview';
import { QuicklookText } from './quicklookText';
import { HandleBar, InnerHandleBarColor } from './components';
import MarkdownRenderer from '../markdownRenderer';

let handleBarOriginalPos = -1;
let resizedWindowOffset = 0;

const quicklookEdgeWidth = 45;
const quicklookWidth = 350;

// Ref: For better boxShadow styles, refer to https://getcssscan.com/css-box-shadow-examples
const outerStyle: Record<string, any> = {
  position: 'absolute',
  right: 0,
  width: quicklookWidth,
  zIndex: 2000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px',
};

type IProps = {
  quicklookData: QuicklookData;
  setQuicklookData: (data: QuicklookData) => void;
  hovering: boolean;
  setHovering: (bool: boolean) => void;
  searchbarHeight: number;
  resizedSearchWindowWidth: number;
  searchWindowWidth: number;
};

const useModalAnimation = ({
  initialRendering,
  reverse,
  handleBarOffset,
}: {
  initialRendering: boolean;
  reverse: boolean;
  handleBarOffset: number;
}) =>
  useSpring({
    from: {
      opacity: 0,
      horizontalOffset: quicklookWidth - quicklookEdgeWidth + handleBarOffset,
    },
    to: {
      opacity: 1,
      horizontalOffset: 0,
    },
    immediate: initialRendering,
    reverse,
  });

export default (props: IProps) => {
  const {
    hovering,
    quicklookData,
    resizedSearchWindowWidth,
    searchbarHeight,
    searchWindowWidth,
    setHovering,
    setQuicklookData,
  } = props;

  const { active, data, type } = quicklookData;

  const [initialRendering, setInitialRendering] = useState<boolean>(true);

  const [handleBarOffset, setHandlerBarOffset] = useState<number>(0);

  const [contents, setContents] = useState<any>();

  const [onResizing, setOnResizing] = useState<boolean>(false);
  const onResizingRef = useRef<boolean>(onResizing);

  const modalAnimation = useModalAnimation({
    initialRendering,
    reverse: !active && !hovering,
    handleBarOffset,
  });

  const getInnerContainer = async () => {
    let targetData = data;

    if (!type || !targetData) return <div>No data to display</div>;

    if (isPromise(targetData)) {
      try {
        targetData = await (data as Promise<string>);
      } catch (err) {
        return <div>{err}</div>;
      }
    }

    switch (type) {
      case 'pdf':
      case 'html':
      case 'image':
        return (
          <QuicklookWebview
            data={targetData as string}
            visible={hovering || active}
            setVisible={(visible) =>
              setQuicklookData({
                ...quicklookData,
                active: visible,
              })
            }
          />
        );

      case 'text': {
        const fileSize = (await fse.stat(targetData as string)).size;
        if (fileSize >= 1024 * 100) {
          return <div>Too big text file</div>;
        }

        return (
          <QuicklookText>
            {await fse.readFile(targetData as string, { encoding: 'utf-8' })}
          </QuicklookText>
        );
      }

      case 'markdown':
        return (
          <MarkdownRenderer
            dark={false}
            width="100%"
            height="100%"
            data={targetData as string}
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

  const onMouseLeaveEventHandler = () => {
    setHovering(false);
  };

  const onMouseDownEventHandler = (e: React.MouseEvent<HTMLInputElement>) => {
    setOnResizing(true);
    onResizingRef.current = true;
    if (handleBarOriginalPos === -1) {
      handleBarOriginalPos = e.clientX;
    }
  };

  const onMouseUpEventHandler = (
    e: React.MouseEvent<HTMLInputElement> | MouseEvent
  ) => {
    onResizingRef.current = false;
    setOnResizing(false);
  };

  const quicklookResizeHandler = (clientX: number) => {
    setHandlerBarOffset(handleBarOriginalPos - clientX + resizedWindowOffset);
  };

  const onMouseMoveEventHandler = (e: MouseEvent) => {
    if (!onResizingRef.current || handleBarOriginalPos === -1) return;
    quicklookResizeHandler(e.clientX);
  };

  const renderLoading = () => {
    return (
      <Spinner
        style={{
          top: '50%',
        }}
      />
    );
  };

  const updateContent = () => {
    setContents(renderLoading());
    getInnerContainer().then(setContents).catch(console.error);
  };

  useEffect(() => {
    (document.getElementById('searchWindow') as HTMLDivElement).onmousemove =
      onMouseMoveEventHandler;
    (document.getElementById('searchWindow') as HTMLDivElement).onmouseup =
      onMouseUpEventHandler;
  }, []);

  useEffect(() => {
    resizedWindowOffset = resizedSearchWindowWidth - searchWindowWidth;
  }, [resizedSearchWindowWidth]);

  useEffect(() => {
    updateContent();
  }, [data]);

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
    if (active && !hovering) {
      updateContent();
    } else if (!active && !hovering) {
      setTimeout(() => {
        updateContent();
      }, 200);

      setHandlerBarOffset(0);
    }
  }, [active]);

  useEffect(() => {
    if (!active && hovering) {
      updateContent();
    } else if (!active && !hovering) {
      setTimeout(() => {
        updateContent();
      }, 200);

      setHandlerBarOffset(0);
    }
  }, [hovering]);

  return (
    <animated.div
      id="quicklook"
      onMouseEnter={onMouseEnterEventHandler}
      onMouseLeave={onMouseLeaveEventHandler}
      style={{
        ...outerStyle,
        color: '#000',
        backgroundColor: '#fff',
        marginTop: searchbarHeight,
        width: quicklookWidth + handleBarOffset,
        height: `calc(100% - ${searchbarHeight}px)`,
        opacity: modalAnimation.opacity,
        transform: modalAnimation.horizontalOffset.to(
          (offset: number) => `translate(${offset}px, 0px)`
        ),
      }}
    >
      {contents}
      <HandleBar
        onMouseDown={onMouseDownEventHandler}
        onMouseUp={onMouseUpEventHandler as (e: React.MouseEvent) => void}
      >
        <InnerHandleBarColor />
        <InnerHandleBarColor style={{ marginLeft: 2 }} />
      </HandleBar>
    </animated.div>
  );
};
