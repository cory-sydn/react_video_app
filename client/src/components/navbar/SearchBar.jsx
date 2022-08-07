import React, { useState } from 'react'
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: 640px;
  margin-left: 7vmax;
  display:flex;
  align-items: center;
  position: relative;
  @media (max-width:650px) {
    margin-left: 2vmin;
  }
`

const IconInside = styled.div`
  position: absolute;
  min-width: 28px;
  left: 14px;
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
    padding: 2px 6px 2px 40px;
    margin: 0 0 0 8px;
  }
`
const IconContainer = styled.div`
  min-width: 64px;
  height: 40px;
  background: ${({theme})=> theme.soft};
  display: grid;
  place-content: center center;
  cursor: pointer;
`

const SearchBar = () => {
  const [icon, setIcon] = useState(false)
  
  return (
    <Container onFocus={()=>setIcon(true)}
      onBlur ={()=>setIcon(false)} 
      >
      {icon &&
      <IconInside>
        <SearchOutlinedIcon />
      </IconInside>
      }
      <Input placeholder='Search'/>
      <IconContainer>
        <SearchOutlinedIcon />
      </IconContainer>
    </Container>
  )
}

export default SearchBar