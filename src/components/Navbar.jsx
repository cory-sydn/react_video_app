import React, { useState } from 'react'
import Logo from '../img/logo.png'
import styled from 'styled-components';
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MenuSharpIcon from '@mui/icons-material/MenuSharp';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import { Link } from 'react-router-dom';

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

const Search = styled.div`
  width: 100%;
  max-width: 640px;
  margin-left: 10vmax;
  display:flex;
  align-items: center;
  position: relative;
  @media (max-width:650px) {
    margin-left: 2vmin;
  }
`
const SIconInside = styled.div`
  position: absolute;
  min-width: 30px;
  left: 24px;
  height: 38px;
  background: ${({theme})=> theme.bar};
  display: grid;
  place-content: center center;
  z-index: 2;
  visibility: visible;
 
`

const Input = styled.input`
  height:40px;
  width: 100%;
  font-size: large;
  color: ${({theme}) => theme.text};
  background: ${({theme})=> theme.bar};
  border: 1px solid ${({theme})=> theme.soft};
  padding: 2px 6px;
  outline: none;
  border-radius: 2px;
  margin: 0 0 0 42px;
  z-index: 1;
  &:active,:focus {
    border: 1px solid #065fd4;
    padding: 2px 6px 2px 46px;
    margin: 0 0 0 14px;
    
  }
`
const SIconContainer = styled.div`
  min-width: 64px;
  height: 40px;
  background: ${({theme})=> theme.soft};
  display: grid;
  place-content: center center;
  cursor: pointer;
`

const Button =styled.button`
  float: right;
  min-width: 112px;
  padding: 5px 15px;
  gap: 5px;
  background-color: transparent;
  display: flex;
  align-items: center;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  margin: auto;
  cursor: pointer;
  border-radius: 2px;
  font-weight: 500;
`

const Section = styled.section`
  display: flex;
  align-items: inherit;
  margin-right: 8px;
`

const Navbar = ({setSidebar}) => {
  const [icon, setIcon] = useState(false)
 
  return (
    <Container>
      <Wrapper >
        <Header >
          <MenuSharpIcon onClick={()=>setSidebar(true)}/>
          <Link to="/" className="logo">
            <img src={Logo} className="img" alt='logo'/>FrogTube
          </Link>
        </Header>
        <Search onFocus={()=>setIcon(true)}
          onBlur ={()=>setIcon(false)} 
          >
          {icon &&
          <SIconInside>
            <SearchOutlinedIcon />
          </SIconInside>
          }
          <Input placeholder='Search'/>
          <SIconContainer>
            <SearchOutlinedIcon />
          </SIconContainer>
        </Search>
        <Section >
          <MoreVertSharpIcon cursor="pointer" style={{marginInline:16}} />
          <Link to="signin">
            <Button>
              <AccountCircleOutlinedIcon />
              SIGN IN
            </Button>
          </Link>
        </Section>
      </Wrapper>
    </Container>
  )
}

export default Navbar