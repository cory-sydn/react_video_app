import React from 'react'
import { Container } from './Selector'
import { Item } from './DropDown'
import { darkTheme, lightTheme } from '../../../utils/Theme'
import { changeTheme } from '../../../redux/userSlice'
import { useDispatch } from 'react-redux'

const Appearance = () => {
  const dispatch = useDispatch()

  return (
    <Container>
      <Item 
        onClick={() => dispatch(changeTheme(darkTheme))} 
        style={{padding:"0 40px" }}
      >
        Dark Mode
      </Item>
      <Item 
        onClick={() => dispatch(changeTheme(lightTheme))}
        style={{padding:"0 40px" }}
      >
        Light Mode
      </Item>
    </Container>
  )
}

export default Appearance