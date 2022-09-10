import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import camera from "../../img/camera";
import Card from "../../components/Card";

const Container = styled.main``;

const Main = styled.section`
	margin: 40px 30px 20px 20px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
`;

const Wrapper = styled.section`
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
	row-gap: 2em;
	column-gap: 2em;
	place-content: flex-start;
	@media (min-width: 1050px) {
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	} ;
`;

const DecorativeImg = styled.img`
	place-self: center;
	width: 260px;
	height: 260px;
	object-fit: cover;
	object-position: 0, 0;
	transition: all 0.5s ease-in-out;
	filter: sepia(0);
	&:hover {
		transition: all 0.5s ease-in-out;
		filter: sepia(50%);
	}
`;

const Text1 = styled.h2`
	place-self: center;
	font-weight: 400;
	margin-top: 20px;
`;

const Text2 = styled(Text1)`
	font-size: 14px;
	color: ${({ theme }) => theme.textSoft};
`;

const Title = styled.h3`
	font-weight: 500;
	margin-bottom: 20px;
`;

const ChannelHome = () => {
	const [videos, setVideos] = useState([]);
	const channelId = useParams().id;
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		const getChannelVideos = async () => {
			try {
				const videosRes = await axios.get(
					`http://localhost:8800/api/videos/${channelId}`,
					{ cancelToken: cancelToken.token }
				);
				setVideos(videosRes.data);
			} catch (err) {
				console.log(err);
			}
		};
		getChannelVideos();
		return () => {
			cancelToken.cancel();
		};
	}, [channelId]);

	return (
		<Container>
			{!videos.length && (
				<>
					{currentUser?._id === channelId ? (
						<>
							<DecorativeImg src={camera} />
							<Text1>Upload a video to get started</Text1>
							<Text2>
								Start sharing your story and connecting with viewers. Videos you
								upload will{"\n"} show up here.
							</Text2>
						</>
					) : (
						<Text2>This channel doesn't have any content</Text2>
					)}
				</>
			)}
			<Main>
			{videos.length > 0 && (<Title>Uploads</Title>)}
				<Wrapper>
					{videos.length > 0 &&
						videos.map((video) => <Card video={video} key={video._id} />)}
				</Wrapper>
			</Main>
		</Container>
	);
};

export default ChannelHome;
