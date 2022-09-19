import React from "react";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import GlowingButton, { BtnContainer } from "../../utils/GlowingButton";

const ShareBtn = () => {

	return (
		<BtnContainer>
			<GlowingButton icon={<ReplyOutlinedIcon/>} />
			SHARE				
		</BtnContainer>
	);
};

export default ShareBtn;
