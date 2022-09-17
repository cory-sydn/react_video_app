import React from 'react'
import styled from 'styled-components'
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from 'react-router-dom';

const Login =styled.div`
  margin: 0 18px 0 24px;
  display: flex;
  flex-direction: column;
  align-items: ${(props)=> props.type === "menu" ? "left" : "center"};
`;

const Button =styled.button`
  margin-top: ${(props)=> props.type === "menu" ? "10px" : "30px"};
  padding: 5px 15px;
  gap: 5px;
  background-color: transparent;
  display: flex;
  align-items: center;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  cursor: pointer;
  border-radius: 2px;
  font-weight: 500;
`;

const SignInButton = ({type}) => {
  return (
      <Login type={type} >
        Sign in to like videos, comment, and subscribe.
        <Link to={type === "menu" ? "signin" : `/signin`} >
            <Button type={type} >
                <AccountCircleOutlinedIcon />
                SIGN IN
            </Button>
        </Link>
    </Login>
  )
}

export default SignInButton