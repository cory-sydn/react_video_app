import React from 'react'
import styled from 'styled-components'
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import Comment from './Comment';
import NewComment from './NewComment';

const Container = styled.div`
    
`

const CommentsHeader = styled.div`
    width: 400px;
    font-weight: 400;
    display: flex;
    margin-bottom: 1.5rem;
`

const CommentCount = styled.div`
    margin-right: 40px;
`

const SortButton = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
`

const Comments = () => {
  return (
    <Container>
        <CommentsHeader>
            <CommentCount>451 Comments</CommentCount>
            <SortButton>
                <SortOutlinedIcon  />&nbsp; SORT BY
            </SortButton>
        </CommentsHeader>
        <NewComment/>
        <Comment/>
        <Comment/>
        <Comment/>
        <Comment/>
        <Comment/>
        <Comment/>
        <Comment/>
    </Container>
  )
}

export default Comments