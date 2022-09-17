import React, { useState } from "react";
import styled from "styled-components";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { dislike } from "../../redux/videoSlice";
import Warning from "../../components/Warning";

const Button = styled.button`
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.bg};
	border: none;
	outline: none;
	margin-inline: 0.75rem;
	cursor: pointer;
	display: flex;
	align-items: center;
	position: relative;
`;

const DislikeBtn = () => {
	const [warn, setWarn] = useState(false);
	const { currentUser } = useSelector((state) => state.user);
	const { currentVideo } = useSelector((state) => state.video);
	const dispatch = useDispatch();

	const handleDislike = async() =>  {
		if(!currentUser) return
		try {
			await axios.put(`http://localhost:8800/api/videos/dislike/${currentVideo._id}`,{},{withCredentials: true} )
			dispatch(dislike(currentUser._id))
		} catch (err) {
			console.log(err);
		}
	}

	const handleWarn = (boolean) => {
		if (currentUser) return
		setWarn(boolean)
	}

	return (
		<Button
			onFocus={() => handleWarn(true)}
			onBlur={() => handleWarn(false)}
			onClick={handleDislike}
		>
			{currentVideo?.dislikes?.includes(currentUser?._id) ? (
				<ThumbDownAltIcon />
			) : (
				<ThumbDownOffAltOutlinedIcon />
			)}
			&nbsp;DISLIKE
			{warn && (
				<Warning
					title={"Don't like this video?"}
					text={"make your opinion count."}
				/>
			)}
		</Button>
	);
};

export default DislikeBtn;
