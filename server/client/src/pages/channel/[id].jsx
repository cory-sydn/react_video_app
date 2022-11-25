import axios from "axios";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Route, Routes, useParams, Link } from "react-router-dom";
import Subscription from "../video/Subscription";
import ChannelHome from "./ChannelHome";
import Playlist from "./Playlist";
import About from "./About";
import ChannelProfil from "../../utils/constants/ChannelProfil";
import { axiosInstance } from "../../apiConfig";

const Container = styled.div`
	margin-left: 72px;
	width: 100%;
	min-height: calc(100vh - 56px);
	display: flex;
	flex-direction: column;
	@media (max-width: 660px) {
		margin-left: 0;
	}
	background: ${({ theme }) => theme.bgDarker};
`;

const Header = styled.header`
	width: 100%;
	padding: 20px 40px 0;
	background: ${({ theme }) => theme.bg};
`;

const UserHeader = styled.header`
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
`;

const Stats = styled.div`
	padding: 15px 30px;
	height: 100%;
`;

const Title = styled.h1`
	display: flex;
	font-size: 24px;
	font-weight: 500;
	text-transform: capitalize;
`;

const ChannelInfo = styled.div`
	display: flex;
`;

const Text2 = styled.h4`
	text-align: left;
	margin-top: 5px;
	font-weight: 400;
	font-size: 14px;
	color: ${({ theme }) => theme.textSoft};
`;

const Menu = styled.div`
	display: flex;
	position: relative;
	color: ${({ theme }) => theme.textSoft};
`;

const Slider = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	border-bottom: 3px solid ${({ theme }) => theme.dropDown.active};
	transition: all 0.5s ease;
	-webkit-transition: all 0.5s ease;
`;

const Item = styled.div`
	height: 60px;
	display: flex;
	align-items: center;
	text-transform: uppercase;
	padding: 15px 25px;
	border-bottom: 3px solid ${({ theme }) => theme.dropDown.bg};
	color: ${({ theme }) => theme.textSoft};
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	&:hover {
		color: ${({ theme }) => theme.text};
	}
	&:focus {
		color: ${({ theme }) => theme.text};
		background: ${({ theme }) => theme.soft};
	}
`;

const Channel = () => {
	const [channel, setChannel] = useState(undefined);
	const channelId = useParams().id;
	const { currentUser } = useSelector((state) => state.user);
	const slider = useRef();
	const active = useRef();

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		slider.current.style.width = getComputedStyle(active.current).width;
		const getChannel = async () => {
			try {
				const channelRes = await axiosInstance.get(
					`/users/find/${channelId}`,
					{ cancelToken: cancelToken.token }
				);
				setChannel(channelRes.data);
				document.title = channelRes.data.name;
			} catch (err) {
				if (axios.isCancel(err)) return
				console.log(err);
			}
		};

		!currentUser
			? getChannel()
			: currentUser?._id === channelId
			? setChannel(currentUser)
			: getChannel();

		return () => {
			cancelToken.cancel();
		};
	}, [channelId, currentUser]);

	const handleSlider = (e) => {
		// selected menu item have accent color
		const items = document.querySelectorAll(".channel__menu-item");
		items.forEach((item) => {
			item.style.color = "inherit";
		});
		getComputedStyle(e.target).color === "rgb(170, 170, 170)"
			? (e.target.style.color = "#fff")
			: (e.target.style.color = "#000510");
		// handle slider position and width
		slider.current.style.left = e.target.offsetLeft + "px";
		slider.current.style.width = getComputedStyle(e.target).width;
	};

	return (
		<Container>
			<Header>
				<UserHeader>
					<ChannelInfo>
						{channel && <ChannelProfil channel={channel} />}
						<Stats>
							<Title>{channel?.name} </Title>
							<Text2>
								{channel?.subscribers > 0 ? channel.subscribers : "No"}
								{" subsribers"}{" "}
							</Text2>
						</Stats>
					</ChannelInfo>
					{currentUser?._id !== channelId && <Subscription channel={channel} />}
				</UserHeader>
				<Menu>
					<Link to="" >
						<Item
							className="channel__menu-item"
							onClick={handleSlider}
							ref={active}
						>
							Home
						</Item>
					</Link>
					<Link to="videos">
						<Item className="channel__menu-item" onClick={handleSlider}>
							Videos
						</Item>
					</Link>
					<Link to="playlist">
						<Item className="channel__menu-item" onClick={handleSlider}>
							playlist
						</Item>
					</Link>
					<Link to="">
						<Item className="channel__menu-item" onClick={handleSlider}>
							channels
						</Item>
					</Link>
					<Link to="about">
						<Item className="channel__menu-item" onClick={handleSlider}>
							about
						</Item>
					</Link>
					<Slider ref={slider} />
				</Menu>
			</Header>
			<Routes>
				<Route path="/" element={<ChannelHome />} />
				<Route path="videos" element={<ChannelHome />} />
				<Route path="about" element={<About channel={channel} />} />
				<Route path="playlist" element={<Playlist channel={channel} />} />
			</Routes>
		</Container>
	);
};

export default Channel;
