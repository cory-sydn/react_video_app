import React, { useEffect, useState } from 'react';
import {Tr, Td } from "../videos/VideoTableBody"
import VideoTd from '../VideoTd';
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const CommentTBody = ({video, comments, search}) => {
  const [vComments, setVComments] = useState([]);
  const [selected, setSelected] = useState(false);

	const handleSelect = () => {
		setSelected(!selected);
	};

  useEffect(()=> {
    if(!comments) return
    setVComments(comments.flat().filter((comment) => (comment.videoId === video._id)))
  }, [comments, video])

  return (
    <>
      {vComments && vComments.filter((el) =>
        (el.desc.toLowerCase().match(search.toLowerCase()))).map((comment) => (
          <Tr key={comment._id} >
            <Td onClick={handleSelect} style={{ width: 50, height: 100 }}>
              {selected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
            </Td>
            <Td>
              <VideoTd img={video?.imgUrl} title={video?.title} />
            </Td>
            <Td >{comment.desc} </Td>
            <Td >{comment.createdAt.split("T")[0]}</Td>
            <Td >{comment?.childs?.length} </Td>
            <Td >
              {`${comment.likes.length}` /
                `${comment.dislikes.length > 0 ? comment?.dislikes?.length : 1}`}
            </Td>
          </Tr>
      ))}
    </>
  )
}

export default CommentTBody