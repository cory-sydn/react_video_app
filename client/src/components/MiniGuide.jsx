import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import { useSelector } from "react-redux";

const Container = styled.section`
	position: fixed;
	bottom: 0;
	left: 0;
	width: 72px;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: calc(100vh - 56px);
	background: ${({ theme }) => theme.bgLighter};
	box-shadow: inset -1px 0 1px 0 #00000018;
	padding-top: 8px;
	z-index: 1;
	@media (max-width: 660px) {
		display: none;
		left: -9999px;
	}
`;

const Item = styled.div`
	display: grid;
	place-content: center center;
	width: 72px;
	height: 40px;
	&:hover {
		background: ${({ theme }) => theme.soft};
	}
`;

const MiniGuide = () => {
	const { currentUser } = useSelector((state) => state.user);

	return (
		<Container>
			<Link to="/">
				<Item>
					<HomeOutlinedIcon />
				</Item>
			</Link>
			<Link to="trends">
				<Item>
					<ExploreOutlinedIcon />
				</Item>
			</Link>
			<Link to="subscriptions">
				<Item>
					<SubscriptionsOutlinedIcon />
				</Item>
			</Link>
			<Link to={`channel/${currentUser?._id}/playlist`}>
				<Item>
					<VideoLibraryOutlinedIcon />
				</Item>
			</Link>
		</Container>
	);
};

export default MiniGuide;
