import React, { useState } from "react";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { like } from "../../redux/videoSlice";
import Warning from "../../components/Warning";
import GlowingButton, {
	BtnContainer,
} from "../../utils/constants/GlowingButton";

const LikeBtn = () => {
	const [warn, setWarn] = useState(false);
	const { currentUser } = useSelector((state) => state.user);
	const { currentVideo } = useSelector((state) => state.video);
	const dispatch = useDispatch();

	const handleLike = async () => {
		if (!currentUser) return;
		try {
			await axios.put(
				`http://localhost:8800/api/videos/like/${currentVideo?._id}`,
				{},
				{ withCredentials: true }
			);
			dispatch(like(currentUser._id));
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
			onClick={handleLike}
		>
			<GlowingButton
				icon={
					currentVideo?.likes?.includes(currentUser?._id) ? (
						<ThumbUpAltIcon />
					) : (
						<ThumbUpOutlinedIcon />
					)
				}
			/>
			{currentVideo?.likes?.length > 0 ? currentVideo?.likes?.length : "LIKE"}{" "}
			{warn && (
				<Warning title={"Like this video?"} text={"make your opinion count."} />
			)}
		</BtnContainer>
	);
};

export default LikeBtn;
