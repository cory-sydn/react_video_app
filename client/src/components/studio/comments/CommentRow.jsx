import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { axiosInstance } from "../../../apiConfig";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Skeleton } from "@mui/material";
import { Td } from "../videos/VideoTableBody";
import VideoTd from "../VideoTd";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ProfileImg from "../../../utils/constants/ProfileImg";
import { selectComment } from "../../../redux/studioSlice";
import formatDate from "../../../utils/functions/formatDate";

const ProfileLink = styled(Link)`
	display: grid;
	place-content: center;
	position: relative;
	width: 32px;
	height: 32px;
	background: transparent;
	border-radius: 50%;
	&:hover {
		&::before {
			content: "Go to the channel page";
			color: white;
			width: max-content;
			text-shadow: 1px 1px 5px #000000;
			padding: 3px 5px;
			border-radius: 5px;
			background: #000000d1;
			position: absolute;
			left: -40px;
			top: 39px;
		}
	}
`;

const CommentRow = ({ comment, video }) => {
	const [commentAuthor, setCommenAuthor] = useState({});
	const [loading, setLoading] = useState(true);
	const [icon, setIcon] = useState(false);
	const { selectedCommentIds } = useSelector((state) => state.studio);
	const dispatch = useDispatch();

	const handleSelect = () => {
		dispatch(selectComment(comment?._id));
	};

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		setLoading(true);
		const fetchUser = async () => {
			try {
				const res = await axiosInstance.get(`/users/find/${comment?.userId}`, {
					cancelToken: cancelToken.token,
				});
				setCommenAuthor(res.data);
			} catch (err) {
				if (axios.isCancel(err)) return
				console.log(err);
			}
		};
		fetchUser();
		setLoading(false);
		return () => {
			cancelToken.cancel();
		};
	}, [comment?.userId]);

	useEffect(() => {
		commentAuthor?.img && setLoading(false);
	}, [commentAuthor]);

	return (
		<>
			<Td onClick={handleSelect} style={{ width: 50, height: 100 }}>
				{selectedCommentIds?.includes(comment._id) ? (
					<CheckBoxIcon />
				) : (
					<CheckBoxOutlineBlankIcon />
				)}
			</Td>
			<Td
				style={{
					display: "flex",
					alignItems: "center",
					justifyItems: "center",
					paddingBlock: 10,
					minHeight: 100,
				}}
			>
				<ProfileLink
					to={`/channel/${commentAuthor?._id}`}
					target="_blank"
					rel="noopener noreferrer"
					onMouseEnter={() => setIcon(true)}
					onMouseLeave={() => setIcon(false)}
				>
					{loading ? (
						<Skeleton
							variant="circular"
							width={32}
							height={32}
							sx={{ background: "#313131" }}
						/>
					) : (
						<>
							<ProfileImg
								size={32}
								img={commentAuthor?.img}
								name={commentAuthor?.name}
							/>
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
						</>
					)}
				</ProfileLink>
				<div style={{ marginLeft: 12 }}>{comment?.desc} </div>
			</Td>
			<Td>{ formatDate(comment?.createdAt?.split("T")[0])}</Td>
			<Td>{comment?.childs?.length} </Td>
			<Td>
				{`${comment?.likes?.length}` /
					`${comment?.dislikes?.length > 0 ? comment?.dislikes?.length : 1}`}
			</Td>
			<Td>
				<VideoTd
					img={video?.imgUrl}
					title={video?.title}
					videoId={video?._id}
					type="comment"
				/>
			</Td>
		</>
	);
};

export default CommentRow;
