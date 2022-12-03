import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import VideoTd from "../VideoTd";
import { useDispatch, useSelector } from "react-redux";
import { selectVideo } from "../../../redux/studioSlice";
import formatDate from "../../../utils/functions/formatDate";

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

const VideoTableBody = ({ video }) => {
	const {channelComments} = useSelector((state) => state.studio)
	const [commentCount, setCommentCount] = useState(0);
	const { selectedVideoIds } = useSelector((state) => state.studio)
	const dispatch = useDispatch()
	const navigate = useNavigate();

	useEffect(() => {
    if(!channelComments.length) return
		setCommentCount((channelComments?.filter((el) => (el?.videoId === video?._id))?.length))
	}, [video, channelComments]);

	const handleSelect = () => {
		dispatch(selectVideo(video?._id));
	};

	const openEditing = () => {
		navigate(`${video?._id}`);
	};

	return (
		<Tr>
			<Td onClick={handleSelect} style={{ width: 50, height: 100 }}>
				{selectedVideoIds?.includes(video?._id) ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
			</Td>
			<Td onClick={openEditing}>
				<VideoTd img={video?.imgUrl} title={video?.title} videoId={video?._id} type="video" />
			</Td>
			<Td onClick={openEditing}>{ formatDate(video?.createdAt.split("T")[0])}</Td>
			<Td onClick={openEditing}>{video?.views} </Td>
			<Td onClick={openEditing}>{commentCount} </Td>
			<Td onClick={openEditing}>
				{`${video?.likes?.length}` /
					`${video?.dislikes?.length > 0 ? video?.dislikes?.length : 1}`}
			</Td>
		</Tr>
	);
};

export default VideoTableBody;
