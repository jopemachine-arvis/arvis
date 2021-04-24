/* eslint-disable react/destructuring-assignment */
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
import sidebarBg from '../../../../resources/images/sidebar_bg.jpg';
import SidebarTitle from './sidebarTitle';
import { PreferencePage } from '../preferencePageEnum';

type IProps = {
  page: PreferencePage;
  setPage: Function;
};

export default function Sidebar(props: IProps) {
  const { page } = props;

  const setPage = (pageToSet: PreferencePage) => {
    props.setPage(pageToSet);
  };

  return (
    <ProSidebar image={sidebarBg}>
      <SidebarHeader>
        <SidebarTitle>Preference</SidebarTitle>
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
            Installed workflows
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
      <SidebarFooter>
        <div>Footer</div>
      </SidebarFooter>
    </ProSidebar>
  );
}