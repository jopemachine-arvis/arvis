import React, { useState, useEffect } from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarContent,
  SidebarFooter,
  SubMenu,
} from 'react-pro-sidebar';
import {
  AiTwotoneThunderbolt,
  AiFillAppstore,
  AiFillTool,
  AiFillSetting,
  AiFillFormatPainter,
  AiFillInteraction,
} from 'react-icons/ai';
import { BiStore } from 'react-icons/bi';
import { FaClipboardList, FaGithub } from 'react-icons/fa';
import { GrTextAlignFull } from 'react-icons/gr';
import open from 'open';
import styled from 'styled-components';
import sidebarBg from '../../../../../assets/images/sidebar_bg.jpg';
import { PreferencePage } from '../preferencePageEnum';
import './index.css';

type IProps = {
  page: PreferencePage;
  setPage: (page: PreferencePage) => void;
};

const OuterContainer = styled.div`
  user-select: none;
  position: relative;
  height: 100vh;
`;

export default function Sidebar(props: IProps) {
  const { page } = props;

  const setPage = (pageToSet: PreferencePage) => {
    props.setPage(pageToSet);
  };

  const [collapsed, setCollapsed] = useState<boolean>(true);

  const [showSubMenu, setShowSubMenu] = useState<boolean>(false);

  useEffect(() => {
    if (collapsed) {
      setShowSubMenu(false);
    } else {
      setShowSubMenu(true);
    }
  }, [collapsed]);

  return (
    <OuterContainer
      onMouseEnter={() => {
        setCollapsed(false);
      }}
      onMouseLeave={() => {
        setCollapsed(true);
      }}
    >
      <ProSidebar image={sidebarBg} collapsed={collapsed}>
        <SidebarContent
          style={{
            marginTop: 45,
          }}
        >
          <Menu iconShape="circle" popperArrow>
            <MenuItem
              onClick={() => setPage(PreferencePage.General)}
              icon={<AiFillSetting />}
              active={page === PreferencePage.General}
            >
              General
            </MenuItem>

            <MenuItem
              onClick={() => setPage(PreferencePage.Workflow)}
              icon={<AiFillAppstore />}
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
              onClick={() => setPage(PreferencePage.Appearance)}
              icon={<AiFillFormatPainter />}
              active={page === PreferencePage.Appearance}
            >
              Appearance
            </MenuItem>

            <MenuItem
              onClick={() => setPage(PreferencePage.ClipboardHistory)}
              icon={<FaClipboardList />}
              active={page === PreferencePage.ClipboardHistory}
            >
              Clipboard History
            </MenuItem>

            <MenuItem
              onClick={() => setPage(PreferencePage.Snippet)}
              icon={<GrTextAlignFull />}
              active={page === PreferencePage.Snippet}
            >
              Snippet
            </MenuItem>

            <MenuItem
              onClick={() => setPage(PreferencePage.UniversalAction)}
              icon={<AiFillInteraction />}
              active={page === PreferencePage.UniversalAction}
            >
              Universal Action
            </MenuItem>

            <MenuItem
              onClick={() => setPage(PreferencePage.Store)}
              icon={<BiStore />}
              active={page === PreferencePage.Store}
            >
              Store
            </MenuItem>

            <SubMenu title="Advanced" icon={<AiFillTool />}>
              {showSubMenu && (
                <>
                  <MenuItem
                    onClick={() => setPage(PreferencePage.AdvancedHistory)}
                    active={page === PreferencePage.AdvancedHistory}
                  >
                    History
                  </MenuItem>

                  <MenuItem
                    onClick={() => setPage(PreferencePage.AdvancedPlugin)}
                    active={page === PreferencePage.AdvancedPlugin}
                  >
                    Plugin
                  </MenuItem>

                  <MenuItem
                    onClick={() => setPage(PreferencePage.AdvancedDebugging)}
                    active={page === PreferencePage.AdvancedDebugging}
                  >
                    Debugging
                  </MenuItem>
                </>
              )}
            </SubMenu>
          </Menu>
        </SidebarContent>

        {!collapsed && (
          <SidebarFooter
            onClick={() => {
              open('https://github.com/jopemachine-arvis/arvis');
            }}
            style={{ textAlign: 'center' }}
          >
            <div
              className="sidebar-btn-wrapper"
              style={{
                padding: '20px 24px',
              }}
            >
              <div className="sidebar-btn">
                <FaGithub
                  style={{
                    marginRight: 8,
                  }}
                />
                <span>View Source</span>
              </div>
            </div>
          </SidebarFooter>
        )}
      </ProSidebar>
    </OuterContainer>
  );
}
