import React, { useState } from 'react'
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import IonSearchOutline from '../../icons/IonSearchOutline.jsx'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  max-width: 640px;
  margin-left: 7vmax;
  display:flex;
  align-items: center;
  position: relative;
  @media (max-width:650px) {
    margin-left: 0;
  }
`;

const IconInside = styled.div`
  position: absolute;
  min-width: 28px;
  left: 12px;
  height: 38px;
  background: transparent;
  display: grid;
  place-content: center center;
  z-index: 2;
  border-radius: 30px 0 0 30px;
  visibility: visible;
`;

const Input = styled.input`
  height:40px;
  width: 100%;
  font-size: large;
  color: ${({theme}) => theme.text};
  background: ${({theme})=> theme.bar};
  padding: 2px 15px;
  outline: none;
  border-radius: 30px 0 0 30px;
  margin: 0 0 0 33px;
  border: 1px solid ${({theme})=> theme.soft};
  box-shadow: inset 0 1px 1px 0 #0002;
  z-index: 1;
  &:active,:focus {
    border: 1px solid #065fd4;
    padding: 2px 0 2px 48px;
    margin: 0;
    box-shadow: inset 0 1px 3px 0 #0004;
  }
`;

const IconContainer = styled.div`
  min-width: 64px;
  height: 40px;
  background: ${({theme})=> theme.uploader};
  border: 1px solid ${({theme})=> theme.soft};
  border-left: transparent;
  border-radius: 0 30px 30px 0;
  display: grid;
  place-content: center center;
  cursor: pointer;
  @media (max-width:530px) {
    min-width: 40px;
  }
`;

const SearchBar = () => {
  const [icon, setIcon] = useState(false)
  const [query, setQuery] = useState(null)
  const navigate = useNavigate()

  function handleKeyDown (e) {
    e.key === "Enter" && navigate(`/search?q=${query}`)
  }

  return (
    <Container onFocus={()=>setIcon(true)}
      onBlur ={()=>setIcon(false)} 
      >
      {icon &&
        <IconInside>
          <IonSearchOutline/>
        </IconInside>
      }
      <Input 
        placeholder='Search'
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        />
      <IconContainer
        onClick={()=>navigate(`/search?q=${query}`)}      
      >
        <SearchOutlinedIcon/>
      </IconContainer>
    </Container>
  )
}

export default SearchBar