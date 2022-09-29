import React from 'react'
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Route, Routes, useParams, useNavigate, Link } from "react-router-dom";
import VideosTable from './VideosTable';
import CommentsTable from './CommentsTable';
import Edit from './Edit';
import ChannelProfil from '../../utils/constants/ChannelProfil';

const Container = styled.main`
	margin-left: 72px;
	width: 100%;
	min-height: calc(100vh - 56px);
	@media (max-width:660px){
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
`;

const Hr = styled.div`
  width: 100%;
  opacity: 0.4;
 	border-bottom: 1px solid ${({ theme }) => theme.textSoft};
`;

const MenuItem = styled.h5`
  padding: 20px 40px;
`;

const Studio = () => {
  const [videos, setVideos] = useState([])
	const [openEdit, setOpenEdit] = useState(false)
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate()
	const urlObj = useParams()

	useEffect(()=>{
		if (!currentUser) return navigate("/")
		if (currentUser?._id !== urlObj.id ) navigate("/")
	}, [currentUser, urlObj.id, navigate])

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		const getChannelVideos = async () => {
			try {
				const videosRes = await axios.get(
					`http://localhost:8800/api/videos/${currentUser?._id}`,
					{ cancelToken: cancelToken.token }
				);
				console.log("RENDERFFETCHINg");
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

	useEffect(()=> {
		const editId = Object.entries(urlObj)[1][1]
		const editVideo = videos.find((video) => video._id === editId)
		setOpenEdit(editVideo)
	}, [urlObj, videos])

  return (
    <Container>
      <Header>
        <ChannelInfo>
          {currentUser && (<ChannelProfil channel={currentUser} />)}
        </ChannelInfo>
        <Title >{currentUser?.name + " "}  channel content</Title>
      </Header>
      <Menu>
        <Link to="" >
					<MenuItem>Videos</MenuItem>
				</Link>
        <Link to="comments" >
					<MenuItem>Comments</MenuItem>
				</Link>
      </Menu>
			<Hr />
			<Routes>
				<Route path='/'>
					<Route index element={<VideosTable videos={videos} />}/>
					<Route path='comments' element={<CommentsTable videos={videos} />}/>
				</Route>
			</Routes>
			{openEdit && <Edit openEdit={openEdit} setOpenEdit={setOpenEdit}/>}
    </Container>
  )
}

export default Studio