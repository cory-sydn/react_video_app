import { useState } from "react";
import styled from "styled-components";
import TableBody from "./TableBody";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

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

const VideosTable = ({ videos }) => {
	const [selected, setSelected] = useState(false);

	const handleSelectAll = () => {
		setSelected(!selected);
	};

	return (
		<Table>
			<Thead>
				<Tr>
					<Th style={{ height: 50 }} onClick={handleSelectAll}>
						{selected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
					</Th>
					<Th style={{ width: 310 }}>Video</Th>
					<Th>Date</Th>
					<Th>Views</Th>
					<Th>Comments</Th>
					<Th>Likes/ Dislikes</Th>
				</Tr>
			</Thead>
			<Tbody>
				{videos.map((video) => (
					<TableBody key={video._id} video={video} />
				))}
			</Tbody>
		</Table>
	);
};

export default VideosTable;
