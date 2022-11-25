import React, { useState } from "react";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { useDispatch, useSelector } from "react-redux";
import { dislike } from "../../redux/videoSlice";
import Warning from "../../components/Warning";
import GlowingButton, {
	BtnContainer,
} from "../../utils/constants/GlowingButton";
import { axiosInstance } from "../../apiConfig";

const DislikeBtn = () => {
	const [warn, setWarn] = useState(false);
	const { currentUser } = useSelector((state) => state.user);
	const { currentVideo } = useSelector((state) => state.video);
	const dispatch = useDispatch();

	const handleDislike = async () => {
		if (!currentUser) return;
		try {
			await axiosInstance.put(
				`/videos/dislike/${currentVideo._id}`,
				{},
				{ withCredentials: true }
			);
			dispatch(dislike(currentUser._id));
		} catch (err) {
			console.log(err);
		}
	};

	const handleWarn = (boolean) => {
		if (currentUser) return;
		setWarn(boolean);
	};

	return (
		<BtnContainer
			onFocus={() => handleWarn(true)}
			onBlur={() => handleWarn(false)}
			onClick={handleDislike}
		>
			<GlowingButton
				icon={
					currentVideo?.dislikes?.includes(currentUser?._id) ? (
						<ThumbDownAltIcon />
					) : (
						<ThumbDownOffAltOutlinedIcon />
					)
				}
			/>
			DISLIKE
			{warn && (
				<Warning
					title={"Don't like this video?"}
					text={"make your opinion count."}
				/>
			)}
		</BtnContainer>
	);
};

export default DislikeBtn;
