/* eslint-disable no-eval */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import fse from 'fs-extra';
import { Core } from 'arvis-core';
import pDebounce from 'p-debounce';
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

const renderLoading = () => {
  return (
    <Spinner
      style={{
        top: '50%',
      }}
    />
  );
};

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

  const { active, data, type, script, asyncQuicklookItemUid } = quicklookData;

  const [initialRendering, setInitialRendering] = useState<boolean>(true);

  const [handleBarOffset, setHandlerBarOffset] = useState<number>(0);

  const [contents, setContents] = useState<any>(renderLoading());

  const [onResizing, setOnResizing] = useState<boolean>(false);
  const onResizingRef = useRef<boolean>(onResizing);

  const modalAnimation = useModalAnimation({
    initialRendering,
    reverse: !active && !hovering,
    handleBarOffset,
  });

  const setVisible = useCallback((visible: boolean) => {
    setQuicklookData({
      ...quicklookData,
      active: visible,
    });
  }, []);

  const getInnerContainer = useCallback(async () => {
    let targetData = data;

    if (!type || !targetData) return <div>No data to display</div>;

    if (asyncQuicklookItemUid) {
      try {
        targetData = await pDebounce(
          Core.pluginWorkspace.requestAsyncQuicklookRender,
          25
        )(asyncQuicklookItemUid);
      } catch (err: any) {
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
            setVisible={setVisible}
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
  }, [active, data]);

  const onMouseEnterEventHandler = useCallback(() => {
    setHovering(true);
  }, []);

  const onMouseLeaveEventHandler = useCallback(() => {
    setHovering(false);
  }, []);

  const onMouseDownEventHandler = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      setOnResizing(true);
      onResizingRef.current = true;
      if (handleBarOriginalPos === -1) {
        handleBarOriginalPos = e.clientX;
      }
    },
    []
  );

  const onMouseUpEventHandler = useCallback(
    (e: React.MouseEvent<HTMLInputElement> | MouseEvent) => {
      onResizingRef.current = false;
      setOnResizing(false);
    },
    []
  );

  const quicklookResizeHandler = useCallback(
    (clientX: number) => {
      setHandlerBarOffset(handleBarOriginalPos - clientX + resizedWindowOffset);
    },
    [handleBarOriginalPos, resizedWindowOffset]
  );

  const onMouseMoveEventHandler = useCallback(
    (e: MouseEvent) => {
      if (!onResizingRef.current || handleBarOriginalPos === -1) return;
      quicklookResizeHandler(e.clientX);
    },
    [handleBarOriginalPos]
  );

  const updateContent = useCallback(() => {
    setContents(renderLoading());

    getInnerContainer().then(setContents).catch(console.error);
  }, [active, data]);

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
  }, [active, data]);

  useEffect(() => {
    if (script) {
      eval(script);
    }
  }, [contents]);

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
        title="Resize quicklook's size by dragging handle bar, double click to close quicklook"
        onMouseDown={onMouseDownEventHandler}
        onMouseUp={onMouseUpEventHandler as (e: React.MouseEvent) => void}
        onDoubleClick={() => setVisible(false)}
      >
        <InnerHandleBarColor />
        <InnerHandleBarColor style={{ marginLeft: 2 }} />
      </HandleBar>
    </animated.div>
  );
};
