import styled from 'styled-components';

export const OuterContainer = styled.div`
  width: 95%;
  height: 100%;

  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 10px;

  overflow-x: hidden;
  overflow-y: auto !important;

  tbody {
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto !important;
  }

  td:nth-child(1) {
    min-width: 90px;
    width: 18%;
  }

  td:nth-child(2) {
  }

  td:nth-child(3) {
    width: 18%;
  }

  table {
    color: #888;
    border-color: #333;

    th,
    td {
      margin: 0px;
      padding: 0.5rem;

      text-align: center;
      white-space: nowrap;

      input {
        width: 100%;
        padding-top: 0px;
        padding-bottom: 0px;
        padding-left: 3px;
        padding-right: 3px;
        margin: 0px;
        border: 0px;
        background-color: #202228;
      }
    }
  }
`;
