import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Logo from '../img/logo.png'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SlideshowIcon from '@mui/icons-material/Slideshow';
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import MenuSharpIcon from '@mui/icons-material/MenuSharp';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Header, HamburgerBtn } from './navbar/Navbar';
import SignInButton from '../pages/home/SignInButton';
import GlowingButton from "../utils/constants/GlowingButton";
import ProfileImg from '../utils/constants/ProfileImg';

const MenuContainer = styled.div`
    display: flex;
    position: fixed;
    background:  ${(props) => props.close === true ? "#0001" : "#0005" };
    transition: all 0.5s;
    width: 100vw;
    min-height: 100vh;
    height:100%;
    z-index: 90;
`;

const Sidebar = styled.menu`
    display: flex;
    padding-top: 56px;
    margin: 0;
    width: 240px;
    height: 100vh;
    position: relative;
    top: 0;
    left:0;
    background: ${({theme}) => theme.bgLighter};
    color: ${({theme}) => theme.text};
    animation: 0.3s both ease-in-out ${(props) => props.close === true ? "close" : "open" };

    @keyframes open {
        0% {
            transform: translateX(-240px);
        }
        100% {
            transform:translateX(0);
        }
    }
    @keyframes close {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-240px)
        }
    }
`;

const Container = styled.div`
    box-shadow: -2px -1px 3px 0 #00000018;
    font-size: 14px;
    padding-top: 1px;    
    overflow-x: hidden;
    overflow-y: scroll;
    overscroll-behavior: none;
    margin-right: 4px;
    &::-webkit-scrollbar {
        background: transparent; 
        width: 8px;
    }
    &:hover {
        &::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background: ${({theme}) => theme.scroll};
        }
    }
`;

const Wrapper = styled.div`
    width: 225px;
    padding:8px 0 16px 0;
    flex-basis: 1e-9px;
`;

const Item = styled.div`
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 20px;
    font-size: 14px ;
    cursor: pointer;
    &:hover {
        background: ${({theme}) => theme.soft};
    }
`;

const Hr = styled.hr`
    margin: 12px 0;
    height: 1px;
    border: none;
    border-bottom: 1px solid ${({theme})=>theme.soft};
`;

const Title =styled.h2`
    font-size: 14px;
    font-weight: 500;
    color: #aaaaaa;
    margin-bottom: 20px;
`;

const Outside = styled.div`
    min-width: calc(100vw - 240px);
    min-height: 100vh;
`;

const Menu = ({darkMode, setDarkMode, sidebar, setSidebar}) => {
    const [close, setClose] = useState(false)
    const [channels, setChannels] = useState(null)
    const {currentUser} = useSelector(state => state.user)

    const handleClose = () => {
        setClose(true)
        setTimeout(()=> {
            setSidebar(!sidebar)            
        }, 500 )
    };

    const getChannels = async() => {
        try {
            const res = await axios.get("http://localhost:8800/api/users/subs", {
                withCredentials: true
            })
            setChannels(res.data)
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(()=>{
        if(currentUser) getChannels()
    },[currentUser]);
    
    return (
    <MenuContainer close={close} >
        <Sidebar tabIndex={0} close={close}>
            <Header >
                <HamburgerBtn  onClick={handleClose}>
                    <GlowingButton
                        style={{marginRight: 10}}
                        icon={<MenuSharpIcon />}
                    />
                </HamburgerBtn>
                <Link to="/" className="logo" cursor="pointer">
                    <img src={Logo} className="img" alt='' />YouTube
                </Link>
            </Header>
            <Container>        
                <Wrapper >
                    <Link to="/" >   
                        <Item >
                            <HomeOutlinedIcon />
                            Home
                        </Item>
                    </Link>
                    <Link to="trends" >
                        <Item >
                            <ExploreOutlinedIcon />
                            Explore
                        </Item>
                    </Link>
                    <Link to="subscriptions" >
                        <Item>
                            <SubscriptionsOutlinedIcon />
                            Subscriptions
                        </Item>
                    </Link>
                    <Hr />
                    <Item>
                        <VideoLibraryOutlinedIcon />
                        Library
                    </Item>
                    {currentUser && (
                        <Link to={`/channel/${currentUser._id}`} >
                            <Item >
                                <SlideshowIcon />
                                Your Videos
                            </Item>
                        </Link>
                    )}
                    <Item>
                        <HistoryOutlinedIcon />
                        History
                    </Item>
                    <Hr />
                    {!currentUser && (
                        <>               
                            <SignInButton type={"menu"} />
                            <Hr />
                        </>
                    )}                    
                    {channels?.length > 0 && (
                        <>
                            <Title>SUBSCRIPTIONS</Title>
                            {channels.map((channel) => (
                                <Link to={`/channel/${channel?._id}`}key={channel?._id} >
                                    <Item  >
                                        {channel && (<ProfileImg size={24} img={channel.img} name={channel.name} />)}
                                        {channel?.name}
                                    </Item>
                                </Link>
                            ))}
                            <Hr />
                        </>
                    )}                    
                    <Title>EXPLORE</Title>
                    <Item>
                        <LibraryMusicOutlinedIcon />
                        Music
                    </Item>
                    <Item>
                        <SportsBasketballOutlinedIcon />
                        Sports
                    </Item>
                    <Item>
                        <SportsEsportsOutlinedIcon />
                        Gaming
                    </Item>
                    <Item>
                        <MovieOutlinedIcon />
                        Movies
                    </Item>
                    <Item>
                        <ArticleOutlinedIcon />
                        News
                    </Item>
                    <Item>
                        <LiveTvOutlinedIcon />
                        Live
                    </Item>
                    <Hr />
                    <Item>
                        <SettingsOutlinedIcon />
                        Settings
                    </Item>
                    <Item>
                        <FlagOutlinedIcon />
                        Report
                    </Item>
                    <Item>
                        <HelpOutlineOutlinedIcon />
                        Help
                    </Item>
                    <Item onClick={() => setDarkMode(!darkMode)}>
                    <SettingsBrightnessOutlinedIcon />
                    {darkMode ? "Dark" : "Light"} Mode
                    </Item>
                </Wrapper>
            </Container>
        </Sidebar>
        <Outside onClick={handleClose}/>
    </MenuContainer>
  )
}

export default Menu