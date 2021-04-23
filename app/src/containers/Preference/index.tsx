import React from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
  SidebarFooter
} from 'react-pro-sidebar';
import {
  AiOutlineSetting,
  AiOutlineFormatPainter,
  AiOutlineTool,
  AiOutlineAppstore
} from 'react-icons/ai';
import './index.global.css';
import './sidebar.global.css';
import styled from 'styled-components';
import sidebarBg from '../../../resources/images/sidebar_bg.jpg';
import SidebarTitle from './sidebarTitle';

const OuterContainer = styled.div`
  height: 100vh;
  width: 100vh;
`;

export default function PreferenceWindow() {
  return (
    <OuterContainer>
      <ProSidebar image={sidebarBg}>
        <SidebarHeader>
          <SidebarTitle>Preference</SidebarTitle>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem icon={<AiOutlineSetting />}>General</MenuItem>
            <MenuItem icon={<AiOutlineAppstore />}>
              Installed workflows
            </MenuItem>
            <MenuItem icon={<AiOutlineFormatPainter />}>Theme</MenuItem>
            <MenuItem icon={<AiOutlineTool />}>Advanced</MenuItem>
          </Menu>
        </SidebarContent>
        <SidebarFooter>
          <div>Footer</div>
        </SidebarFooter>
      </ProSidebar>
    </OuterContainer>
  );
}
