import React, { useState } from "react";
import styled from "styled-components";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import Warning from "../../components/Warning";
import { useSelector } from "react-redux";

const Button = styled.button`
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.bg};
	border: none;
	outline: none;
	margin-inline: 0.75rem;
	cursor: pointer;
	display: flex;
	align-items: center;
	position: relative;
`;

const SaveBtn = () => {
	const [warn, setWarn] = useState(false);
	const { currentUser } = useSelector((state) => state.user);
  
  const handleWarn = (boolean) => {
		if (currentUser) return
		setWarn(boolean)
	}
	return (
		<Button
      onFocus={() => handleWarn(true)}
      onBlur={() => handleWarn(false)}
		>
			<PlaylistAddOutlinedIcon />
			{warn && (
				<Warning
					title={"Want to watch this again later?"}
					text={"add this video to a playlist."}
				/>
			)}
		</Button>
	);
};

export default SaveBtn;
