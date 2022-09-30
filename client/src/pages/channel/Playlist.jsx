import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "../../components/videoCard/Card";
import { useSelector } from "react-redux";

const Container = styled.div`
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

const Title = styled.h3`
	font-weight: 500;
	margin-bottom: 20px;
`;

const Playlist = ({ channel }) => {
	const [videos, setVideos] = useState([]);
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		const getLikedVideos = async () => {
			try {
				const videosRes = await axios.get(
					`http://localhost:8800/api/videos/liked/${currentUser._id}`,
					{ withCredentials: true },
					{ cancelToken: cancelToken.token }
				);
				setVideos(videosRes.data);
			} catch (err) {
				console.log(err);
			}
		};
		currentUser?._id === channel?._id && getLikedVideos();
		return () => {
			cancelToken.cancel();
		};
	}, [currentUser?._id, channel?._id]);

	return (
		<Container>
			{videos.length > 0 && <Title>Liked Videos</Title>}
			<Wrapper>
				{videos.length > 0 &&
					videos.map((video) => <Card video={video} key={video._id} />)}
			</Wrapper>
		</Container>
	);
};

export default Playlist;
