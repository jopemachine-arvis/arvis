/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Label } from 'reactstrap';
import { IoMdColorPalette } from 'react-icons/io';
import { BiExport, BiImport } from 'react-icons/bi';
import { ipcRenderer } from 'electron';
import fse from 'fs-extra';
import { homedir } from 'os';
import path from 'path';
import { StateType } from '../../../redux/reducers/types';
import './index.global.css';
import {
  OuterContainer,
  ConfigContainer,
  Header,
  PreviewContainer,
  PreviewMainContainer,
} from './components';
import { SearchBar, SearchResultView, StyledInput } from '../../../components';
import { actionTypes as UIActionTypes } from '../../../redux/actions/uiConfig';
import {
  createGlobalConfigChangeHandler,
  getRandomColor,
} from '../../../utils';
import {
  descriptionContainerStyle,
  formGroupStyle,
  labelStyle,
  iconStyle,
} from './style';
import { IPCMainEnum, IPCRendererEnum } from '../../../ipc/ipcEventEnum';

const mockItems = [
  {
    title: 'Selected Item',
    subtitle: 'Subtitle',
  },
  {
    title: 'Normal Item',
    subtitle: 'Subtitle',
  },
  {
    title: 'Normal Item',
    subtitle: 'Subtitle',
  },
  {
    title: 'Normal Item',
    subtitle: 'Subtitle',
  },
];

