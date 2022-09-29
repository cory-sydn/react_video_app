import React, { useEffect, useState } from 'react'
// import axios from "axios";
// import styled from "styled-components";
// import { useSelector } from "react-redux";
import TableBody from './TableBody';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {Table, Thead, Tbody, Tr, Th} from "./VideosTable"

const CommentsTable = ({videos}) => {
  //const [comments, setComments] = useState([]);
	const [selected, setSelected] = useState(false);

  const handleSelectAll = () => {
    setSelected(!selected) 
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th style={{height: 50}} onClick={handleSelectAll}>{selected ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon />}</Th>
          <Th style={{width: 300}} >Video</Th>
          <Th>Comment</Th>
          <Th>Date</Th>
          <Th>Replies</Th>
          <Th>Likes/ Dislikes</Th>
        </Tr>
      </Thead>
      <Tbody>
        {videos.map((video) => (
          <TableBody key={video._id} video={video}/>
        ))}
      </Tbody>
    </Table>
  )
}

export default CommentsTable