import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import MdiLightMessageText from '../../icons/MdiLightMessageText.jsx'
import CommentCard from "./CommentCard.jsx";

const Container = styled.div`
	margin: 40px 30px;
	height: 100%;
	min-width: 300px;
	display: flex;
	justify-content: flex-end;
`;

const Stats = styled.div`
	width: 36%;
	float: right;
	text-align: left;
`;

const Title = styled.h2`
	font-weight: 400;
	margin-top: 20px;
`;

const Text1 = styled.h4`
	place-self: center;
	font-weight: 400;
	margin-top: 10px;
`;

const CommentsLink = styled(Text1)`
  width: max-content;
  padding-left: 20px;
	color: #3ea6ff;
  position: relative;
	cursor: pointer;
`;

const Hr = styled.hr`
	margin: 12px 0;
	height: 1px;
	border: none;
	border-bottom: 1px solid ${({ theme }) => theme.soft};
`;

const Display = styled.div`
	padding: 20px 50px 20px 50px;
	width: 100%;
	display: flex;
	flex-direction: column;
	@media (max-width:1120px){
		padding: 20px 40px 20px 30px;
  };
	@media (max-width:950px){
		padding: 20px 30px 20px 0;
  };
`;

const CommentIcon = styled(MdiLightMessageText)`
  position: absolute;
  top: 1px;
  left: 0;
`;

const About = ({ channel }) => {
	const [open, setOpen] = useState(false);
	const [userComments, setUserComments] = useState(undefined);
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		const getUserComments = async () => {
			try {
				const commentRes = await axios.get(
					`http://localhost:8800/api/comments/user/${currentUser?._id}`,
					{ withCredentials: true },
					{ cancelToken: cancelToken.token }
				);
				setUserComments(commentRes.data.reverse());
			} catch (err) {
				console.log(err);
			}
		};
		currentUser?._id === channel?._id && getUserComments();
		return () => {
			cancelToken.cancel();
		};
	}, [currentUser, channel]);

  return (
		<Container>
			<Display>
				{open && (
						<>
							<Title style={{ marginBottom:20}} >Your YouTube Comments</Title>
							{userComments.map((comment) => (
								<CommentCard key={comment._id} comment={comment} userComments={userComments} setUserComments={setUserComments} />
							))}
						</>
					)}
			</Display>
			<Stats>
				<Title>Stats</Title>
				<Hr />
				<Text1>{channel?.name}</Text1>
				<Text1>Joined {channel?.createdAt?.split("T")[0]}</Text1>
				{currentUser?._id === channel?._id && ( userComments?.length > 0 &&
					<CommentsLink onClick={() => setOpen(!open)}>
						<CommentIcon />{userComments.length + " commets"}
					</CommentsLink>
				)}
				<Hr />
			</Stats>
		</Container>
	);
};

export default About;
