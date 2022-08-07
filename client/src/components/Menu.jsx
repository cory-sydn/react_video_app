import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Logo from '../img/logo.png'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import MenuSharpIcon from '@mui/icons-material/MenuSharp';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MenuContainer = styled.div`
    display: flex;
    position: fixed;
    background:  ${(props) => props.close === true ? "#0001" : "#0005" };
    transition: all 0.5s;
    width: 100vw;
    min-height: 100vh;
    height:100%;
    z-index: 10;
`

const Header = styled.div`
    font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;
    margin: 0.75rem 0 0 1.5rem;
    font-size: 1.25em;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    position: absolute;
    top: 3px;
    left: 0;
    font-weight: 600;
    letter-spacing: -1px;
`

const Sidebar = styled.menu`
    display: flex;
    padding-top: 56px;
    margin: 0;
    width: 0;
    height: 100vh;
    position: relative;
    top: 0;
    left:0;
    background: ${({theme}) => theme.bgLighter};
    color: ${({theme}) => theme.text};
    animation: 0.3s both ease-in-out ${(props) => props.close === true ? "close" : "open" };

    @keyframes open {
        0% {
            width: 0;
        }
        100% {
            width: 240px;
        }
    }
    @keyframes close {
        0% {
            width: 240px;
        }
        100% {
            width: 0;
        }
    }
`

const Container = styled.div`
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
`

const Wrapper = styled.div`
    width: 225px;
    padding:8px 0 16px 0;
    flex-basis: 1e-9px;
`

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
`

const Hr = styled.hr`
    margin: 12px 0;
    height: 1px;
    border: none;
    border-bottom: 1px solid ${({theme})=>theme.soft};
`

const Login =styled.div`
    margin: 0 18px 0 24px;
    text-align: left;
`

const Button =styled.button`
    padding: 5px 15px;
    gap: 5px;
    background-color: transparent;
    display: flex;
    align-items: center;
    border: 1px solid #3ea6ff;
    color: #3ea6ff;
    margin: 10px 0 0 ;
    cursor: pointer;
    border-radius: 2px;
    font-weight: 500;
`

const Title =styled.h2`
    font-size: 14px;
    font-weight: 500;
    color: #aaaaaa;
    margin-bottom: 20px;
`

const Img = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: scale-down;
`

const Outside = styled.div`
    min-width: calc(100vw - 240px);
    min-height: 100vh;
`

const Menu = ({darkMode, setDarkMode, sidebar, setSidebar}) => {
    const [close, setClose] = useState(false)
    const [channels, setChannels] = useState(null)
    const user = useSelector(state => state.user.currentUser)

    const handleClose = () => {
        setClose(true)
        setTimeout(()=> {
            setSidebar(!sidebar)            
        }, 500 )
    };

    const getChannels = async() => {
        try {
            const res = await axios.get("/users/subs")
            setChannels( res.data)
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(()=>{
        if(user) getChannels()
    },[]);
    
    return (
    <MenuContainer close={close} >
        <Sidebar tabIndex={0} close={close}>
            <Header >
                <MenuSharpIcon onClick={handleClose} />
                <Link to="/" className="logo">
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
                    <Item>
                        <HistoryOutlinedIcon />
                        History
                    </Item>
                    <Hr />
                    {!user && (
                        <>               
                            <Login>
                                Sign in to like videos, comment, and subscribe.
                                <Link to="signin" >
                                    <Button>
                                        <AccountCircleOutlinedIcon />
                                        SIGN IN
                                    </Button>
                                </Link>
                            </Login>
                            <Hr />
                        </>
                    )}                    
                    {channels && (
                        <>
                            <Title>SUBSCRIPTIONS</Title>
                            {channels.map((channel) => (
                                <Item key={channel._id} >
                                    {channel.img && (<Img src={channel.img} alt=""/>)}
                                    {channel.name}
                                </Item>
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