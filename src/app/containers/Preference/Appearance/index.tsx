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
import { StateType } from '@redux/reducers/types';
import './index.global.css';
import { SearchBar, SearchResultView, StyledInput } from '@components/index';
import { actionTypes as UIActionTypes } from '@redux/actions/uiConfig';
import {
  createGlobalConfigChangeHandler,
  getRandomColor,
  onNumberChangeHandler,
} from '@utils/index';
import { IPCMainEnum, IPCRendererEnum } from '@ipc/ipcEventEnum';
import _ from 'lodash';
import {
  OuterContainer,
  ConfigContainer,
  Header,
  PreviewContainer,
  PreviewMainContainer,
  ThemeListContainer,
  ThemeList,
  ThemeItemContainer,
  ThemeItemTitle,
  ThemeItemSubtitle,
} from './components';
import {
  descriptionContainerStyle,
  formGroupStyle,
  labelStyle,
  iconStyle,
} from './style';

const themes = require('./themes.json');

const themeInfos = {
  default: require('./Themes/default.json'),
  macOsWhite: require('./Themes/macos-white.json'),
};

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
    searchbar_automatch_font_color,
    searchbar_font_color,
    searchbar_font_size,
    searchbar_height,
    searchbar_dragger_color,
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

  const [previewBackgroundColor, setPreviewBackgroundColor] =
    useState<string>('#000000');

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

  const applyTheme = (themeJson: any) => {
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

    configChangeHandler(
      createFormEvent(themeJson.searchbar_automatch_font_color),
      UIActionTypes.SET_AUTOMATCH_FONT_COLOR
    );
  };

  const importTheme = (themePath: string) => {
    fse.readJson(themePath).then(applyTheme).catch(console.error);
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
    const defaultPath = path.resolve(homedir(), 'Desktop', `theme.arvistheme`);

    ipcRenderer.send(IPCRendererEnum.saveFile, {
      title: 'Select path to export arvistheme',
      defaultPath,
    });
  };

  const requestImportTheme = () => {
    ipcRenderer.send(IPCRendererEnum.importTheme);
  };

  const themeItemClickHandler = (fileName: string) => {
    applyTheme((themeInfos as any)[fileName]);
  };

  const renderThemeItem = (themeInfo: any, fileName: string) => {
    if (!themeInfo) return <React.Fragment key={`pluginItem-${fileName}`} />;
    const { title, subtitle } = themeInfo;

    return (
      <ThemeItemContainer
        key={`pluginItem-${fileName}`}
        onClick={(e) => themeItemClickHandler(fileName)}
      >
        <ThemeItemTitle>{title}</ThemeItemTitle>
        <ThemeItemSubtitle>{subtitle}</ThemeItemSubtitle>
      </ThemeItemContainer>
    );
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
            hasContextMenu={false}
            draggerColor={searchbar_dragger_color}
            itemLeftPadding={item_left_padding}
            searchbarAutomatchFontColor={searchbar_automatch_font_color}
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
            noShowIcon={false}
            onDoubleClickHandler={() => {}}
            onMouseoverHandler={() => {}}
            searchbarHeight={searchbar_height}
            searchResult={mockItems}
            searchWindowTransparency={search_window_transparency}
            searchWindowWidth={search_window_width}
            selectedItemBackgroundColor={selected_item_background_color}
            selectedItemFontColor={selected_item_font_color}
            selectedItemIdx={0}
            startIdx={0}
            subtitleFontSize={subtitle_font_size}
            titleFontSize={title_font_size}
          />
        </PreviewMainContainer>
      </PreviewContainer>
      <ThemeListContainer>
        <Header>Theme</Header>
        <ThemeList>
          {_.map(themes, (themeInfo, fileName) => {
            return renderThemeItem(themeInfo, fileName);
          })}
        </ThemeList>
      </ThemeListContainer>
      <ConfigContainer>
        <Header>Config</Header>
        <Form style={descriptionContainerStyle}>
          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Window Width</Label>
            <StyledInput
              type="number"
              min={400}
              max={2000}
              defaultValue={search_window_width}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 400,
                  max: 2000,
                  actionType: UIActionTypes.SET_SEARCH_WINDOW_WIDTH,
                  dispatch,
                })
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Window Footer Height</Label>
            <StyledInput
              type="number"
              min={0}
              max={100}
              defaultValue={search_window_footer_height}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 0,
                  max: 100,
                  actionType: UIActionTypes.SET_SEARCH_WINDOW_FOOTER_HEIGHT,
                  dispatch,
                })
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Window border radius</Label>
            <StyledInput
              min={0}
              max={30}
              type="number"
              defaultValue={search_window_border_radius}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 0,
                  max: 30,
                  actionType: UIActionTypes.SET_SEARCH_WINDOW_BORDER_RADIUS,
                  dispatch,
                })
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
              defaultValue={search_window_transparency}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 0,
                  max: 255,
                  actionType: UIActionTypes.SET_SEARCH_WINDOW_TRANSPARENCY,
                  dispatch,
                })
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item Height</Label>
            <StyledInput
              type="number"
              min={10}
              max={150}
              defaultValue={item_height}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 10,
                  max: 150,
                  actionType: UIActionTypes.SET_ITEM_HEIGHT,
                  dispatch,
                })
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
              min={8}
              max={50}
              defaultValue={title_font_size}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 8,
                  max: 50,
                  actionType: UIActionTypes.SET_TITLE_FONTSIZE,
                  dispatch,
                })
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Subtitle font size</Label>
            <StyledInput
              type="number"
              min={8}
              max={50}
              defaultValue={subtitle_font_size}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 8,
                  max: 50,
                  actionType: UIActionTypes.SET_SUBTITLE_FONTSIZE,
                  dispatch,
                })
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
            <Label style={labelStyle}>Searchbar auto match font color</Label>
            <StyledInput
              type="color"
              value={searchbar_automatch_font_color}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(e, UIActionTypes.SET_AUTOMATCH_FONT_COLOR)
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Searchbar dragger color</Label>
            <StyledInput
              type="color"
              value={searchbar_dragger_color}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                configChangeHandler(
                  e,
                  UIActionTypes.SET_SEARCHBAR_DRAGGER_COLOR
                )
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Item left padding</Label>
            <StyledInput
              type="number"
              min={0}
              max={30}
              defaultValue={item_left_padding}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 0,
                  max: 30,
                  actionType: UIActionTypes.SET_ITEM_LEFT_PADDING,
                  dispatch,
                })
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Margin between title and subtitle</Label>
            <StyledInput
              type="number"
              min={0}
              max={30}
              defaultValue={item_title_subtitle_margin}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 0,
                  max: 30,
                  actionType: UIActionTypes.SET_TITLE_SUBTITLE_MARGIN,
                  dispatch,
                })
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Search bar Height</Label>
            <StyledInput
              type="number"
              min={40}
              max={180}
              defaultValue={searchbar_height}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 40,
                  max: 180,
                  actionType: UIActionTypes.SET_SEARCHBAR_HEIGHT,
                  dispatch,
                })
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Icon right margin</Label>
            <StyledInput
              type="number"
              min={0}
              max={30}
              defaultValue={icon_right_margin}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 0,
                  max: 30,
                  actionType: UIActionTypes.SET_ICON_RIGHT_MARGIN,
                  dispatch,
                })
              }
            />
          </FormGroup>

          <FormGroup style={formGroupStyle}>
            <Label style={labelStyle}>Search bar Font size</Label>
            <StyledInput
              type="number"
              min={8}
              max={30}
              defaultValue={searchbar_font_size}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 8,
                  max: 30,
                  actionType: UIActionTypes.SET_SEARCHBAR_FONTSIZE,
                  dispatch,
                })
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
              min={0}
              max={8}
              defaultValue={search_window_scrollbar_width}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                onNumberChangeHandler(e, {
                  min: 0,
                  max: 8,
                  actionType: UIActionTypes.SET_SEARCHWINDOW_SCROLLBAR_WIDTH,
                  dispatch,
                })
              }
            />
          </FormGroup>
        </Form>
      </ConfigContainer>
    </OuterContainer>
  );
}
