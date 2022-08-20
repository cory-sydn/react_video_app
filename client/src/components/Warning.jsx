import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
	cursor: auto;
	position: absolute;
	background: ${({ theme }) => theme.warning.bg};
	top: 40px;
	left: -180px;
	transform: translate(-50% -50%);
	width: max-content;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	border-radius: 3px 3px 0 0;
	box-shadow: 0 0 8px 0 #00000088;
	z-index: 5;
`;

const Title = styled.h3`
	padding: 20px 20px 0;
	color: ${({ theme }) => theme.warning.color};
`;
const Text = styled.div`
	color: ${({ theme }) => theme.scroll};
	padding: 20px;
`;

const Hr = styled.hr`
  margin-top: 10px;
  width: 100%;
  border: transparent;
	border-bottom: 1px solid ${({ theme }) => theme.soft};
`

const BtnContainer = styled.div`
	padding: 10px 20px;
	border-radius: 0 0 3px 3px;
	background: transparent;
`;

const Button = styled.div`
	border: none;
	color: #3ea6ff;
	font-size: 16px;
	font-weight: 500;
	background: transparent;
	padding: 10px 15px;
  background: ${({ theme }) => theme.warning.bg};
	cursor: pointer;
`;

const Warning = ({ title, text }) => {
	const navigate = useNavigate();
	
  function redirect() {
		navigate("/signin");
	}
  
	return (
		<Container>
			<Title>{title}</Title>
			<Text>Sign in to{" "}{text} </Text>
      <Hr/>
			<BtnContainer>
				<Button onClick={redirect}>SIGN IN </Button>
			</BtnContainer>
		</Container>
	);
};

export default Warning;
