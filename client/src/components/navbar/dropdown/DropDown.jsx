import React, { useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PortraitOutlinedIcon from "@mui/icons-material/PortraitOutlined";
import SwitchAccountOutlinedIcon from "@mui/icons-material/SwitchAccountOutlined";
import Brightness3OutlinedIcon from "@mui/icons-material/Brightness3Outlined";
import TranslateIcon from '@mui/icons-material/Translate';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LanguageIcon from '@mui/icons-material/Language';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { logout } from "../../../redux/userSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase.config";
import { Link } from "react-router-dom";
import {Selector} from "./Selector";
import { Countries } from './Countries';
import { Languages } from './Languages';
import ProfileImg from '../../../utils/constants/ProfileImg'

const Screen = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: calc(100vw - 8px);
  height: 100vh;
	z-index: 10;
`;

const MenuContainer = styled.div`
	position: absolute;
	top: 46px;
	right: 30px;
	width: 300px;
	height: max-content;
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
	z-index: 15;
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.dropDown.item};
  box-shadow: 0 3px 2px 0 #00000022;
	border-top: transparent;
	transition: all 0.5s ease-in-out;
`;

const Menu = styled.section`
	width: 300px;
	height: 100%;
	@media (max-height: 650px){
    height: calc(100vh - 60px);
	}
	display: flex;
	flex-direction: column;
	z-index: 15;
	transition: all 0.5s ease-in-out;
`;

const Header = styled.header`
	transition: all 0.5s ease-in-out;
	z-index: 15;
	display: flex;
	align-items: center;
	padding: 15px 20px 15px;
	background: ${({ theme }) => theme.dropDown.bg};
	border: 1px solid ${({ theme }) => theme.soft};
	border-top: transparent;
	box-shadow: inset 0 -1px 2px 0 #00000018;
`;

const Container = styled.div`
	font-size: 14px;
	padding-top: 1px;
	text-align: left;
	overflow-x: hidden;
	overflow-y: scroll;
	overscroll-behavior: none;
	border: 1px solid ${({ theme }) => theme.soft};
	border-top: transparent;
	&::-webkit-scrollbar {
		background: transparent;
		width: 8px;
	}
	&:hover {
		&::-webkit-scrollbar-thumb {
			background: ${({ theme }) => theme.scroll};
		}
	}
	position: relative;
	transition: all 0.5s ease-in-out;
`;

const Wrapper = styled.div`
	width: 300px;
	height: 100%;
	padding: 8px 0 16px 0;
	transition: all 0.5s ease-in-out;
`;

const Title = styled.h2`
	margin-left: 10px;
	font-size: 18px;
	font-weight: 500;
	text-transform: capitalize;
`;

const Item = styled.div`
	height: 40px;
	display: flex;
	align-items: center;
	padding: 0 15px;
	gap: 10px;
	font-size: 14px;
	cursor: pointer;
	&:hover {
		background: ${({ theme }) => theme.dropDown.hover};
	}
	&:active {
		background: ${({ theme }) => theme.dropDown.active};
	}
`;

const Hr = styled.hr`
	width: 100%;
	height: 8px;
	border: transparent;
	border-bottom: 1px solid ${({ theme }) => theme.soft};
	margin-bottom: 8px;
`;

const Span = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 10px;
`;

const DropDown = forwardRef((props, ref) => {
  const [country, setCountry] = useState(undefined)
  const [language, setLanguage] = useState(undefined)
	const [submenu, setSubmenu] = useState(undefined)
	const user = useSelector((state) => state.user.currentUser);
	const dispatch = useDispatch();
	
	const handleSignout = () => {
		//document.cookie = 'access_token=null; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		firebaseLogout()
		dispatch(logout());
		window.location.reload()
	};

	const firebaseLogout = async() => {
		await signOut(auth)
	}
 
	return (
		<Screen >
			<MenuContainer ref={props.menuRef} >
				<Menu>
					<Header>
						{submenu !== undefined && (
							<>
								<ArrowBackIcon 
								style={{margin: "5px 10px 5px 0px"}}
								onClick={() => setSubmenu(undefined)}
								cursor="pointer" /> 
								Choose Your {submenu}
							</>
						)}
						{user && (submenu === undefined &&
							(<ProfileImg size={42} img={user.img} name={user.name} />)
						)}
						{submenu === undefined && (
							<Title>{user && user.name} </Title>
						)}
					</Header>
					<Container>
						{submenu === undefined &&	(<Wrapper>
							<Link to={`/channel/${user._id}`} >
								<Item  >
									<PortraitOutlinedIcon /> Your channel
								</Item>
							</Link>
							<Link to="/">
								<Item style={{justifyContent:"space-between"}}>
									<Span>
										<SwitchAccountOutlinedIcon /> Swicth account 
									</Span>
									<ChevronRightIcon style={{ float: "right"}} />
								</Item>
							</Link>
							{user && (
								<Item onClick={handleSignout}>
									<LogoutOutlinedIcon /> Sign out
								</Item>
							)}
							<Hr />
							<Item>
								<PaidOutlinedIcon />Purchases and memberships
							</Item>
							<Item>
								<PolicyOutlinedIcon />Your data in YouTube
							</Item>
							<Hr />
							<Item style={{justifyContent:"space-between"}}>
								<Span>
									<Brightness3OutlinedIcon /> Appearance: 
								</Span><ChevronRightIcon />
							</Item>
							<Item  onClick={() => setSubmenu("Language")} style={{justifyContent:"space-between"}}>
								<Span>
									<TranslateIcon /> Language: {language ? " " + language : " English"}
								</Span>
								<ChevronRightIcon />								
							</Item>
							<Item  onClick={() => setSubmenu("Location")} style={{justifyContent:"space-between"}}>
								<Span>
									<LanguageIcon />Location: {country ? " " + country : " United Kingdom"}
								</Span>
								<ChevronRightIcon />
							</Item>									
							<Hr />
							<Item>
								<SettingsOutlinedIcon /> Settings
							</Item>
							<Hr />
							<Item>
								<HelpOutlineOutlinedIcon /> Help
							</Item>
							<Item>
								<FeedbackOutlinedIcon /> Send Feedback
							</Item>
						</Wrapper>
					)}	
					</Container>
					{submenu !== undefined && (
							<Selector
							setter = {submenu === "Location" ? setCountry : setLanguage}
							data = {submenu === "Location" ? Countries : Languages}
							submenu={submenu}
							setSubmenu={setSubmenu}
						/>
					)}		
				</Menu>
			</MenuContainer>
		</Screen>
	);
})
export default DropDown;
