import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components'
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import Comments from '../components/Comments';
import Card from '../components/Card';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { fetchStart, fetchSuccessful } from '../redux/videoSlice';
import { format } from 'timeago.js';

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    padding: 24px 36px;
`

const Content = styled.section`
    width: 68%;
    min-width: 550px;
    flex: 5;
    display: flex;
    flex-direction: column;
`

const RecommendationsSection = styled.section`
    width: 26%;
    min-width: 330px;
    flex: 2;
`

const VideoWrapper = styled.div`
    display: flex;
`
const Title = styled.h1`
    display: flex;
    font-size: 20px;
    font-weight: 600;
    color: ${({theme}) => theme.text};
`
const Details = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 1px solid ${({theme})=>theme.soft};
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
`
const Info = styled.span`
    color: ${({theme}) => theme.textSoft};
`
const Buttons = styled.div`
    display:flex;
    align-items: center;
`
const Button = styled.div`
    margin-inline: .75rem;
    cursor: pointer;
    display:flex;
    align-items: center;
`

const ChannelImg = styled.div`
    width: 48px;
    height:48px;
    margin-right: 10px;
`

const Img = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
`
const ChannelLine = styled.div`
    width: calc(100% - 63px);
    height: 59px;
    display: flex;
    justify-content: space-between;
`

const ChannelInfo = styled.div`
    display: flex;
`

const ChannelName = styled.h3`
    margin: 0;
    line-height: 20px;
    text-align: left;
    display: flex;
    flex-direction: column;
`

const SubsDiv = styled.div`
    line-height: 39px;
    display: flex;
    float: right;
    align-items: center; 
    font-size: 16px;
`
const Join = styled.button`
    border: 1px solid #3ea6ff;
    color: #3ea6ff;
    background: transparent;
    border-radius: 2px;
    padding: 10px 16px;
    font-weight: 600;
    height: 37px;
    cursor: pointer;
`

const Subscribe = styled.button`
    color: #ffffff;
    background: #cc0000;
    height: 37px;
    margin-inline: 16px;
    border: none;
    font-weight: 600;
    border-radius: 2px;
    padding: 10px 16px;
    cursor: pointer;
`

const Desc = styled.div`
    font-size: 14px;
    padding-top: 20px;
    padding-left: 64px;
    text-align: left;
    height: 84px;
    overflow-y: hidden;
`
const More = styled.div`
    margin: 16px 0 0 64px;
    color: ${({theme})=>theme.textSoft};
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: -0.5px;
`

const Video = () => {
    const [channel, setChannel] = useState(null)
    const [showMore, setShowMore] = useState(false)
    const { currentUser } = useSelector(state => state.user)
    const { currentVideo} = useSelector(state => state.video)
    const dispatch = useDispatch()
    const videoId = useParams().id
    
    useEffect(() => {
        const getVideo = async() => {
            dispatch(fetchStart())
            try {
                const videoRes = await axios.get(`/videos/find/${videoId}`)
                const channelRes = await axios.get(`/users/find/${videoRes.data.userId}`)
                setChannel(channelRes.data)
                dispatch(fetchSuccessful(videoRes.data))
            } catch (err) {
                console.log(err);
            }
        }
        getVideo()
    },[videoId, dispatch])

    

  return (
    <Container>
        <Content>
            <VideoWrapper>
            <iframe width="1351" height="503" src="https://www.youtube.com/embed/yIaXoop8gl4" title="React Video Sharing App UI Design | Youtube UI Clone with React" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </VideoWrapper>
            <Title>{currentVideo.title} </Title>
            <Details>
                <Info>{currentVideo.views} &bull; {format(currentVideo.createdAt)} </Info>
                <Buttons>
                    <Button><ThumbUpOutlinedIcon/>&nbsp;{currentVideo.likes?.length} </Button>
                    <Button><ThumbDownOffAltOutlinedIcon/>&nbsp;DISLIKE</Button>
                    <Button><ReplyOutlinedIcon/>&nbsp;SHARE</Button>
                    <Button><PlaylistAddOutlinedIcon/></Button>
                    <Button><MoreHorizOutlinedIcon/></Button>
                </Buttons>
            </Details>           
            <Details>
                <ChannelImg >
                    <Img src={channel?.img} />
                </ChannelImg>
                <ChannelLine>
                    <ChannelInfo>
                        <ChannelName>
                            {channel?.name.toUpperCase()}
                            <Info style={{margin:0, fontSize:12, fontWeight:400   }} >{channel?.subscribers} </Info>
                        </ChannelName>
                    </ChannelInfo>
                    <SubsDiv>
                        <Join>JOIN</Join>
                        <Subscribe>SUBSCRIBE</Subscribe>
                        <NotificationsActiveOutlinedIcon/>
                    </SubsDiv>
                </ChannelLine>
                <Desc>
                    {currentVideo.desc}
                </Desc>
                <More onClick={()=>setShowMore(true)}>SHOW MORE</More>
            </Details>
            <Comments/> 
        </Content>
        {/* <RecommendationsSection>
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
            <Card type="sm" />
        </RecommendationsSection> */}
    </Container>
  )
}

export default Video