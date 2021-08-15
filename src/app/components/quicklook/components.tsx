import styled from 'styled-components';

export const HandleBar = styled.div`
  cursor: w-resize;
  position: absolute;
  left: -7px;
  width: 14px;
  height: 85px;
  border-radius: 5px;
  background-color: #eee;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;

export const InnerHandleBarColor = styled.div`
  background-color: #999;
  width: 2px;
  border-radius: 10px;
  height: 35px;
`;
