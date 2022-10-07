import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from '../../components/videoCard/Card'
import axios from 'axios'
import { useSelector } from 'react-redux'
import EmptySubscriptions from './EmptySubscriptions'
import SkeletonCard from '../../components/videoCard/SkeletonCard'
import uuid from "react-uuid"
import Chips from './chips/Chips'

const Container = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  margin: 0 0 0 72px;
  @media (max-width:660px){
    margin:0 0 0 0;
  };
  overflow: hidden;
`

export const GridContainer = styled.section`
  width: 100%;
  height: 100%;
  padding: 76px 30px 50px 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, max-content));
  @media (min-width:1050px){
    grid-template-columns: repeat(auto-fill, minmax(280px, max-content));
  };
  row-gap: 1.2em;
  column-gap: 1.2em;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Home = ({type}) => {
  const [videoLoading, setVideoLoading] = useState(true);
  const [videos, setVideos] = useState([])
  const { currentUser } = useSelector((state) => state.user)

  useEffect(()=> {
    document.title = "YouTube"
    setVideoLoading(true)
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

  useEffect(() => {
    videos.length && setVideoLoading(false)
  }, [videos.length])

  return (
    <Container>
      <Chips setVideos={setVideos} />
      <GridContainer>
        {videoLoading && Array.from(Array(12), (_, i) =>  <SkeletonCard key={uuid()} /> )}
        {videos.map((video)=>(
          <Card video={video} key={video._id} videoLoading={videoLoading} />
        ))}
        {type === "sub" && (
          !currentUser && (
            <EmptySubscriptions />
          )
        )}
      </GridContainer>
    </Container>
  )
}

export default Home