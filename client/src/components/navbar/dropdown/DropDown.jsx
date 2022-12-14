import React, { useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PortraitOutlinedIcon from "@mui/icons-material/PortraitOutlined";
import SwitchAccountOutlinedIcon from "@mui/icons-material/SwitchAccountOutlined";
import Brightness3OutlinedIcon from "@mui/icons-material/Brightness3Outlined";
import TranslateIcon from "@mui/icons-material/Translate";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { changeCountry, changeLanguage, logout } from "../../../redux/userSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase.config";
import { Link } from "react-router-dom";
import { Selector } from "./Selector";
import { Countries } from "./Countries";
import { Languages } from "./Languages";
import ProfileImg from "../../../utils/constants/ProfileImg";
import SwitchAccount from "./SwitchAccount";
import Appearance from "./Appearance";
import StudioIcon from "../../../icons/StudioIcon";
import { useAnchorScroll } from "../../../utils/functions/useAnchorScroll";

const Screen = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	width: calc(100vw - 8px);
	height: 100vh;
	z-index: 40;
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
	z-index: 45;
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.dropDown.item};
	box-shadow: 0 3px 2px 0 #00000022;
	border-top: transparent;
`;

const Menu = styled.section`
	width: 300px;
	height: 100%;
	@media (max-height: 680px) {
		max-height: calc(100vh - 100px);
	}
	display: flex;
	flex-direction: column;
	z-index: 45;
	transition: all 0.5s ease-in-out;
`;

const Header = styled.header`
	z-index: 45;
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
`;

const Wrapper = styled.div`
	width: 300px;
	height: 100%;
	padding: 8px 0 16px 0;
`;

const Title = styled.h2`
	margin-left: 10px;
	font-size: 18px;
	font-weight: 500;
	text-transform: capitalize;
`;

export const Item = styled.div`
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
	const [submenu, setSubmenu] = useState(undefined);
	const {currentUser} = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const {themeName} = useSelector((state) => state.user.theme)
	const {country} = useSelector((state) => state.user)
	const {language} = useSelector((state) => state.user)
	const chainRef = useAnchorScroll()

	const handleSignout = () => {
		document.cookie = 'access_token=null; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		firebaseLogout();
		dispatch(logout());
		window.location.reload();
	};

	const firebaseLogout = async () => {
		await signOut(auth);
	};

	return (
		<Screen ref={chainRef} >
			<MenuContainer ref={props.menuRef}>
				<Menu>
					<Header style={{padding: !currentUser && !submenu && "0" }} >
						{submenu !== undefined && (
							<>
								<ArrowBackIcon
									style={{ margin: "5px 10px 5px 0px" }}
									onClick={() => setSubmenu(undefined)}
									cursor="pointer"
								/>
								{(submenu === "Location" || submenu === "Language") ? (`Choose Your ${submenu}`
									) : (
										`${submenu}`
								)}
							</>
						)}
						{currentUser !== null && submenu === undefined && (
							<ProfileImg size={42} img={currentUser.img} name={currentUser.name} />
						)}
						{currentUser !== null && submenu === undefined && (<Title>{currentUser && currentUser.name} </Title>)}
					</Header>
					<Container>
						{submenu === undefined && (
							<Wrapper>
								{currentUser &&	( 
									<>
										<Link to={`/channel/${currentUser._id}`}>
											<Item>
												<PortraitOutlinedIcon /> Your channel
											</Item>
										</Link>
										<Link to={`/channel/studio/${currentUser._id}`}>
											<Item>
												<StudioIcon /> YouTube studio
											</Item>
										</Link> 
										<Item 
											style={{ justifyContent: "space-between" }}
											onClick={() => setSubmenu("Accounts")}
										>
											<Span>
												<SwitchAccountOutlinedIcon /> Swicth account
											</Span>
											<ChevronRightIcon style={{ float: "right" }} />
										</Item>
										<Item onClick={handleSignout}>
											<LogoutOutlinedIcon /> Sign out
										</Item>
										<Hr />
										<Item>
											<PaidOutlinedIcon />
											Purchases and memberships
										</Item>
										<Item>
											<PolicyOutlinedIcon />
											Your data in YouTube
										</Item>
										<Hr />
									</>
								)}
								<Item 
									style={{ justifyContent: "space-between" }}
									onClick={() => setSubmenu("Appearance")}
									>
									<Span>
										<Brightness3OutlinedIcon /> Appearance: {themeName} Theme
									</Span>
									<ChevronRightIcon />
								</Item>
								<Item
									onClick={() => setSubmenu("Language")}
									style={{ justifyContent: "space-between" }}
								>
									<Span>
										<TranslateIcon /> Language:{" "}
										{language ? " " + language : " English"}
									</Span>
									<ChevronRightIcon />
								</Item>
								<Item
									onClick={() => setSubmenu("Location")}
									style={{ justifyContent: "space-between" }}
								>
									<Span>
										<LanguageIcon />
										Location: {country ? " " + country : " United Kingdom"}
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
					{(submenu === "Location" || submenu === "Language") && (
						<Selector
							setter={submenu === "Location" ? changeCountry : changeLanguage}
							data={submenu === "Location" ? Countries : Languages}
							submenu={submenu}
							setSubmenu={setSubmenu}
						/>
					)}
					{submenu === "Accounts" && (
						<SwitchAccount
							user={currentUser}
							setSubmenu={setSubmenu}
							handleSignout={handleSignout}
						/>
					)}
					{submenu === "Appearance" && (<Appearance theme={themeName} />)}
				</Menu>
			</MenuContainer>
		</Screen>
	);
});
export default DropDown;
