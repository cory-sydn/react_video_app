import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import IonIosCloseOutline from "../../icons/IonIosCloseOutline.jsx";
import IonAlertCircled from "../../icons/IonAlertCircled.jsx";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { DeleteComment } from "../../components/comment/DeleteComment";
import { Link } from "react-router-dom";
import { green } from "@mui/material/colors";

const Item = styled.div`
	justify-content: flex-start;
	margin-bottom: 40px;
	text-align: left;
`;

const CommentBody = styled.div`
	display: flex;
	flex-wrap: wrap;
	padding: 0 20px 10px 20px;
`;

const Left = styled.div`
	width: 80%;
	padding-right: 8px;
	min-width: 350px;
`;

const Right = styled.div`
	display: flex;
	justify-content: flex-start;
	width: 20%;
	min-width: 120px;
`;

const Text = styled.div`
	white-space: pre-line;
	display: flex;
	width: 100%;
	margin-bottom: 20px;
`;

const Date = styled.div`
	padding: 16px 24px;
	background: ${({ theme }) => theme.commentButton.color};
	border-radius: 5px;
`;

const DeleteSection = styled.div`
	width: 100%;
	margin-top: 10px;
	height: 50px;
	display: flex;
	justify-content: flex-end;
	position: relative;
`;

const DeleteButton = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: grid;
	place-content: center;
	background: transparent;
	transition: all 0.5s ease-in-out;
	&:hover {
		background: ${({ theme }) => theme.bgLighter};
		transition: all 0.5s ease-in-out;
	}
`;

const Message = styled.div`
	position: absolute;
	top: -20px;
	right: 40px;
	width: 300px;
	height: max-content;
	padding: 24px;
	border-radius: 5px;
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.dropDown.hover};
	box-shadow: 0 0 3px 0 ${({ theme }) => theme.textSoft};
	white-space: pre-line;
	display: grid;
	text-align: center;
	z-index: 10;
`;

const SecondCheck = styled.div`
	margin-top: 20px;
	display: flex;
	justify-content: space-between;
`;

const Confirm = styled.button`
	text-transform: uppercase;
	padding: 10px 18px;
	font-size: 14px;
	font-weight: 600;
	border: none;
	background: #ff0000;
	border-radius: 3px;
	color: ${({ theme }) => theme.uploader};
	filter: brightness(93%);
	cursor: pointer;
	&:hover {
		filter: brightness(100%);
	}
`;

const Cancel = styled(Confirm)`
	background: #3ea6ff;
	color: ${({ theme }) => theme.uploader};
`;

const VideoWrapper = styled.div`
	flex: 1;
	width: 150px;
	display: flex;
	position: relative;
	mask-image: radial-gradient(circle at 50% 50%, #ffffffd0 0%, #ffffff95);
`;

const VideoFrame = styled.video`
	flex: 1;
	max-width: 150px;
	max-height: 100px;
	object-fit: scale-down;
	background-origin: 0 0;
`;

const PlayIcon = styled(PlayCircleFilledIcon)`
	position: absolute;
	inset: 0;
	margin: auto;
	width: 100%;
	height: 100%;
	opacity: 0.9;
`;

const VLink = styled.div`
	color: #3ea6ff;
`;

const CommentCard = ({ comment, userComments, setUserComments }) => {
	const [message, setMessage] = useState({ status: null, msg: null });
	const [secondCheck, setSecondCheck] = useState(false);
	const [video, setVideo] = useState(undefined);

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		const getCommentsVideoData = async () => {
			try {
				const videoRes = await axios.get(
					`http://localhost:8800/api/videos/find/${comment.videoId}`,
					{ cancelToken: cancelToken.token }
				);
				setVideo(videoRes.data);
			} catch (err) {
				//console.log(err);
			}
		};
		getCommentsVideoData();
		return () => {
			cancelToken.cancel();
		};
	}, [comment]);

	const deleteComment = async () => {
		if (!comment._id) return;
		setSecondCheck(false);
		const res = await DeleteComment(comment._id);
		setMessage({ status: res.status, msg: res.data });
		setTimeout(() => {
			setMessage({ status: null, msg: null });
			setUserComments(
				userComments.filter((otherComment) => otherComment._id !== comment._id)
			);
		}, 3000);
	};

	useEffect(() => {
		if (secondCheck) {
			setMessage({
				status: null,
				msg: "Are you sure?\nComment will be irreversibly deleted.",
			});
		} else {
			setMessage({ status: null, msg: null });
		}
	}, [secondCheck]);

	return (
		<Item>
			<Date>{comment.createdAt.split("T")[0]}</Date>
			<DeleteSection>
				{message.msg !== null && (
					<Message>
						{message.status !== 200 ? (
							<IonAlertCircled />
						) : (
							<DoneAllIcon sx={{ color: green.A700 }} />
						)}
						{message.msg}
						{secondCheck && (
							<SecondCheck>
								<Confirm onClick={deleteComment}>Delete</Confirm>
								<Cancel onClick={() => setSecondCheck(false)}>Cancel</Cancel>
							</SecondCheck>
						)}
					</Message>
				)}
				<DeleteButton>
					<IonIosCloseOutline
						cursor="pointer"
						onClick={() => setSecondCheck(!secondCheck)}
					/>
				</DeleteButton>
			</DeleteSection>
			<CommentBody>
				<Left>
					<Text>{comment.desc}</Text>
					<Text style={{ fontSize: 14 }}>
						Commented on&ensp;
						<Link to={`/video/${video?._id}`} replace>
							<VLink>{video?.title}</VLink>
						</Link>
					</Text>
				</Left>
				<Right>
					<Link to={`/video/${video?._id}`} replace>
						<VideoWrapper>
							<VideoFrame poster={video?.imgUrl} src="" />
							<PlayIcon />
						</VideoWrapper>
					</Link>
				</Right>
			</CommentBody>
		</Item>
	);
};

export default CommentCard;
