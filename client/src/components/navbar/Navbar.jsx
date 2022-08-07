import React, { useState } from 'react'
import Logo from '../../img/logo.png'
import styled from 'styled-components';
import MenuSharpIcon from '@mui/icons-material/MenuSharp';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import Profile from './profile/Profile'

const Container = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  background: ${({theme})=>theme.bgLighter};
  padding: 8px 16px;
  z-index: 5;
`

const Wrapper = styled.div`
  margin-left: 190px;
  display:flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const Header = styled.div`
  font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;
  margin: 0.75rem 0 0 1.5rem;
  font-size: 1.25em;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  position: absolute;
  top: 3px;
  left: 0;
  font-weight: 600;
  letter-spacing: -1px;
`

const Navbar = ({setSidebar}) => {

  return (
    <Container>
      <Wrapper >
        <Header >
          <MenuSharpIcon onClick={()=>setSidebar(true)}/>
          <Link to="/" className="logo">
            <img src={Logo} className="img" alt=''/>YouTube
          </Link>
        </Header>
        <SearchBar />
        <Profile />
      </Wrapper>
    </Container>
  )
}

export default Navbar