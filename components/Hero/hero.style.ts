import styled from "@emotion/styled";

export const Container = styled.div`
  color: white;
  background: rgb(63, 94, 251);
  background: radial-gradient(
    circle,
    rgba(63, 94, 251, 0.3575805322128851) 0%,
    rgba(252, 70, 107, 0.35477941176470584) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  .title {
    font-weight: 900;
    text-align: center;
    max-width: 600px;
    .em {
      text-decoration: #fbe5ff wavy underline;
    }
    small {
      display: block;
      font-weight: 100;
      font-size: 0.3em !important;
    }
  }
  a {
    text-decoration: none;
    color: gray;
    font-weight: 900;
    font-size: 1.5em;
    margin-top: 10px;
    padding: 5px 20px;
    background-color: white;
    transition: 0.2s;
    border-radius: 30px;
    &:hover {
      background-color: #eee;
    }
  }
  .line {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 10em 150em;
    border-color: transparent transparent black transparent;
  }
`;
