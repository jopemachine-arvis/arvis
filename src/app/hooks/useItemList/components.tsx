import styled from 'styled-components';

export const ItemTitle = styled.div`
  font-size: 14px;
  color: #ffffff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ItemSubtitle = styled.div`
  margin-top: 3px;
  font-size: 10px;
  color: #aaa;
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

export const ListView = styled.div`
  overflow-y: auto;
  margin-top: 95px;
`;

export const ItemOrderedList = styled.div`
  background-color: #1f2228;
  border-radius: 10px;
  margin-left: 40px;
  margin-right: 40px;
  padding-bottom: 20px;
  padding-right: 30px;
  padding-left: 30px;
  padding-top: 20px;
  overflow: auto;
  height: 78%;
`;

export const ItemContainer = styled.div`
  height: 65px;
  justify-content: center;
  align-items: center;
  padding-top: 11px;
  padding-bottom: 10px;
  padding-left: 68px;
  padding-right: 35px;
  margin-bottom: 7px;
  user-select: none;
  position: relative;
  width: 380px;
`;
