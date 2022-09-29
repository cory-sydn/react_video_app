import React, { useEffect, useState } from 'react'
import axios from "axios";
import styled from "styled-components";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Link, useNavigate } from "react-router-dom";

const Tr = styled.tr`
  position: relative;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    opacity: 0.3;
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.textSoft};
  }
  &:hover{
    background: ${({ theme }) => theme.subscription.bg};
  }
`;

const Td = styled.td`
  font-size: 12px;
  padding-left: 10px;
`;

const VideoTd= styled(Td)`
 position: relative;
  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0.3;
    height: 100%;
    border-right: 1px solid ${({ theme }) => theme.textSoft};
  }
  &:hover{
    &::before{
      content: "Edit your video";
      color: white;
      text-shadow: 1px 1px 5px #000000;
      padding: 3px 5px;
      border-radius: 5px;
      background: #00000077;
      position: absolute;
      left: 30px;
      top: 30px;
    }
  }
`;

const VideoWrapper= styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  padding-right: 3px;
`;

const VideoFrame = styled.video`
  flex: 1;
  max-width: 160px;
  padding-right: 10px;
  max-height: 100px;
	object-fit: scale-down;
  background-origin: 0 0;
`;

const TableBody = ({video}) => {
  const [comments, setComments] = useState([]);
	const [selected, setSelected] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		const fetchComments = async () => {
			try {
				const res = await axios.get(`/comments/${video._id}`)
        setComments(res.data)?.reverse()
			} catch (err) {
				console.log(err);
			}
		};
    fetchComments()
		return () => {
			cancelToken.cancel();
		};
	
  }, [video])

  const handleSelect = () => {
    setSelected(!selected)
  }
  const openEditing = () => {
    navigate(`${video._id}`)
  }

  return (
    <Tr  >
      <Td onClick={handleSelect} style={{width: 50, height: 100 }}>{selected ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon />}</Td>
      <VideoTd style={{width: 300, borderRight: "#aaad"}} onClick={openEditing}>
        <VideoWrapper>
          <VideoFrame
          poster={video?.imgUrl}
          src=""
          />
          {video?.title}
        </VideoWrapper>
      </VideoTd>      
      <Td onClick={openEditing} >{video?.createdAt.split("T")[0] }</Td>
      <Td onClick={openEditing}>{video?.views} </Td>
      <Td onClick={openEditing}>{comments?.length} </Td>
      <Td onClick={openEditing}>{`${video?.likes?.length}` / `${video?.dislikes?.length > 0 ? video?.dislikes?.length : 1 }` }</Td>      
    </Tr>
  )
}

export default TableBody