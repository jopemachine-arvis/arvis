/* eslint-disable react/jsx-curly-newline */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Label } from 'reactstrap';
import { IoMdColorPalette } from 'react-icons/io';
import { StateType } from '../../../redux/reducers/types';
import './index.global.css';

import {
  OuterContainer,
  ConfigContainer,
  Header,
  PreviewContainer,
  PreviewMainContainer
} from './components';

import { SearchBar, SearchResultView, StyledInput } from '../../../components';
import { UIConfigActions } from '../../../redux/actions';
import { isNumeric, getRandomColor } from '../../../utils';
import {
  descriptionContainerStyle,
  formGroupStyle,
  labelStyle,
  iconStyle
} from './style';

const mockItems = [
  {
    title: 'Selected Item',
    subtitle: 'Subtitle'
  },
  {
    title: 'Normal Item',
    subtitle: 'Subtitle'
  },
  {
    title: 'Normal Item',
    subtitle: 'Subtitle'
  },
  {
    title: 'Normal Item',
    subtitle: 'Subtitle'
  }
];

export default function Theme() {
  const {
    icon_right_margin,
    item_background_color,
    item_font_color,
    item_height,
    item_left_padding,
    item_title_subtitle_margin,
    searchbar_font_color,
    searchbar_font_size,
    searchbar_height,
    search_window_footer_height,
    search_window_width,
    selected_item_background_color,
    selected_item_font_color,
    subtitle_font_size,
    title_font_size
  } = useSelector((state: StateType) => state.uiConfig);

  const dispatch = useDispatch();

  const [previewBackgroundColor, setPreviewBackgroundColor] = useState<string>(
    '#000000'
  );

  const configChangeHandler = (e: any, action: any) => {
    const target: string | number = isNumeric(e.target.value)
      ? Number(e.target.value)
      : e.target.value;

    // Fix me!!
    // When dispatched from a preference window, action is not dispatched to a search window.
    // So, therefore, it should be dispatched to all windows via ipc.
    dispatch(action(target));

    // Example:
    // ipcRenderer.send('theme-changed', { actionNameToDispatch: 'some_color', arg: '#000000' });
  };

  const changeBackgroundColor = () => {
    setPreviewBackgroundColor(getRandomColor());
  };

  return (
    <OuterContainer>
      <IoMdColorPalette
        className="theme-page-buttons"
        style={iconStyle}
        onClick={() => changeBackgroundColor()}
      />
      <PreviewContainer
        style={{
          backgroundColor: previewBackgroundColor
        }}
      >
        <PreviewMainContainer
          style={{
            backgroundColor: item_background_color,
            width: search_window_width,
            height:
              item_height * mockItems.length +
              searchbar_height +
              search_window_footer_height
          }}
          onWheel={() => {}}
        >
          <SearchBar
            itemBackgroundColor={item_background_color}
            itemLeftPadding={item_left_padding}
            searchbarFontColor={searchbar_font_color}
            searchbarFontSize={searchbar_font_size}
            searchbarHeight={searchbar_height}
            alwaysFocus={false}
            setInputStr={() => {}}
          />
          <SearchResultView
            demo
            startIdx={0}
            selectedItemIdx={0}
            maxItemCount={mockItems.length}
            searchResult={mockItems}
            onDoubleClickHandler={() => {}}
            onMouseoverHandler={() => {}}
            itemHeight={item_height}
            searchbarHeight={searchbar_height}
            footerHeight={search_window_footer_height}
            iconRightMargin={icon_right_margin}
            itemBackgroundColor={item_background_color}
            itemFontColor={item_font_color}
            itemLeftPadding={item_left_padding}
            itemTitleSubtitleMargin={item_title_subtitle_margin}
            selectedItemBackgroundColor={selected_item_background_color}
            selectedItemFontColor={selected_item_font_color}
            subtitleFontSize={subtitle_font_size}
            titleFontSize={title_font_size}
          />
        </PreviewMainContainer>
      </PreviewContainer>
      <ConfigContainer>
        <Header>Config</Header>
        <Form style={descriptionContainerStyle}>
          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Window Width</Label>
            <StyledInput
              type="number"
              value={search_window_width}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setSearchWindowWidth)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Window Footer Height</Label>
            <StyledInput
              type="number"
              value={search_window_footer_height}
              onChange={(e: any) =>
                configChangeHandler(
                  e,
                  UIConfigActions.setSearchWindowFooterHeight
                )
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item Height</Label>
            <StyledInput
              type="number"
              value={item_height}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setItemHeight)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item background color</Label>
            <StyledInput
              type="color"
              value={item_background_color}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setItemBackgroundColor)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Selected item background color</Label>
            <StyledInput
              type="color"
              value={selected_item_background_color}
              onChange={(e: any) =>
                configChangeHandler(
                  e,
                  UIConfigActions.setSelectedItemBackgroundColor
                )
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Title font size</Label>
            <StyledInput
              type="number"
              value={title_font_size}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setTitleFontSize)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Subtitle font size</Label>
            <StyledInput
              type="number"
              value={subtitle_font_size}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setSubTitleFontSize)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item font color</Label>
            <StyledInput
              type="color"
              value={item_font_color}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setItemFontColor)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Selected item font color</Label>
            <StyledInput
              type="color"
              value={selected_item_font_color}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setItemFontColor)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Searchbar font color</Label>
            <StyledInput
              type="color"
              value={searchbar_font_color}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setSearchBarFontColor)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item left padding</Label>
            <StyledInput
              type="number"
              value={item_left_padding}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setItemLeftPadding)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Margin between title and subtitle</Label>
            <StyledInput
              type="number"
              value={item_title_subtitle_margin}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setTitleSubTitleMargin)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Search bar Height</Label>
            <StyledInput
              type="number"
              value={searchbar_height}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setSearchBarHeight)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Icon right margin</Label>
            <StyledInput
              type="number"
              value={icon_right_margin}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setIconRightMargin)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Search bar Font size</Label>
            <StyledInput
              type="number"
              value={searchbar_font_size}
              onChange={(e: any) =>
                configChangeHandler(e, UIConfigActions.setSearchBarFontSize)
              }
            />
          </FormGroup>
        </Form>
      </ConfigContainer>
    </OuterContainer>
  );
}
