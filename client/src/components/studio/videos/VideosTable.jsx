import { useEffect, useState } from "react";
import styled from "styled-components";
import VideoTableBody from "./VideoTableBody";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SearchBox from "../search/SearchBox";
import { Hr } from "../../../pages/studio/Studio";
import { useDispatch, useSelector } from "react-redux";
import {
	filterVideos,
	selectAllVideos,
} from "../../../redux/studioSlice";

export const Table = styled.table`
	width: 100%;
	text-align: left;
	border-spacing: 5px 10px;
	border-collapse: collapse;
`;

export const Thead = styled.thead`
	font-size: 12px;
	position: relative;
	&::after {
		content: "";
		position: absolute;
		right: 0;
		bottom: 0;
		opacity: 0.3;
		width: 100%;
		border-bottom: 1px solid ${({ theme }) => theme.textSoft};
	}
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr``;

export const Th = styled.th`
	padding-left: 10px;
	width: max-content;
`;

const VideosTable = () => {
	const [step, setStep] = useState(0);
	const [searchFrom, setSearchFrom] = useState("");
	const [options, setOptions] = useState([]);
	const { channelVideos, selectedVideoIds, filteredVideoIds, searchGuide } = useSelector(
		(state) => state.studio
	);
	const dispatch = useDispatch();

	const handleSelectAll = () => {
		dispatch(selectAllVideos());
	};

	useEffect(() => {
		let ids = [];
		if (searchGuide?.length) {
			if (step > searchGuide?.length) {
				// "Search param removed" so start filtering from first parameter..
				searchGuide?.map((obj, index) => {
					const key = { Title: "title", Description: "desc" }[obj?.key];
					setOptions(["Title", "Description"].filter(el => el !== obj?.key));
					const backToTrackIds = ids;
					ids = [];
					channelVideos?.filter((el) => {
						if (el[key]?.toLocaleLowerCase().includes(obj?.param)) {
							if (index === 0) {
								return ids.push(el._id);
							} else {
								// filter first paramater's results and so on
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
				// "new param added" keep filtering deeper
				setOptions((prev) => (prev = prev.filter((el) => el !== searchFrom)));
				const key = { Title: "title", Description: "desc" }[searchGuide?.at(-1)?.key];
				channelVideos?.filter((el) => {
					if (el[key]?.toLocaleLowerCase().includes(searchGuide?.at(-1)?.param)) {
						if (filteredVideoIds.includes(el._id)) return ids.push(el._id);
					}
					return false;
				});
			}
			dispatch(filterVideos(ids));
			setStep(searchGuide?.length);
		} else {
			setStep(0);
			setOptions(["Title", "Description"]);
			channelVideos?.map((el) => (ids = [...ids, el._id]));
			dispatch(filterVideos(ids));
		}
	}, [searchGuide, channelVideos, searchFrom, setOptions, dispatch]); // eslint-disable-next-line

	return (
		<>
			<SearchBox
				options={options}
				setSearchFrom={setSearchFrom}
				searchFrom={searchFrom}
			/>
			<Hr />
			<Table>
				<Thead>
					<Tr>
						<Th style={{ height: 50 }} onClick={handleSelectAll}>
							{selectedVideoIds?.length > 0 &&
							selectedVideoIds?.length === filteredVideoIds?.length ? (
								<CheckBoxIcon style={{ cursor: "pointer" }} />
							) : (
								<CheckBoxOutlineBlankIcon style={{ cursor: "pointer" }} />
							)}
						</Th>
						<Th style={{ width: 310 }}>Video</Th>
						<Th>Date</Th>
						<Th>Views</Th>
						<Th>Comments</Th>
						<Th>Likes/ Dislikes</Th>
					</Tr>
				</Thead>
				<Tbody>
					{channelVideos?.map(
						(video) =>
							new Set(filteredVideoIds)?.has(video._id) && (
								<VideoTableBody key={video._id} video={video} />
							)
					)}
				</Tbody>
			</Table>
		</>
	);
};

export default VideosTable;
