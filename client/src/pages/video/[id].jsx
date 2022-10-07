import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Comments from "../../components/comment/Comments";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
	fetchStart,
	fetchSuccessful,
	incrementView,
} from "../../redux/videoSlice";
import { format } from "timeago.js";
import LikeBtn from "./LikeBtn";
import DislikeBtn from "./DislikeBtn";
import SaveBtn from "./SaveBtn";
import Subscription from "./Subscription";
import DescRenderer from "./DescRenderer";
import Recommendations from "../../components/Recommendations";
import Darkness from "../../utils/constants/Darkness";
import Options from "./Options";
import ShareBtn from "./ShareBtn";
import ProfileImg from "../../utils/constants/ProfileImg";

const Container = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	gap: 24px;
	padding: 24px 36px 50px;
	background: ${({ theme }) => theme.bg};
	z-index: 3;
`;

const Content = styled.section`
	width: 68%;
	min-width: 650px;
	flex: 5;
	display: flex;
	flex-direction: column;
	@media (max-width: 730px) {
		width: 100%;
		min-width: 320px;
	}
`;

const VideoWrapper = styled.div`
	display: grid;
	place-content: center;
	width: 100%;
`;

const VideoFrame = styled.video`
	height: 360px;
	width: 100%;
	object-fit: cover;
	background-position: center center;
	&.controls progress {
		color: green;
		background: red;
		height: 1px;
	}
`;

const Title = styled.h1`
	margin: 20px 0 8px;
	display: flex;
	flex-direction: column;
	text-align: left;
	font-size: 20px;
	font-weight: 600;
	color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: space-between;
	border-bottom: 1px solid ${({ theme }) => theme.soft};
	margin-bottom: 1.25rem;
	padding-bottom: 1.25rem;
`;

const Info = styled.span`
	font-size: 14px;
	place-self: flex-start;
	color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
	display: flex;
	align-items: center;
`;

const Button = styled.button`
	width: 40px;
	height: 40px;
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.bg};
	border: none;
	border-radius: 50%;
	outline: none;
	margin-inline: 5px;
	cursor: pointer;
	display: grid;
	place-content: center;
	align-items: center;
`;

const ChannelLine = styled.div`
	width: calc(100% - 64px);
	height: 59px;
	margin-bottom: 12px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const ChannelInfo = styled.div`
	display: flex;
`;

const ChannelName = styled.h3`
	margin: 0;
	line-height: 20px;
	text-align: left;
	display: flex;
	flex-direction: column;
`;

const VideoTags = styled.div`
	margin: -2px 2px 2px 0;
	color: #3ea6ff;
	font-size: 12px;
	font-weight: 400;
	cursor: pointer;
`;

