import React, { useEffect, useRef, useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";
import DropDown from "../dropdown/DropDown";
import Upload from "../../upload/Upload";

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

const Img = styled.img`
	width: 36px;
	height: 36px;
	border-radius: 50%;
	object-fit: cover;
	cursor: pointer;
`;

const BlankImg = styled.button`
	width: 36px;
	height: 36px;
	border-radius: 50%;
	display: grid;
	place-content: center;
	color: white;
	background: #0a413c;
	border: transparent;
	font-family: sans-serif, Arial, Helvetica;
	font-size: 18px;
	font-weight: 500;
	cursor: pointer;
	&:focus {
		border: 1px solid #2c7ef3;
	}
`;

const UploadSectionButton = styled.div`
	margin-left: 16px;
	cursor: pointer;
	position: relative;
	&:hover {
		&::after {
			content: "Upload Video";
			background: ${({ theme }) => theme.bgDarker};
			font-size: 12px;
			padding: 6px 10px;
			border-radius: 3px;
			position: absolute;
			right: -20px;
			bottom: -60px;
			z-index: 999;
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
					<UploadSectionButton>
						<VideoCallOutlinedIcon onClick={activateUploading} />
					</UploadSectionButton>
					{openUpload && 
						<Upload setOpenUpload={setOpenUpload} activeUpload={activeUpload} setActiveUpload={setActiveUpload} />
					}
					<NotificationsNoneIcon
						cursor="pointer"
						style={{ marginInline: 28 }}
					/>
					{currentUser && (currentUser?.imgUrl === undefined ? (
						<BlankImg onClick={()=>setDropdown(true)} >{(currentUser?.name[0]).toUpperCase()}</BlankImg>
					) : (
						<Img onClick={()=>setDropdown(true)} src={currentUser?.img} alt="" />
					))}
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