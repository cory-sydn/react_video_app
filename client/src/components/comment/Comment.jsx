import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import TeenyiconsMoreVerticalOutline from "../../icons/TeenyiconsMoreVerticalOutline.jsx";
import { ThemeProvider } from "@mui/material";
import { format } from "timeago.js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { dislike, like } from "../../redux/commentSlice";
import NewComment from "./NewComment";
import { muiTheme } from "../../utils/muiTheme";
import Options from "./Options.jsx";
import EditComment from "./EditComment";
import { axiosInstance } from "../../apiConfig.js";
import ProfileImg from "../../utils/constants/ProfileImg.jsx";

const Container = styled.div`
	display: flex;
	margin-top: ${(props) => (props.isChild ? "-16px" : 0)};
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const AvatarWrapper = styled.div`
	width: ${(props) => (props.isChild ? "40px" : "56px")};
	height: 100%;
	padding-right: 16px;
`;

const Details = styled.div`
	display: flex;
	align-items: flex-start;
	color: ${({ theme }) => theme.text};
`;

const NameLine = styled.div`
	font-size: 13px;
	font-weight: 500;
	text-align: left;
	margin-bottom: 6px;
	text-transform: capitalize;
`;

const Name = styled.span`
	background:  ${(props) => (props.isChannelMessage ? "#595959cc": "transparent")};
	padding:  ${(props) => (props.isChannelMessage ? "4px 6px": 0)};
	border-radius: 15px;
`;

const Date = styled.span`
	font-size: 12px;
	font-weight: 400;
	color: ${({ theme }) => theme.textSoft};
	margin-left: 5px;
`;

const Text = styled.p`
	white-space: pre-line;
	display: flex;
	flex-wrap: wrap;
	text-align: left;
	font-size: 14px;
	line-height: 20px;
	letter-spacing: 0.2px;
`;

const Reactions = styled.div`
	font-size: 12px;
	display: flex;
	margin: 10px 0 24px -11px;
`;

const Button = styled.div`
	margin-inline: 0.75rem;
	cursor: pointer;
	display: flex;
	align-items: center;
`;

const DisplayRepliesBtn = styled(Button)`
	margin-top: -12px;
	margin-left: -6px;
	margin-bottom: 24px;
	font-size: 14px;
	font-weight: 500;
	width: max-content;
	color: #3ea6ff;
	z-index: 5;
`;

const Btn = styled.div`
	padding-right: 10px;
	display: flex;
	align-items: center;
`;

const Span = styled.span`
	width: 100%;
	font-weight: 500;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
	width: max-content;
	margin-top: 1px;
	color: ${({ theme }) => theme.textSoft};
	font-size: 14px;
	font-weight: 500;
	text-align: left;
	cursor: pointer;
	letter-spacing: -0.5px;
	line-height: 15px;
	&:hover {
		border-bottom: 1px solid ${({ theme }) => theme.textSoft};
		line-height: 14px;
	}
`;

const Left = styled.div`
	display: grid;
	width: calc(100% - 40px);
`;

const Right = styled.div`
	display: flex;
`;

const ThreeDotsContainer = styled.div`
	width: 40px;
	height: 40px;
	display: grid;
	place-content: center;
	border-radius: 50%;
	border: none;
	background: transparent;
	z-index: 5;
	cursor: pointer;
	animation: ${(props) => (props.glow ? "glow 0.5s ease-in-out;" : "")};
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

const Darkness = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	width: calc(100vw - 8px);
	height: 100vh;
	background: ${(props) => (props.secondCheck ? "#0006" : "transparent")};
	animation: ${(props) =>
		props.secondCheck ? "darkness 0.4s ease-in-out" : "light 0.4s ease-in-out"};
	@keyframes darkness {
		0% {
			background: #0002;
		}
		100% {
			background: #0006;
		}
	}
	@keyframes light {
		0% {
			background: #0006;
		}
		100% {
			background: #0001;
		}
	}
	overflow: hidden;
	z-index: 25;
