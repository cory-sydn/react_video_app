import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Comments from "../../components/comment/Comments";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { fetchStart, fetchSuccessful } from "../../redux/videoSlice";
import { format } from "timeago.js";
import LikeBtn from "./LikeBtn";
import DislikeBtn from "./DislikeBtn"
import SaveBtn from "./SaveBtn";
import Subscription from "./Subscription";
import DescRenderer from "./DescRenderer";
import Recommendations from "../../components/Recommendations";

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
	background: #050505;
	width: 100%;
`;

const VideoFrame = styled.video`
	height: 360px;
	width: 100%;
	object-fit: cover;
	background-position: center center;
	&.controls progress{
		color: green;
		background: red;
		height: 1px
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
	place-self: start;
	color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
	display: flex;
	align-items: center;
`;

const Button = styled.button`
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.bg};
	border:none;
	outline: none;
	margin-inline: 0.75rem;
	cursor: pointer;
	display: flex;
	align-items: center;
	position: relative;
`;

const ChannelImg = styled(Link)`
	min-width: 48px;
	height: 48px;
	margin-right: 16px;
`;

const Img = styled.img`
	min-width: 48px;
	height: 48px;
	border-radius: 50%;
	object-fit: cover;
`;

const ChannelLine = styled.div`
	width: calc(100% - 64px);
	height: 59px;
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
	color:#3ea6ff;
	font-size: 12px;
	font-weight: 400;
	cursor: pointer;
`;

const Video = () => {
	const [channel, setChannel] = useState({});
	const { currentVideo } = useSelector((state) => state.video);
	const dispatch = useDispatch();
	const videoId = useParams().id;

	useEffect(() => {
		const cancelToken = axios.CancelToken.source()
		const getVideo = async () => {
			dispatch(fetchStart());
			try {
				const videoRes = await axios.get(`http://localhost:8800/api/videos/find/${videoId}`, {cancelToken: cancelToken.token});
				const channelRes = await axios.get(`http://localhost:8800/api/users/find/${videoRes.data.userId}`, {cancelToken: cancelToken.token});
				
				setChannel(channelRes.data);
				dispatch(fetchSuccessful(videoRes.data));
				document.title = videoRes.data.title
			} catch (err) {
				if(axios.isCancel(err)) return console.log("cancelled!")
				console.log(err.message);
			}
		};
		getVideo();
		return () => {
			cancelToken.cancel()
		}
	}, [videoId, dispatch]);

	return (
		<Container>
			<Content>
				<VideoWrapper>
					<VideoFrame src={currentVideo?.videoUrl} poster={currentVideo?.imgUrl} controls
					//  autoPlay 
					 />
				</VideoWrapper>
				<Title>
					<VideoTags>{currentVideo?.tags.map((tag)=> ("#" + tag + " "))}</VideoTags>				
					{currentVideo?.title}
				</Title>
				<Details>
					<Info>
						{currentVideo?.views}{" views"} &bull; {format(currentVideo?.createdAt)}{" "}
					</Info>
					<Buttons>
						<LikeBtn />
						<DislikeBtn />
						<Button>
							<ReplyOutlinedIcon/>
							{" "}SHARE
						</Button>
						<SaveBtn/>
						<Button>
							<MoreHorizOutlinedIcon />
						</Button>
					</Buttons>
				</Details>
				<Details>
					<ChannelImg to={`/channel/${channel._id}`} >
						<Img src={channel.img} />
					</ChannelImg>
					<ChannelLine>
						<ChannelInfo>
							<ChannelName>
								{channel?.name?.toUpperCase()}
								<Info style={{ margin: 0, fontSize: 12, fontWeight: 400 }}>
									{channel.subscribers}{" subscribers "}
								</Info>
							</ChannelName>
						</ChannelInfo>
						<Subscription channel={channel} setChannel={setChannel} />
					</ChannelLine>					
					<DescRenderer text={currentVideo?.desc} tags={currentVideo?.tags} />					
				</Details>
				<Comments />
			</Content>
			<Recommendations tags={currentVideo?.tags} />
		</Container>
	);
};

export default Video;
