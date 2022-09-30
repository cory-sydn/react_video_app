import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import Comment from "./Comment";
import NewComment from "./NewComment";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const Container = styled.div``;

const CommentsHeader = styled.div`
	width: 400px;
	font-weight: 400;
	display: flex;
	margin-bottom: 1.5rem;
`;

const CommentCount = styled.div`
	margin-right: 40px;
`;

const SortButton = styled.div`
	display: flex;
	align-items: center;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
`;

const Comments = () => {
	const [comments, setComments] = useState([]);
	const { currentUser } = useSelector((state) => state.user);
	const { currentComment } = useSelector((state) => state.comment);
	const videoId = useParams().id;

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		const fetchComments = async () => {
			try {
				const res = await axios.get(`/comments/${videoId}`, {
					cancelToken: cancelToken.token,
				});
				setComments(res.data.reverse());
			} catch (err) {
				if (axios.isCancel(err)) return console.log("cancelled!");
				console.log(err);
			}
		};
		fetchComments();
		return () => {
			cancelToken.cancel();
		};
	}, [videoId, currentComment]);

	return (
		<Container>
			<CommentsHeader>
				<CommentCount>{comments.length} Comments</CommentCount>
				<SortButton>
					<SortOutlinedIcon />
					&nbsp; SORT BY
				</SortButton>
			</CommentsHeader>
			<NewComment currentUser={currentUser} videoId={videoId} />
			{comments.map(
				(comment) =>
					// if comment have a parent that means it is a reply comment thus we should skip it
					!comment.parent && (
						<Comment
							key={comment._id}
							comment={comment}
							currentUser={currentUser}
						/>
					)
			)}
		</Container>
	);
};

export default Comments;
