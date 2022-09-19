import React from 'react'
import styled from 'styled-components'
import IonAlertCircled from '../../icons/IonAlertCircled.jsx'

const Container = styled.div`
  position: fixed;
  display: grid;
  justify-content: center;
  top: 0;
  right: 0;
  width: calc(100vw - 8px);
  height: 100vh;
  z-index: 99;
`;

const Wrapper = styled.div` 
  position: absolute;
  inset: 0;
  margin: auto;
  width: 260px;
  height: max-content;
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.bgDarker};
  border-radius: 0;
	white-space: pre-line;
  display: grid;
	align-items: flex-start;
  place-content: flex-start;
  border-radius: 3px;
`;

const Text = styled.div`
  white-space: pre-line;
  color:  ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.bgDarker};
  padding: 24px;
  border-radius: 3px;
`;

const Button = styled.button`
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 3px;
  color: #3ea6ff;
  cursor: pointer;
  padding: 12px 16px;
  margin-left: 40px;
  background: ${({ theme }) => theme.bgDarker};
  &:hover {
    filter: brightness(85%);
  }
`;

const SecondCheck = styled.div`
	border-top: 1px solid ${({ theme }) => theme.soft};
  width: 260px;
	padding: 8px 0 8px 40px;
  display: flex;
`;

const WarningMessage = ({message, secondCheck, setSecondCheck, setWarning, handleCancel }) => {
  return (
    <Container>
      <Wrapper>
        <Text><IonAlertCircled style={{color: "#c5e300", marginRight: 20 } } />{message}</Text>
        {secondCheck && (
          <SecondCheck>
            <Button onClick={()=> setSecondCheck(false) + setWarning((prev)=>({...prev, state: false}))}>No</Button>
            <Button onClick={handleCancel}>Yes</Button>
          </SecondCheck>
        )}
      </Wrapper>
    </Container>
  )
}

export default WarningMessage