`;

const Comment = ({ channelId, comment, currentUser, isChild }) => {
	const [commentAuthor, setCommenAuthor] = useState({});
	const [expand, setExpand] = useState(false);
	const [reply, setReply] = useState(false);
	const [openReplies, setOpenReplies] = useState(false);
	const [threeDots, setThreeDots] = useState(false);
	const [replies, setReplies] = useState([]);
	const [glow, setGlow] = useState(false);
	const [openOptions, setOpenOptions] = useState(false);
	const [secondCheck, setSecondCheck] = useState(false);
	const [darkEffect, setDarkEffect] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const optionRef = useRef();
	const buttonRef = useRef();
	const warnRef = useRef();

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		const fetchUser = async () => {
			try {
				const res = await axiosInstance.get(
					`/users/find/${comment.userId}`,
					{ cancelToken: cancelToken.token }
				);
				setCommenAuthor(res.data);
			} catch (err) {
				if (axios.isCancel(err)) return
				console.log(err);
			}
		};
		fetchUser();
		return () => {
			cancelToken.cancel();
		};
	}, [comment.userId]);

	const handleLike = async () => {
		if (!currentUser) return navigate("/signin");
		try {
			await axiosInstance.put(
				`/comments/like/${comment._id}`,
				{},
				{ withCredentials: true }
			);
			dispatch(like({comment: comment, userId: currentUser._id }));
		} catch (err) {
			console.log(err);
		}
	};

	const handleDislike = async () => {
		if (!currentUser) return navigate("/signin");
		try {
			await axiosInstance.put(
				`/comments/dislike/${comment._id}`,
				{},
				{ withCredentials: true }
			);
			dispatch(dislike({comment: comment, userId: currentUser._id }));
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (!openReplies) return;
		const cancelToken = axios.CancelToken.source();
		const fetchReplies = async () => {
			try {
				const res = await axiosInstance.get(`/comments/replies/${comment._id}`, {
					cancelToken: cancelToken.token,
				});
				setReplies(res.data.reverse());
			} catch (err) {
				if (axios.isCancel(err)) return
				//console.log(err);
			}
		};
		fetchReplies();
		return () => {
			cancelToken.cancel();
		};
	}, [openReplies, comment._id]);

	const handleToggleOptions = () => {
		setOpenOptions(!openOptions);
		setGlow(true);
		setTimeout(() => {
			setGlow(false);
		}, 500);
	};

	const handleFocus = useCallback((e) => {
		if (buttonRef.current && buttonRef.current.contains(e.target)) return;
		if (warnRef.current && warnRef.current.contains(e.target)) return;
		if (optionRef.current && !optionRef.current.contains(e.target)) {
			setOpenOptions(false);
			setSecondCheck(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", handleFocus);
		return () => {
			document.removeEventListener("mousedown", handleFocus);
		};
	}, [optionRef, buttonRef, handleFocus, warnRef]);

	useEffect(() => {
		editOpen && setOpenOptions(false);
	}, [editOpen]);

	useEffect(() => {
		if (!darkEffect && secondCheck) {
			setDarkEffect(true);
		} else if (darkEffect && !secondCheck) {
			setTimeout(() => {
				setDarkEffect(false);
			}, 400);
		}
	}, [secondCheck, darkEffect]);

	return (
		<Container isChild={isChild}>
			<AvatarWrapper isChild={isChild}>
				<Link to={`/channel/${commentAuthor?._id}`}>
					<ProfileImg
						size={isChild ? 24 : 40}
						img={commentAuthor?.img}
						name={commentAuthor?.name}
					/>
				</Link>
			</AvatarWrapper>
			{editOpen ? (
				<EditComment oldComment={comment} setEditOpen={setEditOpen} />
			) : (
				<Wrapper>
					<Details
						onMouseEnter={() => setThreeDots(true)}
						onMouseLeave={() => setThreeDots(false)}
					>
						<Left>
							<NameLine>
								<Name
									isChannelMessage={channelId === commentAuthor._id ? true : false}
								>
									{commentAuthor.name}
								</Name>
								<Date>{format(comment?.createdAt)} </Date>
							</NameLine>
							<Text>
								{comment?.desc?.length < 356
									? comment?.desc
									: expand === false
									? `${(comment?.desc).slice(0, 355)}...`
									: comment?.desc}
							</Text>
							{comment?.desc?.length > 356 && (
								<More onClick={() => setExpand(!expand)}>
									{expand === true ? "Show less" : "Read more"}
								</More>
							)}
							<Reactions>
								<ThemeProvider theme={muiTheme}>
									<Button>
										{comment?.likes?.includes(currentUser?._id) ? (
											<ThumbUpAltIcon fontSize="small" onClick={handleLike} />
										) : (
											<ThumbUpOutlinedIcon
												fontSize="small"
												onClick={handleLike}
											/>
										)}
										<Span>
											&nbsp;{comment?.likes?.length > 0 && comment.likes.length}
										</Span>
									</Button>
									<Button>
										{comment?.dislikes?.includes(currentUser?._id) ? (
											<ThumbDownAltIcon
												fontSize="small"
												onClick={handleDislike}
											/>
										) : (
											<ThumbDownOffAltOutlinedIcon
												fontSize="small"
												onClick={handleDislike}
											/>
										)}
									</Button>
									<Button onClick={() => setReply(true)}>
										<Span>REPLY</Span>
									</Button>
								</ThemeProvider>
							</Reactions>
						</Left>
						<Right>
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
							{openOptions && (
								<Options
									optionRef={optionRef}
									comment={comment}
									setEditOpen={setEditOpen}
									warnRef={warnRef}
									secondCheck={secondCheck}
									setSecondCheck={setSecondCheck}
									setOpenOptions={setOpenOptions}
								/>
							)}
						</Right>
					</Details>
					{reply && (
						<NewComment
							reply={reply}
							setReply={setReply}
							parent={comment}
							currentUser={currentUser}
						/>
					)}
					{comment?.childs.length > 0 && (
						<DisplayRepliesBtn onClick={() => setOpenReplies(!openReplies)}>
							<Btn>
								{openReplies ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
								{comment?.childs.length} &ensp;
								{comment?.childs.length > 1 ? "REPLIES" : "REPLY"}
							</Btn>
						</DisplayRepliesBtn>
					)}
					{openReplies &&
						replies.map((reply) => (
							<Comment
								key={reply._id}
								comment={reply}
								isChild={true}
								currentUser={currentUser}
							/>
						))}
				</Wrapper>
			)}
			{darkEffect && <Darkness secondCheck={secondCheck} />}
		</Container>
	);
};

export default Comment;
