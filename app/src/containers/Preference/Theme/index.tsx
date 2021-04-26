/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { StateType } from '../../../redux/reducers/types';

import {
  OuterContainer,
  ConfigContainer,
  Header,
  PreviewContainer,
  PreviewMainContainer
} from './components';

import { SearchBar, SearchResultView } from '../../../components';

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
  backgroundColor: '#23262E',
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
    item_background_color,
    item_font_color,
    item_height,
    item_left_padding,
    item_top_padding,
    searchbar_font_size,
    searchbar_height,
    search_window_height,
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
            backgroundColor: item_background_color,
            width: search_window_width,
            height: search_window_height,
            borderRadius: 10
          }}
          onWheel={() => {}}
        >
          <SearchBar setInputStr={() => {}} />
          <SearchResultView
            itemHeight={item_height}
            startIdx={0}
            selectedItemIdx={0}
            searchbarHeight={searchbar_height}
            maxItemCount={mockItems.length + 1}
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
            <Input
              type="number"
              value={search_window_width}
              onChange={e =>
                configChangeHandler(e, UIConfigActions.setSearchWindowWidth)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Window Height</Label>
            <Input
              type="number"
              value={search_window_height}
              onChange={e =>
                configChangeHandler(e, UIConfigActions.setSearchWindowHeight)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item Height</Label>
            <Input
              type="number"
              value={item_height}
              onChange={e =>
                configChangeHandler(e, UIConfigActions.setItemHeight)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item background color</Label>
            <Input
              type="color"
              value={item_background_color}
              onChange={e =>
                configChangeHandler(e, UIConfigActions.setItemBackgroundColor)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Selected item background color</Label>
            <Input
              type="color"
              value={selected_item_background_color}
              onChange={e =>
                configChangeHandler(
                  e,
                  UIConfigActions.setSelectedItemBackgroundColor
                )
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Title font size</Label>
            <Input
              type="number"
              value={title_font_size}
              onChange={e =>
                configChangeHandler(e, UIConfigActions.setTitleFontSize)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Subtitle font size</Label>
            <Input
              type="number"
              value={subtitle_font_size}
              onChange={e =>
                configChangeHandler(e, UIConfigActions.setSubTitleFontSize)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item font color</Label>
            <Input
              type="color"
              value={item_font_color}
              onChange={e =>
                configChangeHandler(e, UIConfigActions.setItemFontColor)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Selected item font color</Label>
            <Input
              type="color"
              value={selected_item_font_color}
              onChange={e =>
                configChangeHandler(e, UIConfigActions.setItemFontColor)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item left padding</Label>
            <Input
              type="number"
              value={item_left_padding}
              onChange={e =>
                configChangeHandler(e, UIConfigActions.setItemLeftPadding)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item top padding</Label>
            <Input
              type="number"
              value={item_top_padding}
              onChange={e =>
                configChangeHandler(e, UIConfigActions.setItemTopPadding)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Search bar Height</Label>
            <Input
              type="number"
              value={searchbar_height}
              onChange={e =>
                configChangeHandler(e, UIConfigActions.setSearchBarHeight)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Search bar Font size</Label>
            <Input
              type="number"
              value={searchbar_font_size}
              onChange={e =>
                configChangeHandler(e, UIConfigActions.setSearchBarFontSize)
              }
            />
          </FormGroup>
        </Form>
      </ConfigContainer>
    </OuterContainer>
  );
}
