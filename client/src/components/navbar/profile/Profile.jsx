import React, { useEffect, useRef, useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import CarbonVideoAdd from "../../../icons/CarbonVideoAdd";
import CarbonVideoFilled from "../../../icons/CarbonVideoFilled";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';import { useSelector } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";
import DropDown from "../dropdown/DropDown";
import Upload from "../../upload/Upload";
import GlowingButton, { BtnContainer } from "../../../utils/constants/GlowingButton";
import ProfileImg from '../../../utils/constants/ProfileImg'

const Container = styled.div`
	display: flex;
	align-items: center;
	position: relative;
`;

const Button = styled.button`
	float: right;
	min-width: 112px;
	padding: 5px 15px;
	gap: 5px;
	background-color: transparent;
	display: flex;
	align-items: center;
	border: 1px solid #3ea6ff;
	color: #3ea6ff;
	margin: auto;
	cursor: pointer;
	border-radius: 2px;
	font-weight: 500;
`;

const Section = styled.section`
	display: flex;
	align-items: inherit;
	margin-right: 8px;
`;

const ImgCircle = styled.button`
	display: grid;
	place-content: center;
	z-index: 2;
	width: 34px;
	height: 34px;
	border: 1px solid transparent;
	border-radius: 50%;
	&:focus {
		border: 1px solid #2c7ef3;
	}
	&:hover {
		border: 1px solid #2c7ef3;
	}
`;

const UploadSectionButton = styled(BtnContainer)`
	margin-left: 6px;
	margin-right: 3px;
	background: transparent;
	&:hover {
		&::after {
			content: "Upload Video" ;
			background: ${({ theme }) => theme.bgLighter};
			font-size: 12px;
			padding: 6px 10px;
			border-radius: 3px;
			position: absolute;
			right: -20px;
			bottom: -55px;
			z-index: 999;
		}
	}
`;

const NotificationButton = styled(BtnContainer)`
	background: transparent;
	margin-right: 15px;
	&:hover {
		&::after {
			content: "Notifications" ;
			background: ${({ theme }) => theme.bgLighter};
			font-size: 12px;
			padding: 6px 10px;
			border-radius: 3px;
			position: absolute;
			right: -20px;
			bottom: -40px;
			z-index: 999;
		}
	}
`;

const GlowingVideoIcon = styled(CarbonVideoFilled)`
	animation: blueWawe 1.5s ease-in-out both infinite;
	@keyframes blueWawe {
		0%{
			color:#3ea5ff;
		}
		100%{
			color:#94cdff;
		}
	}
`;

const Profile = () => {
  const [dropdown, setDropdown] = useState(false)
	const [openUpload, setOpenUpload] = useState(false)
	const [activeUpload, setActiveUpload] = useState(false)
	const {currentUser} = useSelector((state) => state.user);
  const menuRef = useRef(null)

	useEffect(() => {
		const handler = (event) => {
		 if (dropdown && menuRef.current && !menuRef.current.contains(event.target)) {
			setDropdown(false);
		 }
		};
		document.addEventListener("mousedown", handler);
		document.addEventListener("touchstart", handler);
		return () => {
		 	// Cleanup the event listener
			document.removeEventListener("mousedown", handler);
			document.removeEventListener("touchstart", handler);
		};
	}, [dropdown]);

	const activateUploading = () => {
		setOpenUpload(true) 
		setActiveUpload(true)	
	}

	return (
		<Container>
			{currentUser === null ? (
				<Section>
					<MoreVertSharpIcon cursor="pointer" style={{ marginInline: 16 }} />
					<Link to="signin">
						<Button>
							<AccountCircleOutlinedIcon />
							SIGN IN
						</Button>
					</Link>
				</Section>
			) : (
				<Section>
					<UploadSectionButton 
						onClick={activateUploading} 
					>
						<GlowingButton icon={openUpload 
							? (<GlowingVideoIcon/>) 
							: (<CarbonVideoAdd />)
						}/>
					</UploadSectionButton>
					{openUpload && 
						<Upload setOpenUpload={setOpenUpload} activeUpload={activeUpload} setActiveUpload={setActiveUpload} />
					}
					<NotificationButton>
						<GlowingButton
							icon={<NotificationsNoneIcon />}
						/>
					</NotificationButton>
					{currentUser && (
						<ImgCircle onClick={() => setDropdown(true)}>
								<ProfileImg  size={32} img={currentUser?.img} name={currentUser?.name}/>
						</ImgCircle>
					)}
					{dropdown && (
						<DropDown 
							setDropdown={setDropdown} 
							menuRef={menuRef} 
						/>
					)}		
				</Section>
			)}
		</Container>
	);
};

export default Profile;