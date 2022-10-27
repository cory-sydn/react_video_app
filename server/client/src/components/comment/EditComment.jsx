import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { axiosInstance } from "../../apiConfig";
import { commentFailed, editComment } from "../../redux/commentSlice";
import {
	Input,
	Hr,
	LeftHr,
	CommentButtons,
	CancelButton,
	ConfirmButton,
	ActiveConfirmButton,
} from "./NewComment";

const Container = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 100%;
	margin-bottom: 0;
`;

const InputArea = styled.form`
	width: 100%;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	position: relative;
`;

const NewComment = ({ oldComment, setEditOpen }) => {
	const [comment, setComment] = useState(oldComment.desc || "");
	const [focus, setFocus] = useState({ ready: false, line: false });
	const [writing, setWriting] = useState(false);
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

	const expandTextarea = (e) => {
		if (e.target.style.height === e.target.scrollHeight + 2 + "px") return;
		e.target.style.removeProperty("height");
		e.target.style.height = e.target.scrollHeight + 2 + "px";
	}

	const handleFocus = (e) => {
		setFocus({ ready: true, line: true });
		expandTextarea(e)
	};

	const handleInput = (e) => {
		setComment(e.target.value);
		expandTextarea(e)
	};

	const handleCancelBtn = (e) => {
		e.preventDefault();
		setEditOpen(false);
		setFocus({ ready: false, line: false });
		setComment("");
	};

	const handleSendComment = async () => {
		try {
			const res = await axiosInstance.put(
				`/comments/${oldComment._id}`,
				{
					desc: comment,
				},
				{ withCredentials: true }
			);
			dispatch(editComment(res.data));
			setEditOpen(false);
			setFocus({ ready: false, line: false });
			setWriting(false);
			setComment("");
			document.querySelector(".commentInput").style.height = 26 + "px";
		} catch (err) {
			dispatch(commentFailed(err.response.data.message));
		}
	};

	return (
		<Container>
			<InputArea onSubmit={(e) => e.preventDefault()}>
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
					autoFocus
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
								SAVE
							</ActiveConfirmButton>
						) : (
							<ConfirmButton>SAVE</ConfirmButton>
						)}
					</CommentButtons>
				)}
			</InputArea>
		</Container>
	);
};

export default NewComment;
