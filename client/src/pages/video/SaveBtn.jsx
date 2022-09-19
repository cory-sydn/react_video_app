import React, { useState } from "react";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import Warning from "../../components/Warning";
import { useSelector } from "react-redux";
import GlowingButton, { BtnContainer } from "../../utils/GlowingButton";

const SaveBtn = () => {
	const [warn, setWarn] = useState(false);
	const { currentUser } = useSelector((state) => state.user);
  
  const handleWarn = (boolean) => {
		if (currentUser) return
		setWarn(boolean)
	}

	return (
		<BtnContainer
			onFocus={() => handleWarn(true)}
			onBlur={() => handleWarn(false)}
		>
			<GlowingButton icon={<PlaylistAddOutlinedIcon/>} />
			SAVE
				{warn && (
					<Warning
						title={"Want to watch this again later?"}
						text={"add this video to a playlist."}
					/>
				)}
		</BtnContainer>
	);
};

export default SaveBtn;
