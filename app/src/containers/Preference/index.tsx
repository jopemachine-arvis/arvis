import React from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { AiOutlineSetting, AiFillAlert } from 'react-icons/ai';
import './index.css';
import './sidebar.css';

export default function Preference() {
  return (
    <div>
      <ProSidebar>
        <Menu iconShape="square">
          <MenuItem icon={<AiOutlineSetting />}>General</MenuItem>
          <MenuItem icon={<AiOutlineSetting />}>Installed workflows</MenuItem>
          <MenuItem icon={<AiOutlineSetting />}>Theme</MenuItem>
          <MenuItem icon={<AiOutlineSetting />}>Advanced</MenuItem>
        </Menu>
      </ProSidebar>
    </div>
  );
}
