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
import { actionTypes as UIActionTypes } from '../../../redux/actions/uiConfig';
import {
  createGlobalConfigChangeHandler,
  getRandomColor
} from '../../../utils';
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

  const configChangeHandler = createGlobalConfigChangeHandler({
    destWindow: 'searchWindow',
    dispatch
  });

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
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_SEARCH_WINDOW_WIDTH)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Window Footer Height</Label>
            <StyledInput
              type="number"
              value={search_window_footer_height}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(
                  e,
                  UIActionTypes.SET_SEARCH_WINDOW_FOOTER_HEIGHT
                )
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item Height</Label>
            <StyledInput
              type="number"
              value={item_height}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_ITEM_HEIGHT)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item background color</Label>
            <StyledInput
              type="color"
              value={item_background_color}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_ITEM_BACKGROUND_COLOR)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Selected item background color</Label>
            <StyledInput
              type="color"
              value={selected_item_background_color}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(
                  e,
                  UIActionTypes.SET_SELECTED_ITEM_BACKGROUND_COLOR
                )
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Title font size</Label>
            <StyledInput
              type="number"
              value={title_font_size}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_TITLE_FONTSIZE)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Subtitle font size</Label>
            <StyledInput
              type="number"
              value={subtitle_font_size}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_SUBTITLE_FONTSIZE)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item font color</Label>
            <StyledInput
              type="color"
              value={item_font_color}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_ITEM_FONTCOLOR)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Selected item font color</Label>
            <StyledInput
              type="color"
              value={selected_item_font_color}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(
                  e,
                  UIActionTypes.SET_SELECTED_ITEM_FONTCOLOR
                )
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Searchbar font color</Label>
            <StyledInput
              type="color"
              value={searchbar_font_color}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_SEARCHBAR_FONTCOLOR)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item left padding</Label>
            <StyledInput
              type="number"
              value={item_left_padding}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_ITEM_LEFT_PADDING)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Margin between title and subtitle</Label>
            <StyledInput
              type="number"
              value={item_title_subtitle_margin}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_TITLE_SUBTITLE_MARGIN)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Search bar Height</Label>
            <StyledInput
              type="number"
              value={searchbar_height}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_SEARCHBAR_HEIGHT)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Icon right margin</Label>
            <StyledInput
              type="number"
              value={icon_right_margin}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_ICON_RIGHT_MARGIN)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Search bar Font size</Label>
            <StyledInput
              type="number"
              value={searchbar_font_size}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_SEARCHBAR_FONTSIZE)
              }
            />
          </FormGroup>
        </Form>
      </ConfigContainer>
    </OuterContainer>
  );
}
