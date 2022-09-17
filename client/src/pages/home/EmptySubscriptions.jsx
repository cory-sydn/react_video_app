import React from 'react'
import styled from 'styled-components'
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import SignInButton from './SignInButton';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  inset: 60px 0 0 0;
  margin: auto;
  width: 100%;
  height: 100vh;
`;

const Title = styled.h2`
  margin-block: 30px;
	font-weight: 500;
`;

const EmptySubscriptions = () => {
  return (
    <Container>
      <SubscriptionsOutlinedIcon sx={{fontSize: 125}} />
      <Title>Don't miss new videos</Title>
      <SignInButton type={"sub"} />
    </Container>
  )
}

export default EmptySubscriptions