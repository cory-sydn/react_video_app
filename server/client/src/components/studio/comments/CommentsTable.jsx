import { useEffect, useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Table, Thead, Tbody, Tr, Th } from "../videos/VideosTable";
import CommentTableBody from "./CommentTableBody";
import SearchBox from "../search/SearchBox";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
	filterComment,
	selectAllComments,
} from "../../../redux/studioSlice";

export const Hr = styled.div`
	width: 100%;
	opacity: 0.4;
	border-bottom: 1px solid ${({ theme }) => theme.textSoft};
`;

const CommentsTable = () => {
	const [step, setStep] = useState(0);
	const {
		channelVideos,
		channelComments,
		selectedCommentIds,
		filteredCommentIds,
		searchGuide,
	} = useSelector((state) => state.studio);
	const options = ["Mentions", "Contains Questions"];
	const dispatch = useDispatch();

	const handleSelectAll = () => {
		if (channelComments?.length) {
			dispatch(selectAllComments());
		}
	};

	useEffect(() => {
		let ids = [];
		if (searchGuide?.length) {
			if (step > searchGuide?.length) {
				searchGuide?.map((obj, index) => {
					const backToTrackIds = ids;
					ids = [];
					channelComments?.filter((el) => {
						if (el?.desc?.toLocaleLowerCase().includes(obj.param)) {
							if (index === 0) {
								return ids.push(el._id);
							} else {
								if (backToTrackIds.includes(el._id)) {
									return ids.push(el._id);
								}
							}
						}
						return false;
					});
					return obj;
				});
			} else {
				// parameter added. filter deeper.
				channelComments?.filter((el) => {
					if (el?.desc?.toLocaleLowerCase()?.includes(searchGuide?.at(-1).param)) {
						if (filteredCommentIds?.includes(el._id)) return ids.push(el._id);
					}
					return false;
				});
			}
			setStep(searchGuide?.length);
			dispatch(filterComment(ids));
		} else {
			setStep(0);
			channelComments?.map((el) => (ids = [...ids, el?._id]));
			dispatch(filterComment(ids));
		}
	}, [dispatch, channelComments, searchGuide]);  // eslint-disable-next-line

	return (
		<>
			<SearchBox options={options} />
			<Hr />
			<Table>
				<Thead>
					<Tr>
						<Th style={{ height: 50 }} onClick={handleSelectAll}>
							{selectedCommentIds?.length > 0 &&
							selectedCommentIds?.length === filteredCommentIds?.length ? (
								<CheckBoxIcon style={{ cursor: "pointer" }} />
							) : (
								<CheckBoxOutlineBlankIcon style={{ cursor: "pointer" }} />
							)}
						</Th>
						<Th>Comment</Th>
						<Th>Date</Th>
						<Th>Replies</Th>
						<Th>Likes/ Dislikes</Th>
						<Th style={{ width: 310 }}>Video</Th>
					</Tr>
				</Thead>
				<Tbody>
					{channelComments?.length > 0 &&
						channelVideos?.map((video) => (
							<CommentTableBody
								key={video?._id}
								video={video}
								comments={channelComments?.filter(
									(el) => el?.videoId === video?._id
								)}
							/>
						))}
				</Tbody>
			</Table>
		</>
	);
};

export default CommentsTable;
