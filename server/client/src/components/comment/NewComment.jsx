import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { commentFailed, commentSuccessful } from "../../redux/commentSlice";
import { axiosInstance } from "../../apiConfig";
import ProfileImg from "../../utils/constants/ProfileImg";

const Container = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: ${(props) =>
		props.reply ? "40px 100%" : "56px 100%"};
	margin-bottom: ${(props) => (props.reply ? "0px" : "3rem")};
`;

const AvatarWrapper = styled.div`
	width: ${(props) => (props.reply ? "40px" : "56px")};
	height: ${(props) => (props.reply ? "24px" : "40px")};
	display: grid;
	place-items: left;
`;

const InputArea = styled.form`
	width: ${(props) =>
		props.reply ? "calc(100% - 72px)" : "calc(100% - 56px)"};
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	position: relative;
`;

export const Input = styled.textarea`
	width: 100%;
	overflow: auto;
	resize: none;
	min-height: 25px;
	line-height: 20px;
	font-size: 14px;
	font-family: Arial, Helvetica, sans-serif;
	font-weight: 500;
	outline: none;
	border: none;
	border-bottom: 1px solid #717171;
	padding: 0;
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.bg};
	&::placeholder {
		color: ${({ theme }) => theme.textSoft};
	}
	&::-webkit-scrollbar {
		background: transparent;
	}
`;

export const Hr = styled.hr`
	width: 50%;
	position: absolute;
	bottom: 47px;
	left: 50%;
	border: transparent;
	border-bottom: 2px solid ${({ theme }) => theme.commentLine};
	animation: draw 0.3s both;

	@keyframes draw {
		0% {
			width: 0;
		}
		100% {
			width: 50%;
		}
	}
`;

export const LeftHr = styled.hr`
	width: calc(50% + 1px);
	position: absolute;
	bottom: 47px;
	left: 50%;
	border: transparent;
	border-bottom: 2px solid ${({ theme }) => theme.commentLine};
	animation: slide 0.3s both;

	@keyframes slide {
		0% {
			width: 0;
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-100% + 1px));
		}
	}
`;

export const CommentButtons = styled.div`
	padding-top: 10px;
	width: 100%;
	line-height: 60px;
	width: 100%;
	justify-content: flex-end;
	display: flex;
`;

export const CancelButton = styled.button`
	border: none;
	background: transparent;
	color: #606060;
	padding: 10px 16px;
	font-size: 14px;
	font-weight: 500;
	border-radius: 2px;
	cursor: pointer;
`;

export const ConfirmButton = styled(CancelButton)`
	margin-left: 8px;
	font-weight: 600;
	background: ${({ theme }) => theme.commentButton.bg};
	color: ${({ theme }) => theme.commentButton.color};
	cursor: auto;
`;

export const ActiveConfirmButton = styled(ConfirmButton)`
	background: #3ea6ff;
	color: ${({ theme }) => theme.bg};
	cursor: pointer;
`;

const NewComment = ({ currentUser, videoId, reply, setReply, parent }) => {
	const [comment, setComment] = useState("");
	const [focus, setFocus] = useState({ ready: false, line: false });
	const [writing, setWriting] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		let isCancelled = false;
		if (!isCancelled) {
			if (comment.length > 0) {
				setWriting(true);
			} else if (comment.length === 0) {
				setWriting(false);
			}
		}
		return () => {
			isCancelled = true;
		};
	}, [comment]);

	const handleFocus = () => {
		if (!currentUser) return navigate("/signin");
		setFocus({ ready: true, line: true });
	};

	const handleInput = (e) => {
		setComment(e.target.value);
		e.target.style.removeProperty("height");
		e.target.style.height = e.target.scrollHeight + 2 + "px";
	};

	const handleCancelBtn = (e) => {
		e.preventDefault();
		setFocus({ ready: false, line: false });
		setComment("");
		if (reply) return setReply(!reply);
	};

	const handleSendComment = async () => {
		try {
			if (reply) {
				const replyResponse = await axiosInstance.post(
					"/comments",
					{
						videoId: parent.videoId,
						parent: parent?._id,
						desc: comment.trim(),
					},
					{ withCredentials: true }
				);
				dispatch(commentSuccessful(replyResponse.data));
				const updateParent = await axiosInstance.put(
					`/comments/reply/${parent._id}`,
					{
						childId: replyResponse.data._id,
					},
					{ withCredentials: true }
				);
				dispatch(commentSuccessful(updateParent.data));
				setReply(!reply);
			} else {
				const res = await axiosInstance.post(
					"/comments",
					{
						videoId,
						desc: comment.trim(),
					},
					{ withCredentials: true }
				);
				dispatch(commentSuccessful(res.data));
			}
			setFocus({ ready: false, line: false });
			setWriting(false);
			setComment("");
			document.querySelector(".commentInput").style.height = 26 + "px";
		} catch (err) {
			dispatch(commentFailed(err.response.data.message));
		}
	};

	return (
		<Container reply={reply}>
			<AvatarWrapper reply={reply}>
				<ProfileImg
					size={reply ? 24 : 40}
					img={currentUser?.img}
					name={currentUser?.name}
				/>
			</AvatarWrapper>
			<InputArea onSubmit={(e) => e.preventDefault()} reply={reply}>
				<Input
					className="commentInput"
					id="comment"
					rows="1"
					placeholder="Add a comment..."
					type="text"
					onFocus={handleFocus}
					onBlur={() => setFocus((prev) => ({ ...prev, line: false }))}
					value={comment}
					name="comment"
					onChange={handleInput}
					autoFocus={reply ? true : false}
				/>
				{focus.line && (
					<>
						<LeftHr /> <Hr />
					</>
				)}
				{focus.ready && (
					<CommentButtons>
						<CancelButton onClick={handleCancelBtn}>CANCEL</CancelButton>
						{writing ? (
							<ActiveConfirmButton
								onClick={handleSendComment}
								htmlFor="comment"
							>
								{reply ? "REPLY" : "COMMENT"}
							</ActiveConfirmButton>
						) : (
							<ConfirmButton>{reply ? "REPLY" : "COMMENT"}</ConfirmButton>
						)}
					</CommentButtons>
				)}
			</InputArea>
		</Container>
	);
};

export default NewComment;
