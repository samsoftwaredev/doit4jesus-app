import styled from "styled-components";

export const Container = styled.div`
  background: rgb(238, 174, 202);
  background: radial-gradient(
    circle,
    rgba(238, 174, 202, 0.5018382352941176) 0%,
    rgba(148, 187, 233, 0.30015756302521013) 100%
  );
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const RosaryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  #youtube-container {
    width: 100%;
    display: inline-flex;
  }
`;
