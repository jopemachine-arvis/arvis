import React from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from 'react-pro-sidebar';
import {
  AiOutlineSetting,
  AiOutlineFormatPainter,
  AiOutlineTool,
  AiOutlineAppstore,
  AiTwotoneThunderbolt,
} from 'react-icons/ai';
import './index.global.css';
import './sidebar.global.css';
import styled from 'styled-components';
import sidebarBg from '../../../../../assets/images/sidebar_bg.jpg';
import SidebarTitle from './sidebarTitle';
import { PreferencePage } from '../preferencePageEnum';

type IProps = {
  page: PreferencePage;
  setPage: (page: PreferencePage) => void;
};

const OuterContainer = styled.div`
  user-select: none;
`;

export default function Sidebar(props: IProps) {
  const { page } = props;

  const setPage = (pageToSet: PreferencePage) => {
    props.setPage(pageToSet);
  };

  return (
    <OuterContainer>
      <ProSidebar image={sidebarBg}>
        <SidebarHeader>
          <SidebarTitle>{page}</SidebarTitle>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem
              onClick={() => setPage(PreferencePage.General)}
              icon={<AiOutlineSetting />}
              active={page === PreferencePage.General}
            >
              General
            </MenuItem>
            <MenuItem
              onClick={() => setPage(PreferencePage.Workflow)}
              icon={<AiOutlineAppstore />}
              active={page === PreferencePage.Workflow}
            >
              Workflows
            </MenuItem>
            <MenuItem
              onClick={() => setPage(PreferencePage.Plugin)}
              icon={<AiTwotoneThunderbolt />}
              active={page === PreferencePage.Plugin}
            >
              Plugins
            </MenuItem>
            <MenuItem
              onClick={() => setPage(PreferencePage.Theme)}
              icon={<AiOutlineFormatPainter />}
              active={page === PreferencePage.Theme}
            >
              Theme
            </MenuItem>
            <MenuItem
              onClick={() => setPage(PreferencePage.Advanced)}
              icon={<AiOutlineTool />}
              active={page === PreferencePage.Advanced}
            >
              Advanced
            </MenuItem>
          </Menu>
        </SidebarContent>
      </ProSidebar>
    </OuterContainer>
  );
}
