import styled from 'styled-components';

export const OuterContainer = styled.div`
  height: 100vh;
  width: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #12151a;
  justify-content: flex-start;
`;

export const PluginListView = styled.div`
  margin-top: 95px;
  overflow-y: auto;
  display: flex;
  position: relative;
  flex-direction: column;
  margin-bottom: 70px;
`;

export const Header = styled.div`
  position: absolute;
  margin-top: 25px;
  height: 70px;
  color: #ffffff;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
  user-select: none;
`;

export const PluginListViewFooter = styled.div`
  overflow-y: auto;
  width: 100vh;
  height: 50px;
  background-color: #222222;
  position: fixed;
  bottom: 0px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const PluginDescContainer = styled.div`
  margin-top: 95px;
  flex-grow: 1;
`;

export const PluginImg = styled.img`
  user-select: none;
  object-fit: scale-down;
  position: absolute;
  width: 40px;
  height: 40px;
  top: 14px;
  left: 15px;
`;

export const TabNavigatorContainer = styled.div`
  width: 90%;
  height: 85%;
  margin-left: 50px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
`;

export const SearchbarContainer = styled.div`
  margin-left: 40px;
  margin-bottom: 20px;
  margin-right: 40px;
  border-radius: 5px;
  background-color: #202228;
`;
