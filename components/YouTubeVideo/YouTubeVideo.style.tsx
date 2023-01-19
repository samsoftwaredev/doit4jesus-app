import styled from "styled-components";

interface Props {
  visible: boolean;
}

export const Container = styled.div<Props>`
  ${(props) =>
    props.visible
      ? `
          visibility: visible;
        `
      : `
          visibility: hidden;
          position: absolute;
        `}
`;
