import React from 'react'
import styled from 'styled-components'
import Card from './Card'

const Container = styled.div``

const Recommendations = ({type}) => {
  return (
    <Container>
        <Card type={type}/>
    </Container>
  )
}

export default Recommendations