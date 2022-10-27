import { useSelector } from "react-redux";
import { Tr } from "../videos/VideoTableBody";
import CommentRow from "./CommentRow";

const CommentTableBody = ({ video, comments }) => {
	const { filteredCommentIds } = useSelector(state => state.studio)

	return (
		<>
			{comments?.map(
				(comment) => new Set(filteredCommentIds)?.has(comment?._id) &&
					<Tr key={comment?._id}>
						<CommentRow
							comment={comment}
							video={video}
						/>
					</Tr>				
			)}
		</>
	);
};

export default CommentTableBody;
