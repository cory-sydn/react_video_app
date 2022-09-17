import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from '../../components/videoCard/Card'
import axios from 'axios'
import { useSelector } from 'react-redux'
import EmptySubscriptions from './EmptySubscriptions'

const Wrapper = styled.section`
  margin: 20px 30px 50px 105px;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  row-gap: 2em;
  column-gap: 2em;
  @media (min-width:1050px){
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  };
  position: relative;
`

const Home = ({type}) => {
  const [videos, setVideos] = useState([])
  const { currentUser } = useSelector((state) => state.user)

  useEffect(()=> {
    document.title = "YouTube"
    try {
      const fecthVideos = async()=>{
        const res = await axios.get( `http://localhost:8800/api/videos/${type}`, {
          withCredentials: true
        })
        setVideos(res.data)
      }
      fecthVideos()
    } catch (err) {
      //console.log(err);
    }
  },[type])
  return (
    <Wrapper>
        {videos.map((video)=>(
          <Card video={video} key={video._id} />
        ))}
        {type === "sub" && (
          !currentUser && (
            <EmptySubscriptions />
          )
        )}
    </Wrapper>
  )
}

export default Home