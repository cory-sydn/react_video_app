import { useState } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export const VideoTableData = styled.div`
	position: relative;
	&::after {
		content: "";
		position: absolute;
		right: 0;
		top: -7.92px;
		opacity: 0.3;
		height: calc(100% + 15.84px);
		border-right: 1px solid ${({ theme }) => theme.textSoft};
	}
	&:hover {
		&::before {
			content: "Edit your video";
			color: white;
			display: ${(props) => (props.type === "video" ? "flex" : "none")};
			text-shadow: 1px 1px 5px #000000;
			padding: 3px 5px;
			border-radius: 5px;
			background: #00000077;
			position: absolute;
			left: 30px;
			top: 30px;
		}
	}
`;

export const VideoWrapper = styled.div`
	flex: 1;
	width: 100%;
	display: flex;
	padding-right: 3px;
`;

export const VideoFrame = styled.video`
	flex: 1;
	max-width: 150px;
	margin-right: 10px;
	max-height: 100px;
	object-fit: scale-down;
	background-origin: 0 0;
	box-shadow: 0 0 6px 1px #0006;
`;

const VideoLink = styled(Link)`
	display: grid;
	place-content: center;
	position: relative;
	width: 150px;
	height: 100%;
	background: transparent;
	&:hover {
		&::before {
			content: "Go to the video";
			color: white;
			text-shadow: 1px 1px 5px #000000;
			padding: 3px 5px;
			border-radius: 5px;
			background: #000000d1;
			position: absolute;
			left: 30px;
			bottom: 5px;
		}
	}
`;

const VideoTd = ({img, title, videoId, type}) => {
	const [icon, setIcon] = useState(false);
	
  return (
    <VideoTableData
      style={{ width: 300, borderRight: "#aaad" }}
			type={type}
    >
      <VideoWrapper>
        <VideoLink
					to={`/video/${videoId}`}
					target="_blank"
					rel="noopener noreferrer"
					onMouseEnter={() => setIcon(true)}
					onMouseLeave={() => setIcon(false)}
				>
					<VideoFrame poster={img} src="" />
					{icon && (
						<OpenInNewIcon
							sx={{
								fontSize: 25,
								color: "#3ea5ff",
								position: "absolute",
								inset: 0,
								margin: "auto",
							}}
						/>
					)}
				</VideoLink>
        {title}
      </VideoWrapper>
    </VideoTableData>
  )
}

export default VideoTd