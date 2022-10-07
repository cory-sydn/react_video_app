import React, { useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Table, Thead, Tbody, Tr, Th } from "../videos/VideosTable";
import CommentTBody from "./CommentTBody";
import { Hr } from "../Studio";
import SearchBox from "../SearchBox";

const CommentsTable = ({ videos, comments }) => {
	const [selected, setSelected] = useState(false);
	const [search, setSearch] = useState("")

	const handleSelectAll = () => {
		setSelected(!selected);
	};

	return (
		<>
		<SearchBox search={ search } setSearch={ setSearch } />
		<Hr />
		<Table>
			<Thead>
				<Tr>
					<Th style={{ height: 50 }} onClick={handleSelectAll}>
						{selected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
					</Th>
					<Th style={{ width: 310 }}>Video</Th>
					<Th>Comment</Th>
					<Th>Date</Th>
					<Th>Replies</Th>
					<Th>Likes/ Dislikes</Th>
				</Tr>
			</Thead>
			<Tbody>
				{videos.map((video) => (
					<CommentTBody key={video._id} video={video} comments={comments} search={ search } />
				))}
			</Tbody>
		</Table>
		</>
		
	);
};

export default CommentsTable;
