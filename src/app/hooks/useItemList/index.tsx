import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import useForceUpdate from 'use-force-update';
import { isWithCtrlOrCmd, range } from '@utils/index';
import {
  ItemContainer,
  ItemSubtitle,
  ItemTitle,
  ItemOrderedList,
} from './components';
import * as styles from './style';
import './index.css';

export interface ItemInfo {
  title: string;
  subtitle: string;
  enabled?: boolean;
  icon: JSX.Element;
}

interface IProps {
  items: ItemInfo[];
  itemTooltip?: string;
  itemDoubleClickHandler?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => void;
  itemRightClickCallback?: (
    e: React.MouseEvent<HTMLInputElement>,
    clickedIdx: number,
    selectedIdxs: Set<number>
  ) => void;
  renderItem?: (
    itemInfo: any,
    idx: number,
    selectedIdx: number,
    selectedIdxs: Set<number>,
    itemClickHandler: (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      idx: number
    ) => void
  ) => JSX.Element;
  listStyle?: React.CSSProperties;
}

export default function useItemList(props: IProps) {
  const {
    items,
    itemTooltip,
    itemDoubleClickHandler,
    itemRightClickCallback,
    renderItem: custemRenderItem,
    listStyle,
  } = props;

  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(-1);
  const selectedItemIdxRef = useRef<any>();

  const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(new Set([]));

  const forceUpdate = useForceUpdate();

  const clearIndex = () => {
    setSelectedIdxs(new Set([]));
    setSelectedItemIdx(-1);
  };

  const itemClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    idx: number
  ) => {
    const swap = new Set(selectedIdxs);
    if (e.shiftKey) {
      const from = selectedItemIdx > idx ? idx : selectedItemIdx;
      const to = selectedItemIdx < idx ? idx : selectedItemIdx;
      setSelectedIdxs(new Set(range(from, to, 1)));
    } else if (
      isWithCtrlOrCmd({ isWithCmd: e.metaKey, isWithCtrl: e.ctrlKey })
    ) {
      if (selectedIdxs.has(idx)) {
        swap.delete(idx);
      } else {
        swap.add(idx);
      }
      setSelectedIdxs(swap);
    } else {
      setSelectedIdxs(new Set([idx]));
      setSelectedItemIdx(idx);
    }

    forceUpdate();
  };

  const itemRightClickHandler = (
    e: React.MouseEvent<HTMLInputElement>,
    clickedIdx: number
  ) => {
    e.preventDefault();
    let targetIdxs;

    if (selectedIdxs.has(clickedIdx)) {
      targetIdxs = new Set(selectedIdxs);
      targetIdxs.add(clickedIdx);
    } else {
      targetIdxs = new Set([clickedIdx]);
    }

    setSelectedIdxs(targetIdxs);

    itemRightClickCallback &&
      itemRightClickCallback(e, clickedIdx, selectedIdxs);

    forceUpdate();
  };

  const renderItem = (itemInfo: ItemInfo, idx: number) => {
    if (!itemInfo) return <React.Fragment key={`itemListItem-${idx}`} />;

    const applyDisabledStyle = itemInfo.enabled ? {} : styles.disabledStyle;
    const itemContainerStyle = selectedIdxs.has(idx)
      ? styles.selectedItemStyle
      : {};

    return (
      <ItemContainer
        title={itemTooltip}
        style={itemContainerStyle}
        key={`itemListItem-${idx}`}
        onClick={(e) => itemClickHandler(e, idx)}
        onDoubleClick={
          itemDoubleClickHandler
            ? (e) => itemDoubleClickHandler(e, idx)
            : undefined
        }
        onContextMenu={(e: React.MouseEvent<HTMLInputElement>) => {
          itemRightClickHandler && itemRightClickHandler(e, idx);
        }}
      >
        {itemInfo.icon}
        <ItemTitle style={applyDisabledStyle}>{itemInfo.title}</ItemTitle>
        <ItemSubtitle style={applyDisabledStyle}>
          {itemInfo.subtitle}
        </ItemSubtitle>
      </ItemContainer>
    );
  };

  const onKeyDownHandler = (e: React.KeyboardEvent) => {
    if (
      (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
      selectedItemIdx === -1
    ) {
      setSelectedItemIdx(0);
      setSelectedIdxs(new Set([0]));
      return;
    }

    if (e.shiftKey) {
      const minIdx = Math.min(...selectedIdxs.values());
      const maxIdx = Math.max(...selectedIdxs.values());

      if (e.key === 'ArrowUp' && minIdx !== 0) {
        if (selectedItemIdx === maxIdx) {
          setSelectedIdxs(new Set([...selectedIdxs.values(), minIdx - 1]));
        } else {
          const newSet = selectedIdxs;
          newSet.delete(maxIdx);
          setSelectedIdxs(newSet);
          forceUpdate();
        }
      }
      if (e.key === 'ArrowDown' && maxIdx !== items.length - 1) {
        if (selectedItemIdx === minIdx) {
          setSelectedIdxs(new Set([...selectedIdxs.values(), maxIdx + 1]));
        } else {
          const newSet = selectedIdxs;
          newSet.delete(minIdx);
          setSelectedIdxs(newSet);
          forceUpdate();
        }
      }
    } else {
      if (e.key === 'ArrowUp' && selectedItemIdx !== 0) {
        const minIdx = Math.min(...selectedIdxs.values());
        setSelectedItemIdx(minIdx - 1);
        setSelectedIdxs(new Set([minIdx - 1]));
      }
      if (e.key === 'ArrowDown' && selectedItemIdx !== items.length - 1) {
        const maxIdx = Math.max(...selectedIdxs.values());
        setSelectedItemIdx(maxIdx + 1);
        setSelectedIdxs(new Set([maxIdx + 1]));
      }
    }
  };

  useEffect(() => {
    selectedItemIdxRef.current = selectedItemIdx;
  });

  const renderItems = () => {
    if (items.length === 0) {
      return (
        <ItemContainer
          style={{
            padding: '0px 0px 0px 0px',
          }}
        >
          <ItemTitle
            style={{
              textAlign: 'center',
            }}
          >
            List is empty!
          </ItemTitle>
        </ItemContainer>
      );
    }

    return _.map(items, (item, idx) => {
      return custemRenderItem
        ? custemRenderItem(
            item,
            idx,
            selectedItemIdx,
            selectedIdxs,
            itemClickHandler
          )
        : renderItem(item, idx);
    });
  };

  return {
    itemList: (
      <ItemOrderedList style={listStyle}>{renderItems()}</ItemOrderedList>
    ),
    clearIndex,
    onKeyDownHandler,
    selectedIdxs,
    selectedItemIdx,
    setSelectedIdxs,
  };
}

useItemList.defaultProps = {
  renderItem: undefined,
  listStyle: undefined,
  itemTooltip: undefined,
};
