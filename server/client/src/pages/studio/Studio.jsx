import { Route, Routes, useParams, useNavigate, Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { axiosInstance } from "../../apiConfig";
import styled from "styled-components";
import VideosTable from "../../components/studio/videos/VideosTable";
import CommentsTable from "../../components/studio/comments/CommentsTable";
import Edit from "../../components/studio/Edit";
import ChannelProfil from "../../utils/constants/ChannelProfil";
import { getVideos } from "./api";
import { fetchVideosSuccessful, fetchCommentsSuccessful, fetchStart } from "../../redux/studioSlice";

const Container = styled.main`
	margin-left: 72px;
	padding-bottom: 50px;
	width: 100%;
	min-height: calc(100vh - 56px);
	@media (max-width: 660px) {
		margin-left: 0;
	};
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
	padding: 0 2px;
	margin: 18px 38px 15px 38px;
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
	const [openEdit, setOpenEdit] = useState(false);
	const {channelVideos} = useSelector((state) => state.studio)
	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const urlObj = useParams();
  const videoMenuRef = useRef()
  const commentMenuRef = useRef()
  const sliderRef = useRef()

	useEffect(() => {
		//rule out unauthorized visiters
		if (!currentUser) return navigate("/");
		if (currentUser?._id !== urlObj.id) navigate("/");
	}, [currentUser, urlObj.id, navigate]);

	useEffect(() => {
			const cancelToken = axios.CancelToken.source();
			dispatch(fetchStart());
			async function fetch () {
				const videosRes = await getVideos( currentUser?._id, cancelToken)
				dispatch(fetchVideosSuccessful(videosRes));
				if (videosRes) {
					async function fetchComments (videosRes) {
						videosRes.map( async(video) => {
							try {
								const res = await axiosInstance.get(`/comments/${video._id}`, 
									{ cancelToken: cancelToken.token }
								);	
								dispatch(fetchCommentsSuccessful(res.data));
							} catch (err) {
								if (axios.isCancel(err)) return console.log("cancelled!");
							}
						})
					}
					fetchComments(videosRes)
				}
			}
			fetch()
			return () => {
				cancelToken.cancel();
			};	
	}, [currentUser, dispatch]);

	useEffect(() => {
		const editId = Object.entries(urlObj)[1][1];
		const editVideo = channelVideos?.find((video) => video._id === editId);
		setOpenEdit(editVideo);

		if(!editId) {
			sliderRef.current.style.left = videoMenuRef.current.offsetLeft + "px";
			sliderRef.current.style.width = videoMenuRef.current.clientWidth + "px";
		} else if (editId === "comments") {
			sliderRef.current.style.left = commentMenuRef.current.offsetLeft + "px";
			sliderRef.current.style.width = commentMenuRef.current.clientWidth + "px";
		}
	}, [urlObj, channelVideos, videoMenuRef,	commentMenuRef,	sliderRef]);

	return (
		<>
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
						<Route index element={<VideosTable />} />
						<Route path="comments" element={<CommentsTable />} />
					</Route>
				</Routes>
			</Container>
			{openEdit && <Edit openEdit={openEdit} setOpenEdit={setOpenEdit} />}
		</>
	);
};

export default Studio;
