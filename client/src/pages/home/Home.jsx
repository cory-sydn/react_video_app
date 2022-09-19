import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from '../../components/videoCard/Card'
import axios from 'axios'
import { useSelector } from 'react-redux'
import EmptySubscriptions from './EmptySubscriptions'

export const GridContainer = styled.section`
  width: 100%;
  height: 100%;
  margin: 20px 30px 50px 102px;
  @media (max-width:660px){
    margin: 20px 30px 50px 30px;
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
    <GridContainer>
      {videos.map((video)=>(
        <Card video={video} key={video._id} />
      ))}
      {type === "sub" && (
        !currentUser && (
          <EmptySubscriptions />
        )
      )}
    </GridContainer>
  )
}

export default Home