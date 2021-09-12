import styled from 'styled-components';

export const EmptyListDesc = styled.div`
  margin-left: 11px;
`;

export const EmptyListContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
`;

export const ExtensionItemTitle = styled.div`
  font-size: 14px;
  color: #ffffff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ExtensionItemCreatorText = styled.div`
  margin-top: 3px;
  font-size: 10px;
  color: #aaa;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ExtensionItemDescText = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: #cccccc;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ExtensionItemDownloadCntText = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: #cccccc;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const OuterContainer = styled.div`
  height: 100vh;
  width: 100vh;
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #12151a;
  justify-content: flex-start;
`;

export const SearchbarContainer = styled.div`
  margin-left: 40px;
  margin-bottom: 20px;
  margin-right: 40px;
  border-radius: 5px;
  background-color: #202228;
  padding-left: 30px;
`;

export const SearchResultText = styled.div`
  text-align: center;
  font-size: 12px;
  color: #777;
  margin-right: 20px;
`;

export const SearchbarDescriptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  margin-left: 40px;
  margin-right: 40px;
`;

export const ExtensionListView = styled.div`
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

export const ExtensionListViewFooter = styled.div`
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

export const ExtensionItemContainer = styled.div`
  height: 95px;
  justify-content: center;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 10px;
  padding-left: 70px;
  padding-right: 35px;
  margin-bottom: 7px;
  user-select: none;
  position: relative;
  width: 380px;
`;

export const ExtensionDescContainer = styled.div`
  margin-top: 95px;
  margin-left: 50px;
  flex-grow: 1;
`;

export const ExtensionImg = styled.img`
  user-select: none;
  object-fit: scale-down;
  position: absolute;
  width: 40px;
  height: 40px;
  top: 27px;
  left: 15px;
`;

export const InstallMark = styled.span`
  width: 40px;
  height: 10px;
  text-align: center;
  position: absolute;
  top: 20px;
  right: 15px;
  font-size: 8px;
  border-radius: 2px;
  background-color: #7bbb3e88;
  color: #fff;
`;

export const TabNavigatorContainer = styled.div`
  width: 90%;
  height: 85%;
  margin-left: 50px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
`;