export default function Appearance() {
  const theme = useSelector((state: StateType) => state.ui_config);
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
    search_window_border_radius,
    search_window_footer_height,
    search_window_scrollbar_color,
    search_window_scrollbar_width,
    search_window_transparency,
    search_window_width,
    selected_item_background_color,
    selected_item_font_color,
    subtitle_font_size,
    title_font_size,
  } = theme;

  const dispatch = useDispatch();

  const [previewBackgroundColor, setPreviewBackgroundColor] = useState<string>(
    '#000000'
  );

  const configChangeHandler = createGlobalConfigChangeHandler({
    destWindow: 'searchWindow',
    dispatch,
  });

  const createFormEvent = (value: any) => {
    return {
      currentTarget: {
        value,
      },
    } as React.FormEvent<HTMLInputElement>;
  };

  const exportTheme = (out: string) => {
    fse.writeJSON(out, theme, { encoding: 'utf8', spaces: 4 });
  };

  const importTheme = (themePath: string) => {
    console.log('e');
    fse
      .readJson(themePath)
      .then((themeJson) => {
        console.log('d');
        configChangeHandler(
          createFormEvent(themeJson.icon_right_margin),
          UIActionTypes.SET_ICON_RIGHT_MARGIN
        );

        configChangeHandler(
          createFormEvent(themeJson.item_background_color),
          UIActionTypes.SET_ITEM_BACKGROUND_COLOR
        );

        configChangeHandler(
          createFormEvent(themeJson.item_font_color),
          UIActionTypes.SET_ITEM_FONTCOLOR
        );

        configChangeHandler(
          createFormEvent(themeJson.item_height),
          UIActionTypes.SET_ITEM_HEIGHT
        );

        configChangeHandler(
          createFormEvent(themeJson.item_left_padding),
          UIActionTypes.SET_ITEM_LEFT_PADDING
        );

        configChangeHandler(
          createFormEvent(themeJson.item_title_subtitle_margin),
          UIActionTypes.SET_TITLE_SUBTITLE_MARGIN
        );

        configChangeHandler(
          createFormEvent(themeJson.searchbar_font_color),
          UIActionTypes.SET_SEARCHBAR_FONTCOLOR
        );

        configChangeHandler(
          createFormEvent(themeJson.searchbar_font_size),
          UIActionTypes.SET_SEARCHBAR_FONTSIZE
        );

        configChangeHandler(
          createFormEvent(themeJson.searchbar_height),
          UIActionTypes.SET_SEARCHBAR_HEIGHT
        );

        configChangeHandler(
          createFormEvent(themeJson.search_window_border_radius),
          UIActionTypes.SET_SEARCH_WINDOW_BORDER_RADIUS
        );

        configChangeHandler(
          createFormEvent(themeJson.search_window_footer_height),
          UIActionTypes.SET_SEARCH_WINDOW_FOOTER_HEIGHT
        );

        configChangeHandler(
          createFormEvent(themeJson.search_window_transparency),
          UIActionTypes.SET_SEARCH_WINDOW_TRANSPARENCY
        );

        configChangeHandler(
          createFormEvent(themeJson.search_window_width),
          UIActionTypes.SET_SEARCH_WINDOW_WIDTH
        );

        configChangeHandler(
          createFormEvent(themeJson.selected_item_background_color),
          UIActionTypes.SET_SELECTED_ITEM_BACKGROUND_COLOR
        );

        configChangeHandler(
          createFormEvent(themeJson.selected_item_font_color),
          UIActionTypes.SET_SELECTED_ITEM_FONTCOLOR
        );

        configChangeHandler(
          createFormEvent(themeJson.subtitle_font_size),
          UIActionTypes.SET_SUBTITLE_FONTSIZE
        );

        configChangeHandler(
          createFormEvent(themeJson.title_font_size),
          UIActionTypes.SET_TITLE_FONTSIZE
        );

        configChangeHandler(
          createFormEvent(themeJson.selected_item_font_color),
          UIActionTypes.SET_SELECTED_ITEM_FONTCOLOR
        );

        configChangeHandler(
          createFormEvent(themeJson.search_window_scrollbar_color),
          UIActionTypes.SET_SEARCHWINDOW_SCROLLBAR_COLOR
        );

        configChangeHandler(
          createFormEvent(themeJson.search_window_scrollbar_width),
          UIActionTypes.SET_SEARCHWINDOW_SCROLLBAR_WIDTH
        );

        return null;
      })
      .catch(console.error);
  };

  const ipcCallbackTbl = {
    saveFileRet: (e: Electron.IpcRendererEvent, { file }: { file: any }) => {
      if (file.filePath) {
        exportTheme(file.filePath);
      }
    },
    importThemeRet: (e: Electron.IpcRendererEvent, { file }: { file: any }) => {
      if (file.filePaths) {
        importTheme(file.filePaths[0]);
      }
    },
  };

  useEffect(() => {
    ipcRenderer.on(IPCMainEnum.saveFileRet, ipcCallbackTbl.saveFileRet);
    ipcRenderer.on(IPCMainEnum.importThemeRet, ipcCallbackTbl.importThemeRet);

    return () => {
      ipcRenderer.off(IPCMainEnum.saveFileRet, ipcCallbackTbl.saveFileRet);
      ipcRenderer.off(
        IPCMainEnum.importThemeRet,
        ipcCallbackTbl.importThemeRet
      );
    };
  }, []);

  const changeBackgroundColor = () => {
    setPreviewBackgroundColor(getRandomColor());
  };

  const requestExportTheme = () => {
    const defaultPath = `${homedir()}${path.sep}Desktop${
      path.sep
    }theme.arvistheme`;

    ipcRenderer.send(IPCRendererEnum.saveFile, {
      title: 'Select path to export arvistheme',
      defaultPath,
    });
  };

  const requestImportTheme = () => {
    ipcRenderer.send(IPCRendererEnum.importTheme);
  };

  return (
    <OuterContainer>
      <IoMdColorPalette
        className="theme-page-buttons"
        style={iconStyle}
        onClick={() => changeBackgroundColor()}
      />
      <BiExport
        className="theme-page-buttons"
        style={{ ...iconStyle, left: Number(iconStyle.left!) + 60 }}
        onClick={() => requestExportTheme()}
      />
      <BiImport
        className="theme-page-buttons"
        style={{ ...iconStyle, left: Number(iconStyle.left!) + 120 }}
        onClick={() => requestImportTheme()}
      />
      <PreviewContainer
        style={{
          backgroundColor: previewBackgroundColor,
        }}
      >
        <PreviewMainContainer
          style={{
            borderRadius: search_window_border_radius,
            backgroundColor: item_background_color,
            width: search_window_width,
            height:
              item_height * mockItems.length +
              searchbar_height +
              search_window_footer_height,
          }}
          onWheel={() => {}}
        >
          <SearchBar
            alwaysFocus={false}
            itemLeftPadding={item_left_padding}
            searchbarFontColor={searchbar_font_color}
            searchbarFontSize={searchbar_font_size}
            searchbarHeight={searchbar_height}
          />
          <SearchResultView
            demo
            footerHeight={search_window_footer_height}
            iconRightMargin={icon_right_margin}
            itemBackgroundColor={item_background_color}
            itemFontColor={item_font_color}
            itemHeight={item_height}
            itemLeftPadding={item_left_padding}
            itemTitleSubtitleMargin={item_title_subtitle_margin}
            maxItemCount={mockItems.length}
            onDoubleClickHandler={() => {}}
            onMouseoverHandler={() => {}}
            searchbarHeight={searchbar_height}
            searchResult={mockItems}
            searchWindowTransparency={search_window_transparency}
            selectedItemBackgroundColor={selected_item_background_color}
            selectedItemFontColor={selected_item_font_color}
            selectedItemIdx={0}
            startIdx={0}
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
              min={100}
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
              min={0}
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
            <Label style={labelStyle}>Window border radius</Label>
            <StyledInput
              min={0}
              type="number"
              value={search_window_border_radius}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(
                  e,
                  UIActionTypes.SET_SEARCH_WINDOW_BORDER_RADIUS
                )
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Window Transparency</Label>
            <StyledInput
              type="number"
              min={0}
              max={255}
              maxLength={3}
              value={search_window_transparency}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(
                  e,
                  UIActionTypes.SET_SEARCH_WINDOW_TRANSPARENCY
                )
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item Height</Label>
            <StyledInput
              min={10}
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

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Search window scrollbar color</Label>
            <StyledInput
              type="color"
              value={search_window_scrollbar_color}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(
                  e,
                  UIActionTypes.SET_SEARCHWINDOW_SCROLLBAR_COLOR
                )
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Search window scrollbar width</Label>
            <StyledInput
              type="number"
              value={search_window_scrollbar_width}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(
                  e,
                  UIActionTypes.SET_SEARCHWINDOW_SCROLLBAR_WIDTH
                )
              }
            />
          </FormGroup>
        </Form>
      </ConfigContainer>
    </OuterContainer>
  );
}