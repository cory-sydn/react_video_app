import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from '../components/Card'
import axios from 'axios'

const Wrapper = styled.section`
  margin: 20px 30px 20px 105px;
  width: 100%;
  min-height:100vh;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  row-gap: 2em;
  column-gap: 2em;
  @media (min-width:1050px){
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  };
`

const Home = ({type}) => {
  const [videos, setVideos] = useState([])
  const [error, setError] = useState(false)

  useEffect(()=> {
    document.title = "YouTube"
    try {
      const fecthVideos = async()=>{
        const res = await axios.get( "http://localhost:8800/api" + `/videos/${type}`, {
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
    <Wrapper>
        {videos.map((video)=>(
          <Card video={video} key={video._id} />
        ))}
    </Wrapper>
  )
}

export default Home