import React from 'react'
import styled from 'styled-components'
import Card from '../components/Card'

const Container = styled.div`
  margin: 20px 16px;
  width: 100%;
  min-height:100vh;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  row-gap: 1em;
  column-gap: 1em;
  @media (min-width:1050px){
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  };
`

const Home = () => {
  return (
    <Container>
     
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
      
    </Container>
  )
}

export default Home