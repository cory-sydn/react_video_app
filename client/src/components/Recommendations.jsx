import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./videoCard/Card";

const Container = styled.div`
	width: 32%;
	height: max-content;
	min-width: 350px;
	display: grid;
	@media (max-width: 1105px) {
		width: 100%;
	} ;
`;

const Recommendations = ({ tags }) => {
	const [videos, setVideos] = useState([]);

	useEffect(() => {
		if (!tags) return;
		const cancelToken = axios.CancelToken.source();
		const fetchVideos = async () => {
			const res = await axios.get(
				`http://localhost:8800/api/videos/recommend/tags?tags=${tags}`,
				{ cancelToken: cancelToken.token }
			);
			setVideos(res.data);
		};
		fetchVideos();
		return () => {
			cancelToken.cancel();
		};
	}, [tags]);

	return (
		<Container>
			{videos.map((video) => (
				<Card key={video._id} type="sm" s video={video} />
			))}
		</Container>
	);
};

export default Recommendations;
