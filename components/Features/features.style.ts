import styled from "@emotion/styled";

export const Container = styled.div`
  background-color: black;
  height: 100vh;
  position: relative;
  .line {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 10em 150em;
    border-color: transparent transparent white transparent;
  }
  .title {
    width: 100%;
    text-align: center;
    color: white;
    font-size: 3em;
    font-weight: 900;
  }
  .imageContainer {
    text-align: center;
  }
`;

export const Items = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Item = styled.div`
  max-width: 300px;
  color: white;
  margin: 30px;
  .item-title {
    text-align: center;
    text-decoration: underline;
  }
`;
