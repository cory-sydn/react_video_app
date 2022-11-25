import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from '../../components/videoCard/Card'
import axios from 'axios'
import EmptySubscriptions from './EmptySubscriptions'
import SkeletonCard from '../../components/videoCard/SkeletonCard'
import uuid from "react-uuid"
import Chips from '../../components/chips/Chips'
import { axiosInstance } from '../../apiConfig'

const Container = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  margin: 0 0 0 72px;
  @media (max-width:660px){
    margin:0 0 0 0;
  };
  overflow: hidden;
`;

export const GridContainer = styled.section`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 56px);
  @media (max-height: 390px){
    min-height: 390px;
  };
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
  const [videoLoading, setVideoLoading] = useState(false);
  const [videos, setVideos] = useState([])

  useEffect(()=> {
		const cancelToken = axios.CancelToken.source();
    document.title = "YouTube"
    type !== "nosub" && setVideoLoading(true)
    const fecthVideos = async()=>{
      try {
        const res = await axiosInstance.get( `/videos/${type}`,
          { withCredentials: true},
          { cancelToken: cancelToken.token }
        )
        setVideos(res.data)
      } catch (err) {
        if (axios.isCancel(err)) return
        console.log(err);
      }
    }
    fecthVideos()
    return () => {
			cancelToken.cancel();
		};
  },[type])

  useEffect(() => {
    videos.length && setVideoLoading(false)
  }, [videos.length])

  return (
    <Container >
      {type !== "nosub" && (
        <Chips setVideos={setVideos} />
      )}
      <GridContainer style={{padding: "76px 30px 50px 30px"}} >
        {videoLoading && Array.from(Array(12), (_, i) =>  <SkeletonCard key={uuid()} /> )}
        {type === "nosub" ? (
          <EmptySubscriptions />
          ) : (videos.map((video)=>(
          <Card video={video} key={video._id} videoLoading={videoLoading} />
        )))}
      </GridContainer>
    </Container>
  )
}

export default Home