import styled from 'styled-components';

export const OuterContainer = styled.div`
  flex-direction: row;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
`;

export const InnerContainer = styled.div`
  flex-direction: column;
  width: 85%;
`;

export const Title = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
`;

export const SubTitle = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
`;

export const IconImg = styled.img`
  object-fit: scale-down;
`;

export const OffsetText = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 15%;
  align-items: center;
  font-size: 12px;
  margin-right: ${process.platform === 'darwin' ? 20 : 25}px;
  white-space: nowrap;
  user-select: none;
`;
