import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from '../components/Card'
import axios from 'axios'


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

const Home = ({type}) => {
  const [videos, setVideos] = useState([])
  const [error, setError] = useState(false)

  useEffect(()=> {
    try {
      const fecthVideos = async()=>{
        const res = await axios.get( "http://localhost:8800/api" + `/videos/${type}`,  {
          //AxiosRequestConfig parameter
          withCredentials: true
        })
        setVideos(res.data)
      }
      fecthVideos()
    } catch (err) {
      setError(true)
      console.log(err);
    }
    
  },[type])

  return (
    <Container>
        {videos.map((video)=>(
          <Card video={video} key={video._id} />
        ))}      
    </Container>
  )
}

export default Home