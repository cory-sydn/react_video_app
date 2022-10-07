import React, { useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Route, Routes, useParams, useNavigate, Link } from "react-router-dom";
import VideosTable from "./videos/VideosTable";
import CommentsTable from "./comments/CommentsTable";
import Edit from "./Edit";
import ChannelProfil from "../../utils/constants/ChannelProfil";

const Container = styled.main`
	margin-left: 72px;
	margin-bottom: 50px;
	width: 100%;
	min-height: calc(100vh - 56px);
	@media (max-width: 660px) {
		margin-left: 0;
	} ;
`;

const Header = styled.header`
	display: flex;
	width: 100%;
	padding: 20px 40px 0;
	background: ${({ theme }) => theme.bg};
`;

const ChannelInfo = styled.div`
	display: flex;
`;

const Title = styled.h3`
	padding-left: 20px;
	padding-top: 20px;
`;

const Menu = styled.div`
	display: flex;
	position: relative;
`;

export const Hr = styled.div`
	width: 100%;
	opacity: 0.4;
	border-bottom: 1px solid ${({ theme }) => theme.textSoft};
`;

const MenuItem = styled.h5`
	padding: 18px 20px;
	margin: 0 20px;
`;

const Slider = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	border-bottom: 3px solid #3ea6ff;
	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
	border-bottom-left-radius: 3px;
	border-bottom-right-radius: 3px;
	transition: all 0.5s ease;
	-webkit-transition: all 0.5s ease;
`;

const Studio = () => {
	const [videos, setVideos] = useState([]);
	const [comments, setComments] = useState([]);
	const [openEdit, setOpenEdit] = useState(false);
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const urlObj = useParams();
  const videoMenuRef = useRef()
  const commentMenuRef = useRef()
  const sliderRef = useRef()

	useEffect(() => {
		if (!currentUser) return navigate("/");
		if (currentUser?._id !== urlObj.id) navigate("/");
	}, [currentUser, urlObj.id, navigate]);

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		const getChannelVideos = async () => {
			try {
				const videosRes = await axios.get(
					`http://localhost:8800/api/videos/${currentUser?._id}`,
					{ cancelToken: cancelToken.token }
				);
				setVideos(videosRes?.data);
			} catch (err) {
				console.log(err);
			}
		};
		getChannelVideos();
		return () => {
			cancelToken.cancel();
		};
	}, [currentUser]);

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		const fetchComments = async () => {
			try {
				const commentsArray = []
				videos.map( async(video) => {
					const res = await axios.get(`/comments/${video._id}`);
					commentsArray.push(res.data)
				})
				setComments(commentsArray.reverse());
			} catch (err) {
				console.log(err);
			}
		};
		fetchComments();
		return () => {
			cancelToken.cancel();
		};
	}, [videos]);

	useEffect(() => {
		const editId = Object.entries(urlObj)[1][1];
		const editVideo = videos.find((video) => video._id === editId);
		setOpenEdit(editVideo);

		if(!editId) {
			sliderRef.current.style.left = videoMenuRef.current.offsetLeft + "px";
			sliderRef.current.style.width = videoMenuRef.current.clientWidth + "px";
		} else if (editId === "comments") {
			sliderRef.current.style.left = commentMenuRef.current.offsetLeft + "px";
			sliderRef.current.style.width = commentMenuRef.current.clientWidth + "px";
		}
	}, [urlObj, videos, videoMenuRef,	commentMenuRef,	sliderRef]);

	return (
		<Container>
			<Header>
				<ChannelInfo>
					{currentUser && <ChannelProfil channel={currentUser} />}
				</ChannelInfo>
				<Title>{currentUser?.name + " "} channel content</Title>
			</Header>
			<Menu>
				<Link to="">
					<MenuItem  ref={videoMenuRef}>Videos</MenuItem>
				</Link>
				<Link to="comments">
					<MenuItem ref={commentMenuRef}>Comments</MenuItem>
				</Link>
				<Slider ref={sliderRef} />
			</Menu>
			<Hr />
			<Routes>
				<Route path="/">
					<Route index element={<VideosTable videos={videos} comments={comments} />} />
					<Route path="comments" element={<CommentsTable videos={videos} comments={comments} />} />
				</Route>
			</Routes>
			{openEdit && <Edit openEdit={openEdit} setOpenEdit={setOpenEdit} />}
		</Container>
	);
};

export default Studio;
