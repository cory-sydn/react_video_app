import React from 'react'
import { Container } from './Selector'
import { Item } from './DropDown'
import { darkTheme, lightTheme } from '../../../utils/Theme'
import { changeTheme } from '../../../redux/userSlice'
import { useDispatch } from 'react-redux'
import CheckIcon from '@mui/icons-material/Check';
import styled from 'styled-components'

const Info = styled.div`
  height: 40px;
	display: flex;
	align-items: center;
	padding: 0 15px;
	gap: 10px;
	font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
`;

const Appearance = ({theme}) => {
  const dispatch = useDispatch()

  return (
    <Container style={{padding: "10px 0"}} >
      <Info>
        Setting applies to this browser only
      </Info>
      <Item 
        onClick={() => dispatch(changeTheme(darkTheme))} 
        style={{padding: theme === "Light" && "0 50px" }}
      >
        {theme === "Dark" && <CheckIcon /> }
        Dark Mode
      </Item>
      <Item 
        onClick={() => dispatch(changeTheme(lightTheme))}
        style={{padding: theme === "Dark" && "0 50px" }}
      >
        {theme === "Light" && <CheckIcon /> }
        Light Mode
      </Item>
    </Container>
  )
}

export default Appearance