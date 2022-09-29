import React from 'react'
import styled from 'styled-components';

const Dark = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: calc(100vw - 8px);
  height: 100vh;
  background: ${(props) => (props.status ? "#0006" : "transparent")};
  animation: ${(props) => (props.status ? "darkness 0.4s ease-in-out" : "light 0.4s ease-in-out")};
  @keyframes darkness {
    0%{
      background: #0002;
    }
    100%{
      background: #0006;
    }
  }
  @keyframes light {
    0%{
      background: #0006;
    }
    100%{
      background: #0001;
    }
  }
  overflow: hidden;
  z-index: 90;
`;

const Darkness = ({status}) => {
  return (
    <><Dark status={status} /></>
  )
}

export default Darkness