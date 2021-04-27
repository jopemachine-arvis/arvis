/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Label } from 'reactstrap';
import { StateType } from '../../../redux/reducers/types';

import {
  OuterContainer,
  ConfigContainer,
  Header,
  PreviewContainer,
  PreviewMainContainer
} from './components';

import { SearchBar, SearchResultView, StyledInput } from '../../../components';

import { UIConfigActions } from '../../../redux/actions';

import { isNumeric } from '../../../utils';

const formGroupStyle = {
  marginBottom: 15,
  width: '75%',
  flexDirection: 'row',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const labelStyle = {
  fontSize: 13,
  color: '#ffffff',
  width: 400,
  marginRight: 15
};

const descriptionContainerStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#1f2228',
  paddingTop: 10,
  paddingBottom: 10,
  borderRadius: 10,
  marginLeft: 20,
  marginRight: 20
};

const mockItems = [
  {
    title: 'selected item',
    subtitle: 'subtitle'
  },
  {
    title: 'normal item',
    subtitle: 'subtitle'
  },
  {
    title: 'normal item',
    subtitle: 'subtitle'
  },
  {
    title: 'normal item',
    subtitle: 'subtitle'
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

  const configChangeHandler = (e: any, action: any) => {
    const target: string | number = isNumeric(e.target.value)
      ? Number(e.target.value)
      : e.target.value;

    dispatch(action(target));
  };

  return (
    <OuterContainer>
      <PreviewContainer>
        <PreviewMainContainer
          style={{
            borderRadius: 10,
            backgroundColor: item_background_color,
            width: search_window_width,
            height:
              item_height * mockItems.length +
              searchbar_height +
              search_window_footer_height
          }}
          onWheel={() => {}}
        >
          <SearchBar alwaysFocus={false} setInputStr={() => {}} />
          <SearchResultView
            demo
            itemHeight={item_height}
            searchbarHeight={searchbar_height}
            footerHeight={search_window_footer_height}
            startIdx={0}
            selectedItemIdx={0}
            maxItemCount={mockItems.length}
            searchResult={mockItems}
            onDoubleClickHandler={() => {}}
            onMouseoverHandler={() => {}}
          />
        </PreviewMainContainer>
      </PreviewContainer>
      <ConfigContainer>
        <Header>Theme config</Header>
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
