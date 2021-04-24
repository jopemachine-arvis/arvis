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
  setPage: Function;
};

export default function Sidebar(props: IProps) {
  const setPage = (page: PreferencePage) => {
    props.setPage(page);
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
          >
            General
          </MenuItem>
          <MenuItem
            onClick={() => setPage(PreferencePage.InstalledWorkflow)}
            icon={<AiOutlineAppstore />}
          >
            Installed workflows
          </MenuItem>
          <MenuItem
            onClick={() => setPage(PreferencePage.Theme)}
            icon={<AiOutlineFormatPainter />}
          >
            Theme
          </MenuItem>
          <MenuItem
            onClick={() => setPage(PreferencePage.Advanced)}
            icon={<AiOutlineTool />}
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
