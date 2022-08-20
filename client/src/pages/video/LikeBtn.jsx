import React, { useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { like } from "../../redux/videoSlice";
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

const LikeBtn = () => {
  const [warn, setWarn] = useState(false)
  const { currentUser } = useSelector((state) => state.user);
	const { currentVideo } = useSelector((state) => state.video);
	const dispatch = useDispatch();

	const handleLike = async() =>  {
		if(!currentUser) return
		try {
			await axios.put(`http://localhost:8800/api/videos/like/${currentVideo?._id}`, {}, {withCredentials: true})
			dispatch(like(currentUser._id))
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
			onClick={handleLike}
		>
			{currentVideo.likes?.includes(currentUser?._id) ? (
				<ThumbUpAltIcon />
			) : (
				<ThumbUpOutlinedIcon />
			)}
			&nbsp;{currentVideo.likes?.length}{" "}
			{warn && (
				<Warning title={"Like this video?"} text={"make your opinion count."} />
			)}
		</Button>
	);
};

export default LikeBtn;
