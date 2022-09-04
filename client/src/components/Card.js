import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";

const Container = styled.div`
	width: 100%;
	padding-bottom: 8px;
	display: flex;
	flex-direction: ${(props) => (props.type === "sm" ? "row" : "column")};
	align-items: flex-start;
	justify-content: flex-start;
	margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "36px")};
	&:hover {
		transform: ${(props) => (props.play ? "scale(1.18)" : "scale(1)")};
		transition: all 0.5s ease;
		background: ${(props) => (props.play ? "#88888815" : "")};
	}
`;

const VideoLink = styled(Link)`
	width: 100%;
	cursor: pointer;
	width: ${(props) => (props.type === "sm" ? "178px" : "100%")};
	height: ${(props) => (props.type === "sm" ? "103px" : "100%")};
	position: relative;
	&:hover {
		&::after {
			content: "Keep hovering to play";
			display: ${(props) => (props.play ? "none" : "flex")};
			background: ${({ theme }) => theme.bgDarker};
			font-size: 12px;
			padding: 6px 10px;
			border-radius: 3px;
			position: absolute;
			right: 10px;
			bottom: 10px;
			z-index: 16;
		}
	}
`;

const Img = styled.img`
	width: ${(props) => (props.type === "sm" ? "178px" : "100%")};
	height: ${(props) => (props.type === "sm" ? "103px" : "100%")};
	object-fit: scale-down;
`;

const Details = styled.div`
	display: flex;
	margin-top: ${(props) => props.type === "sm" ? "12px" : "16px"};
	font-size: 14px;
`;

const ChannelImg = styled.img`
	display: ${(props) => (props.type === "sm" ? "none" : "flex")};
	min-width: 36px;
	height: 36px;
	border-radius: 50%;
	background: #606060;
	object-fit: cover;
`;

const Texts = styled.div`
	margin-left: ${(props) => (props.type === "sm" ? "5px" : "14px")};
	height: ${(props) => (props.type === "sm" ? "103px" : "100%")};
	text-align: left;
`;

const Title = styled.h4`
	margin-top: 0;
	margin-bottom: ${(props) => (props.type === "sm" ? "5px" : "18px")};
	line-height: ${(props) => (props.type === "sm" ? "18px" : "20px")};
`;

const ChannelName = styled.h3`
	margin-bottom: 4px;
	margin-top: ${(props) => (props.type === "sm" ? 0 : "12px")};
	font-size: 12px;
	color: ${({ theme }) => theme.textSoft};
`;

const Info = styled.span`
	font-size: 12px;
	color: ${({ theme }) => theme.textSoft};
`;

const VideoFrame = styled.video`
	width: 100%;
	height: 150px;
	flex:1;
	object-fit: cover;
	&:hover {
		z-index: 5;
	}
`;

const Card = ({ type, video }) => {
	const [channel, setChannel] = useState([]);
	const [play, setPlay] = useState(0)
	const [timerId, setTimerId] = useState(0)
	const [player ,setPlayer] = useState(undefined)

	useEffect(() => {
		try {
			const fetchChannel = async () => {
				const res = await axios.get(
					"http://localhost:8800/api" + `/users/find/${video.userId}`
				);
				setChannel(res.data);
			};
			fetchChannel();
		} catch (err) {
			console.error(err);
		}
	}, [video.userId]);

	const playVid = (e) => {
		if(timerId) return
		const timer = setTimeout(()=>{
			e.target && e.target.play()
			setPlay(1)
			setPlayer(e.target)
		}, 2000)
		setTimerId(timer);
	}

	const stop = (e) => {
		if (timerId) {
			clearTimeout(timerId)
			setTimerId(0)
			if(play) {
				e.target.pause()
				e.target.currentTime= 0
				e.target.load()
				setPlay(0)
			}
		}		
	}

	useEffect(() => {
		return () => {
			player && player.pause()
		}
	}, [player])

	return (
		<Container type={type}  play={play} >
			<VideoLink to={`/video/${video._id}`} play={play} >
				{type ? (
					<Img src={video.imgUrl} />
				) : (
					<VideoFrame
						poster={video.imgUrl}
						src={video.videoUrl} 
						controls={play} 
						play={play} 
						muted
						onMouseEnter={playVid} 
						onMouseOut={stop}
						/>
				)}
			</VideoLink>
			<Details type={type}>
				<Link to={`/channel/${channel?._id}`}>
					<ChannelImg src={channel?.imgUrl} alt=""/>
				</Link>
				<Texts type={type}>
					<Link to={`/video/${video._id}`}>
						<Title type={type}>{video.title} </Title>
					</Link>
					<Link to={`/channel/${channel?._id}`}>
						<ChannelName type={type}> {channel?.name} </ChannelName>
					</Link>
					<Info>
						{" "}
						{video.views} &bull; {format(video.createdAt)}{" "}
					</Info>
				</Texts>
			</Details>
		</Container>
	);
};

export default Card;