const Video = () => {
	const [channel, setChannel] = useState({});
	const [openOptions, setOpenOptions] = useState(false);
	const [secondCheck, setSecondCheck] = useState(false);
	const [darkEffect, setDarkEffect] = useState(false);
	const [time, setTime] = useState(0);
	const [narrowScreen,setNarrowScreen] = useState(false)
	const { currentVideo } = useSelector((state) => state.video);
	const dispatch = useDispatch();
	const videoId = useParams().id;
	const optionRef = useRef();
	const buttonRef = useRef();
	const warnRef = useRef();
	const videoRef = useRef();

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		const getVideo = async () => {
			dispatch(fetchStart());
			setTime(0);
			try {
				const videoRes = await axios.get(
					`http://localhost:8800/api/videos/find/${videoId}`,
					{ cancelToken: cancelToken.token }
				);
				const channelRes = await axios.get(
					`http://localhost:8800/api/users/find/${videoRes.data.userId}`,
					{ cancelToken: cancelToken.token }
				);

				setChannel(channelRes.data);
				dispatch(fetchSuccessful(videoRes.data));
				document.title = videoRes.data.title;
			} catch (err) {
				if (axios.isCancel(err)) return console.log("cancelled!");
				console.log(err.message);
			}
		};
		getVideo();
		return () => {
			cancelToken.cancel();
		};
	}, [videoId, dispatch]);

	const handleToggleOptions = (e) => {
		setOpenOptions(!openOptions);
		e.target.classList.contains("btn") && e.target.classList.add("glow");
		setTimeout(() => {
			e.target.classList.remove("glow");
		}, 500);
	};

	const handleFocus = useCallback(
		(e) => {
			if (buttonRef.current && buttonRef.current.contains(e.target)) return;
			if (warnRef.current && warnRef.current.contains(e.target)) return;
			if (optionRef.current && !optionRef.current.contains(e.target)) {
				setOpenOptions(false);
				secondCheck && closeAlert();
				darkEffect && closeAlert();
			}
		},
		[secondCheck, darkEffect]
	);

	useEffect(() => {
		document.addEventListener("mousedown", handleFocus);
		return () => {
			document.removeEventListener("mousedown", handleFocus);
		};
	}, [optionRef, buttonRef, handleFocus, warnRef]);

	useEffect(() => {
		if (secondCheck) {
			setDarkEffect(true);
		}
	}, [secondCheck, darkEffect]);

	function closeAlert() {
		setSecondCheck(false);
		setTimeout(() => {
			setDarkEffect(false);
		}, 400);
	}

	const handleViews = useCallback(async () => {
		const seekCount = videoRef.current.played.length;
		setTime(0);
		for (let index = 0; index < seekCount; index++) {
			const start = videoRef.current.played.start(index);
			const end = videoRef.current.played.end(index);
			setTime((prev) => prev + (end - start));
		}
		if (
			Math.round(time) === Math.round(videoRef.current.duration) ||
			Math.round(time) === 30
		) {
			// firstly cut off onTimeUpdate event handler
			setTime(35);
			await axios
				.put(`http://localhost:8800/api/videos/view/${currentVideo?._id}`)
				.then((response) => {
					if (response.status === 200) {
						return dispatch(incrementView(response.data.views));
					}
				});
		}
	}, [time, currentVideo?._id, dispatch]);

	useEffect(() => {
		const handleLayout = () => {
			if(window.innerWidth < 1106) {
				setNarrowScreen(true)
			} else {
				setNarrowScreen(false)
			}
		}
		window.addEventListener("resize", handleLayout)
		window.addEventListener("load", handleLayout)
		return () => {
			window.removeEventListener("resize", handleLayout)
			window.removeEventListener("load", handleLayout)
		}
	}, [])

	return (
		<Container>
			<Content>
				<VideoWrapper>
					<VideoFrame
						src={currentVideo?.videoUrl}
						poster={currentVideo?.imgUrl}
						controls
						type="video"
						onTimeUpdate={
							videoRef.duration < 30 && time < 30
								? handleViews
								: time < 31
								? handleViews
								: undefined
						}
						//autoPlay
						ref={videoRef}
					/>
				</VideoWrapper>
				<Title>
					<VideoTags>
						{currentVideo?.tags?.map((tag) => "#" + tag + " ")}
					</VideoTags>
					{currentVideo?.title[0]?.toUpperCase() +
						currentVideo?.title?.slice(1)}
				</Title>
				<Details>
					<Info style={{placeSelf: "center"}} >
						{currentVideo?.views}
						{" views"} &bull; {format(currentVideo?.createdAt)}{" "}
					</Info>
					<Buttons>
						<LikeBtn />
						<DislikeBtn />
						<ShareBtn />
						<SaveBtn />
						<Button
							className="btn"
							onClickCapture={handleToggleOptions}
							ref={buttonRef}
							name="button"
						>
							<MoreHorizOutlinedIcon style={{ pointerEvents: "none" }} />
						</Button>
						{openOptions && (
							<Options
								optionRef={optionRef}
								video={currentVideo}
								warnRef={warnRef}
								secondCheck={secondCheck}
								setSecondCheck={setSecondCheck}
								setOpenOptions={setOpenOptions}
								close={closeAlert}
								channelId={channel._id}
							/>
						)}
					</Buttons>
				</Details>
				<Details>
					<Link to={`/channel/${channel._id}`}>
						{channel && (
							<ProfileImg size={48} img={channel.img} name={channel.name} />
						)}
					</Link>
					<ChannelLine>
						<ChannelInfo>
							<ChannelName>
								{channel?.name?.toUpperCase()}
								<Info style={{ margin: 0, fontSize: 12, fontWeight: 400 }}>
									{channel.subscribers}
									{" subscribers "}
								</Info>
							</ChannelName>
						</ChannelInfo>
						<Subscription channel={channel} setChannel={setChannel} />
					</ChannelLine>
					<DescRenderer text={currentVideo?.desc} tags={currentVideo?.tags} />
				</Details>
				{narrowScreen ? (
					<Recommendations tags={currentVideo?.tags} />
				) : (
					<Comments channelId={currentVideo?.userId} />
				)}
			</Content>
			{narrowScreen ? (
				<Comments channelId={currentVideo?.userId} />
				) : (
				<Recommendations tags={currentVideo?.tags} />
			)}
			{darkEffect && <Darkness status={secondCheck} />}
		</Container>
	);
};

export default Video;
