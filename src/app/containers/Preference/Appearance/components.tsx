import styled from 'styled-components';

export const OuterContainer = styled.div`
  height: 100vh;
  width: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #16181b;
  justify-content: flex-start;
`;

export const PreviewContainer = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 5%;
  padding-right: 5%;
`;

export const PreviewMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Header = styled.div`
  width: 50%;
  margin-left: 25px;
  margin-top: 20px;
  height: 60px;
  color: #ffffff;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
`;

export const ThemeItemIcon = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  border-radius: 3px;
  top: 22px;
  left: 15px;
  border: 1px solid #555 !important;
`;

export const ThemeListContainer = styled.div`
  width: 15%;
  padding-left: 15px;
  user-select: none;
  overflow-y: auto;
`;

export const ThemeItemContainer = styled.div`
  height: 65px;
  background-color: #222;
  border: 1px solid #333;
  border-radius: 10px;
  text-align: left;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 50px;
  padding-right: 7px;
  margin-bottom: 7px;
  user-select: none;
  position: relative;
`;

export const ThemeItemTitle = styled.div`
  font-size: 12px;
  color: #ffffff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ThemeItemSubtitle = styled.div`
  margin-top: 8px;
  font-size: 10px;
  color: #888;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ThemeList = styled.div`
  background-color: #1f2228;
  border-radius: 10px;
  margin-left: 10px;
  padding-bottom: 20px;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 20px;
  overflow: auto;
  height: 78%;
`;

export const ConfigContainer = styled.div`
  width: 25%;
  padding-left: 15px;
  user-select: none;
  overflow-y: auto;
  padding-bottom: 20px;
`;
