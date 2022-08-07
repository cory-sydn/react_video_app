import React, { useEffect, useRef, useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";
import DropDown from "./DropDown";

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

const User = () => {
  const [open, setOpen] = useState(false)
	const user = useSelector((state) => state.user.currentUser);
	const buttonRef = useRef()
  const menuRef = useRef()

	const handleDropDown = (e) => {
		if(buttonRef.current && buttonRef.current.contains(e.target)) return
    if(menuRef.current && !menuRef.current.contains(e.target)){
    setOpen(false)
    }
  };

  useEffect(()=> {
    document.addEventListener("mousedown", handleDropDown)
  }, [menuRef, buttonRef]);

	return (
		<Container>
			{user === null ? (
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
					<VideoCallOutlinedIcon style={{ marginLeft: 16 }} />
					<NotificationsNoneIcon
						cursor="pointer"
						style={{ marginInline: 28 }}
					/>
					{user && (user.imgUrl === undefined ? (
						<BlankImg ref={buttonRef} onClick={()=>setOpen(!open)} >{(user?.name[0]).toUpperCase()}</BlankImg>
					) : (
						<Img ref={buttonRef} onClick={()=>setOpen(!open)} src={user.img} alt="" />
					))}
					{open && <DropDown setOpen={setOpen} menuRef={menuRef} /> }				
				</Section>
			)}
		</Container>
	);
};

export default User;
