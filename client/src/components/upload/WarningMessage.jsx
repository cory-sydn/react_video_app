import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  top: -60px;
  right: 10px;
`;

const Wrapper = styled.div` 
`;

const Text = styled.div`
  white-space: pre-line;
  color: red;
  background: ${({ theme }) => theme.bgDarker};
  padding: 10px 15px;
  border-radius: 3px;
`;

const WarningMessage = ({message}) => {
  return (
    <Container>
      <Wrapper>
        <Text>{message}</Text>
      </Wrapper>
    </Container>
  )
}

export default WarningMessage