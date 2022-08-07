import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";

const Container = styled.div`
	width: 100%;
	display: flex;
	flex-direction: ${(props) => (props.type === "sm" ? "row" : "column")};
	align-items: flex-start;
	justify-content: flex-start;
	margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "36px")};
`;

const VideoLink = styled(Link)`
	width: 100%;
	cursor: pointer;
`;

const Img = styled.img`
	width: ${(props) => (props.type === "sm" ? "178px" : "100%")};
	height: ${(props) => (props.type === "sm" ? "103px" : "100%")};
	object-fit: scale-down;
`;

const Details = styled.div`
	display: flex;
	margin-top: ${(props) => props.type !== "sm" && "12px"};
	font-size: 14px;
`;

const ChannelImg = styled.img`
	display: ${(props) => (props.type === "sm" ? "none" : "flex")};
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: #606060;
	object-fit: cover;
`;

const Texts = styled.div`
	margin-left: ${(props) => (props.type === "sm" ? "5px" : "14px")};
	height: ${(props) => (props.type === "sm" ? "103px" : "100%")};
	text-align: left;
`;

const Title = styled.h4`
	margin-top: 0;
	margin-bottom: ${(props) => (props.type === "sm" ? "5px" : "18px")};
	line-height: ${(props) => (props.type === "sm" ? "18px" : "20px")};
`;

const ChannelName = styled.h3`
	margin-bottom: 4px;
	margin-top: ${(props) => (props.type === "sm" ? 0 : "12px")};
	font-size: 12px;
	color: ${({ theme }) => theme.textSoft};
`;

const Info = styled.span`
	font-size: 12px;
	color: ${({ theme }) => theme.textSoft};
`;

const BlankImg = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-content: center;
  color: white;
  background: #0a413c;
  border: transparent;
  cursor: pointer;
  &:focus {
    border  : 1px solid #2c7ef3;
  }
`

const Card = ({ type, video }) => {
	const [channel, setChannel] = useState([]);
console.log(video);
	useEffect(() => {
		try {
			const fetchChannel = async () => {
				const res = await axios.get(
					"http://localhost:8800/api" + `/users/find/${video.userId}`
				);
				setChannel(res.data);
			};
			fetchChannel();
		} catch (err) {
			console.error(err);
		}
	}, [video.userId]);
	return (
		<Container type={type}>
			<VideoLink to={`/video/${video._id}`}>
				<Img type={type} src={video.imgUrl} />
			</VideoLink>
			<Details type={type}>
				<ChannelImg src={channel.imgUrl} alt=""/>
				{/* {channel.imgUrl === undefined 
					? (<BlankImg>{(channel?.name[0]).toUpperCase()}</BlankImg>)
					: (<ChannelImg src={channel.imgUrl} alt=""/>)
				} */}
				<Texts type={type}>
					<VideoLink to={`/video/${video._id}`}>
						<Title type={type}>{video.title} </Title>
					</VideoLink>
					<ChannelName type={type}> {channel.name} </ChannelName>
					<Info>
						{" "}
						{video.views} &bull; {format(video.createdAt)}{" "}
					</Info>
				</Texts>
			</Details>
		</Container>
	);
};

export default Card;
