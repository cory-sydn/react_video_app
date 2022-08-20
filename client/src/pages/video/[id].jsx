import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Comments from "../../components/comment/Comments";
import axios from "axios";
import { useParams } from "react-router-dom";
import { fetchStart, fetchSuccessful } from "../../redux/videoSlice";
import { format } from "timeago.js";
import LikeBtn from "./LikeBtn";
import DislikeBtn from "./DislikeBtn"
import SaveBtn from "./SaveBtn";
import Subscription from "./Subscription";

const Container = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	gap: 24px;
	padding: 24px 36px;
`;

const Content = styled.section`
	width: 68%;
	min-width: 550px;
	flex: 5;
	display: flex;
	flex-direction: column;
`;

const RecommendationsSection = styled.section`
	width: 26%;
	min-width: 330px;
	flex: 2;
`;

const VideoWrapper = styled.div`
	display: flex;
`;

const VideoFrame = styled.video`
	max-height: 720px;
	max-width: 100%;
	object-fit: cover;
`

const Title = styled.h1`
  margin: 20px 0 12px;
	display: flex;
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

const ChannelImg = styled.div`
	width: 48px;
	height: 48px;
	margin-right: 10px;
`;

const Img = styled.img`
	width: 36px;
	height: 36px;
	border-radius: 50%;
	object-fit: cover;
`;

const ChannelLine = styled.div`
	width: calc(100% - 63px);
	height: 59px;
	display: flex;
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

const Desc = styled.p`
	white-space: pre-line;
	font-size: 14px;
	padding-top: 20px;
	padding-left: 64px;
	text-align: left;
	height: 84px;
	overflow-y: hidden;
`;

const More = styled.div`
	margin: 16px 0 0 64px;
	color: ${({ theme }) => theme.textSoft};
	font-size: 12px;
	font-weight: 500;
	cursor: pointer;
	letter-spacing: -0.5px;
`;

const Video = () => {
	const [channel, setChannel] = useState({});
	const [showMore, setShowMore] = useState(false);
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
					<VideoFrame src={currentVideo?.videoUrl} />
				</VideoWrapper>
				<Title>{currentVideo?.title} </Title>
				<Details>
					<Info>
						{currentVideo?.views} &bull; {format(currentVideo?.createdAt)}{" "}
					</Info>
					<Buttons>
						<LikeBtn />
						<DislikeBtn />
						<Button>
							<ReplyOutlinedIcon/>
							&nbsp;SHARE
						</Button>
						<SaveBtn/>
						<Button>
							<MoreHorizOutlinedIcon />
						</Button>
					</Buttons>
				</Details>
				<Details>
					<ChannelImg>
						<Img src={channel.img} />
					</ChannelImg>
					<ChannelLine>
						<ChannelInfo>
							<ChannelName>
								{channel?.name?.toUpperCase()}
								<Info style={{ margin: 0, fontSize: 12, fontWeight: 400 }}>
									{channel.subscribers}{" "}
								</Info>
							</ChannelName>
						</ChannelInfo>
						<Subscription channel={channel} setChannel={setChannel} />
					</ChannelLine>
					<Desc>
						{currentVideo?.desc?.length < 157
							? (currentVideo.desc)
							: showMore === false
								?	`${currentVideo.desc.slice(0, 156)}...`
								: currentVideo.desc
						}
					</Desc>
					{currentVideo?.desc?.length > 157 &&
						<More onClick={() => setShowMore(!showMore)}>
							{showMore === true ? ("SHOW LESS") : ("SHOW MORE")}
						</More>
					}
				</Details>
				<Comments />
			</Content>
			{/* <RecommendationsSection>
           
        </RecommendationsSection> */}
		</Container>
	);
};

export default Video;
