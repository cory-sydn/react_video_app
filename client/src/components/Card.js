import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: ${(props)=>props.type === "sm" ? "row" : "column" };
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: ${(props)=>props.type === "sm" ? "10px" : "36px"};
`

const VideoLink = styled(Link)`
    width: 100%;
    cursor: pointer;
`

const Img = styled.img`
    width: ${(props)=> props.type === "sm" ? "178px" : "100%"};
    height:${(props)=> props.type === "sm" ? "103px" : "100%"};
    object-fit: scale-down;
`

const Details = styled.div`
    display: flex;
    margin-top: ${(props)=> props.type !== "sm" && "12px"};
    font-size: 14px;
`

const ChannelImg = styled.img`
    display: ${(props)=> props.type === "sm" ? "none" : "flex"};
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #606060;
    object-fit: cover;
`

const Texts = styled.div`
    margin-left: ${(props)=> props.type === "sm" ? "5px" : "14px"};
    height:${(props)=> props.type === "sm" ? "103px" : "100%"};
    text-align: left;
`

const Title = styled.h4`
    margin-top: 0;
    margin-bottom: ${(props)=> props.type === "sm" ? "5px" : "18px"};
    line-height: ${(props)=> props.type === "sm" ? "18px" : "20px"};
`

const ChannelName = styled.h3`
    margin-bottom: 4px;
    margin-top: ${(props)=> props.type === "sm" ? 0 : "12px"};
    font-size: 12px;
    color: ${({theme}) => theme.textSoft};
`

const Info = styled.span`
    font-size: 12px;
    color: ${({theme}) => theme.textSoft};
`

const Card = ({type}) => {
  return (
      <Container type={type} >
        <VideoLink  to="/video/test" >
            <Img  type={type} src='https://i.ytimg.com/vi/keC2tF21zhE/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC75Gegc-XFc1JeW38zpO6zETqobQ'/>
        </VideoLink>
        <Details type={type}>
            <ChannelImg type={type} src='https://yt3.ggpht.com/ytc/AKedOLT4zDPT-ysv1Qb6xlFJwtTOfwx_uNG-T5LWcCKR=s48-c-k-c0x00ffffff-no-rj' />
            <Texts type={type}>
                <VideoLink  to="/video/test" >
                    <Title type={type}>Lorem, ipsum dolor amet. Nemo, corporis ex!</Title>
                </VideoLink>
                <ChannelName type={type}>Viva La Dirt League</ChannelName>
                <Info>452k views &bull; 1 day ago </Info>
            </Texts>
        </Details>
      </Container>
  )
}

export default Card