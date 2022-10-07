import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
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
		document.title = "YouTube";
		try {
			const fecthVideos = async () => {
				const res = await axios.get(
					`http://localhost:8800/api/videos/query/search${location.search}`
				);
				setVideos(res.data);
			};
			fecthVideos();
		} catch (err) {
			//console.log(err);
		}
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
