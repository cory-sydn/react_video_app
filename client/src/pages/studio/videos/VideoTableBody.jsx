import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useNavigate } from "react-router-dom";
import VideoTd from "../VideoTd";

export const Tr = styled.tr`
	position: relative;
	cursor: pointer;
	&::after {
		content: "";
		position: absolute;
		right: 0;
		bottom: 0;
		opacity: 0.3;
		width: 100%;
		border-bottom: 1px solid ${({ theme }) => theme.textSoft};
	}
	&:hover {
		background: ${({ theme }) => theme.subscription.bg};
	}
`;

export const Td = styled.td`
	font-size: 12px;
	padding-left: 10px;
`;

const VideoTableBody = ({ video, comments }) => {
	const [vComments, setVComments] = useState([]);
	const [selected, setSelected] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
    if(!comments) return
		setVComments(comments.flat().filter((el) => (el.videoId === video._id)))
	}, [video, comments]);

	const handleSelect = () => {
		setSelected(!selected);
	};
	const openEditing = () => {
		navigate(`${video._id}`);
	};

	return (
		<Tr>
			<Td onClick={handleSelect} style={{ width: 50, height: 100 }}>
				{selected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
			</Td>
			<Td onClick={openEditing}>
				<VideoTd img={video?.imgUrl} title={video?.title} />
			</Td>
			<Td onClick={openEditing}>{video?.createdAt.split("T")[0]}</Td>
			<Td onClick={openEditing}>{video?.views} </Td>
			<Td onClick={openEditing}>{vComments?.length} </Td>
			<Td onClick={openEditing}>
				{`${video?.likes?.length}` /
					`${video?.dislikes?.length > 0 ? video?.dislikes?.length : 1}`}
			</Td>
		</Tr>
	);
};

export default VideoTableBody;
