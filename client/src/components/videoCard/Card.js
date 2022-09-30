import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import TeenyiconsMoreVerticalOutline from "../../icons/TeenyiconsMoreVerticalOutline.jsx";
import ProfileImg from "../../utils/constants/ProfileImg.jsx";
import Options from "./Options.jsx";

const Container = styled.div`
	width: 100%;
	padding-bottom: 8px;
	display: flex;
	flex-direction: ${(props) => (props.type === "sm" ? "row" : "column")};
	align-items: flex-start;
	justify-content: flex-start;
	max-width: ${(props) => (props.type === "sm" ? "100%" : "320px")};
	margin-bottom: 10px;
	height: ${(props) => (props.type === "sm" ? "103px" : "100%")};
	&:hover {
		transform: ${(props) => (props.play ? "scale(1.18)" : "scale(1)")};
		transition: all 0.5s ease;
		background: ${(props) => (props.play ? "#88888840" : "")};
		mask-image: linear-gradient(#363636f4 90%, #4c4c4c20);
		border-radius: 0 0 5px 5px;
		z-index: 20;
	}
`;

const Context = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

const VideoLink = styled(Link)`
	width: ${(props) => (props.type === "sm" ? "160px" : "100%")};
	cursor: pointer;
	width: ${(props) => (props.type === "sm" ? "160px" : "100%")};
	max-width: ${(props) => (props.type === "sm" ? "160px" : "")};
	height: ${(props) => (props.type === "sm" ? "103px" : "")};
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
	width: ${(props) => (props.type === "sm" ? "160px" : "100%")};
	max-width: ${(props) => (props.type === "sm" ? "160px" : "100%")};
	height: ${(props) => (props.type === "sm" ? "103px" : "100%")};
	object-fit: cover;
`;

const Details = styled.div`
	flex: 1;
	min-width: ${(props) =>
		props.type === "sm" ? "190px" : "calc(100% - 24px)"};
	height: ${(props) => (props.type === "sm" ? "103px" : "100%")};
	display: flex;
	margin-top: ${(props) => (props.type === "sm" ? "1px" : "16px")};
	padding: ${(props) => (props.play ? "0 10px" : "0")};
	font-size: 14px;
	transition: all 0.5s ease-in-out;
`;

const Texts = styled.div`
	margin-left: ${(props) => (props.type === "sm" ? "5px" : "14px")};
	height: ${(props) => (props.type === "sm" ? "103px" : "100%")};
	padding-right: 10px;
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
	min-height: 130px;
	max-height: 160px;
	flex: 1;
	object-fit: cover;
`;

const OptionArea = styled.div`
	display: flex;
	padding-top: ${(props) => (props.type === "sm" ? 0 : "16px")};
`;

const ThreeDotsContainer = styled.div`
	width: 24px;
	height: 24px;
	display: grid;
	place-content: center;
	border-radius: 50%;
	border: none;
	background: transparent;
	z-index: 25;
	cursor: pointer;
	animation: ${(props) => (props.glow ? "glow 0.3s ease-in-out;" : "")};
	@keyframes glow {
		0% {
			border: 1px solid ${({ theme }) => theme.text};
			box-shadow: inset 0 0 15px 0 ${({ theme }) => theme.textSoft};
		}
		100% {
			border: 1px solid ${({ theme }) => theme.bgLighter};
			box-shadow: inset 0 0 15px 0 ${({ theme }) => theme.bgLighter};
		}
	}
`;

const Card = ({ type, video }) => {
	const [channel, setChannel] = useState([]);
	const [play, setPlay] = useState(0);
	const [timerId, setTimerId] = useState(0);
	const [glow, setGlow] = useState(false);
	const [threeDots, setThreeDots] = useState(false);
	const [openOptions, setOpenOptions] = useState(false);
	const optionRef = useRef();
	const buttonRef = useRef();

	useEffect(() => {
		try {
			const fetchChannel = async () => {
				const res = await axios.get(
					`http://localhost:8800/api/users/find/${video?.userId}`
				);
				setChannel(res.data);
			};
			fetchChannel();
		} catch (err) {
			console.error(err);
		}
	}, [video?.userId]);

	const playVid = (e) => {
		if (timerId) return;
		const timer = setTimeout(() => {
			e.target && e.target.play();
			setPlay(1);
		}, 1500);
		setTimerId(timer);
	};

	const stop = (e) => {
		if (timerId) {
			clearTimeout(timerId);
			setTimerId(0);
			if (play) {
				e.target.pause();
				e.target.currentTime = 0;
				e.target.load();
				setPlay(0);
			}
		}
	};

	const handleToggleOptions = () => {
		setOpenOptions(!openOptions);
		setGlow(true);
		setTimeout(() => {
			setGlow(false);
		}, 300);
	};

	useEffect(() => {
		const handleFocus = (e) => {
			if (buttonRef.current && buttonRef.current.contains(e.target)) return;
			if (optionRef.current && !optionRef.current.contains(e.target)) {
				setOpenOptions(false);
			}
		};

		document.addEventListener("mousedown", handleFocus);
		return () => {
			document.removeEventListener("mousedown", handleFocus);
		};
	}, [optionRef, buttonRef]);

	return (
		<>
			<Container
				type={type}
				play={play}
				onMouseEnter={() => setThreeDots(true)}
				onMouseLeave={() => setThreeDots(false)}
			>
				<VideoLink to={`/video/${video?._id}`} play={play} type={type}>
					{type ? (
						<Img src={video?.imgUrl} type={type} />
					) : (
						<VideoFrame
							poster={video?.imgUrl}
							src={video?.videoUrl}
							play={play}
							muted
							onMouseEnter={playVid}
							onMouseOut={stop}
						/>
					)}
				</VideoLink>
				<Context>
					<Details type={type} play={play}>
						<Link to={`/channel/${channel?._id}`}>
							{channel && type !== "sm" && (
								<ProfileImg size={36} img={channel.img} name={channel.name} />
							)}
						</Link>
						<Texts type={type}>
							<Link to={`/video/${video?._id}`}>
								<Title type={type}>
									{video?.title[0]?.toUpperCase() + video?.title?.slice(1)}{" "}
								</Title>
							</Link>
							<Link to={`/channel/${channel?._id}`}>
								<ChannelName type={type}> {channel?.name} </ChannelName>
							</Link>
							<Info>
								{" "}
								{video?.views} &bull; {format(video?.createdAt)}{" "}
							</Info>
						</Texts>
					</Details>
					<OptionArea type={type}>
						<ThreeDotsContainer
							onClickCapture={handleToggleOptions}
							ref={buttonRef}
							style={{ display: threeDots ? "grid" : "hidden" }}
							name="threeDots"
							glow={glow}
						>
							<TeenyiconsMoreVerticalOutline
								style={{ display: threeDots ? "grid" : "none" }}
							/>
						</ThreeDotsContainer>
						{openOptions && <Options optionRef={optionRef} video={video} />}
					</OptionArea>
				</Context>
			</Container>
		</>
	);
};

export default Card;
