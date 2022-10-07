import React from 'react'
import styled from 'styled-components';

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
	max-width: 160px;
	padding-right: 10px;
	max-height: 100px;
	object-fit: scale-down;
	background-origin: 0 0;
`;

const VideoTd = ({img, title}) => {
  return (
    <VideoTableData
      style={{ width: 300, borderRight: "#aaad" }}
    >
      <VideoWrapper>
        <VideoFrame poster={img} src="" />
        {title}
      </VideoWrapper>
    </VideoTableData>
  )
}

export default VideoTd