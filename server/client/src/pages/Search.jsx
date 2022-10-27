import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { axiosInstance } from "../apiConfig";
import Card from "../components/videoCard/Card";
import { GridContainer } from "./home/Home";

const GridContainerSearch = styled(GridContainer)`
	margin: 20px 30px 50px 102px;
  @media (max-width:660px){
    margin: 20px 30px 50px 30px;
  };
`

const Search = () => {
	const [videos, setVideos] = useState([]);
	const location = useLocation();

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		document.title = "YouTube";
		try {
			const fecthVideos = async () => {
				const res = await axiosInstance.get(
					`/videos/query/search${location.search}`
				);
				setVideos(res.data);
			};
			fecthVideos();
		} catch (err) {
			if (axios.isCancel(err)) return console.log("cancelled!");
			console.log(err);
		}
		return () => {
			cancelToken.cancel();
		};
	}, [location]);

	return (
		<GridContainerSearch>
			{videos.map((video) => (
				<Card key={video._id} video={video} />
			))}
		</GridContainerSearch>
	);
};

export default Search;
