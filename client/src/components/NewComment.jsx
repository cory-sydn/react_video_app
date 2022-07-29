import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 3rem;
    position: relative;
`

const Avatar = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    margin-right: 16px;
    border-radius: 50%;
`
const InputArea = styled.div`
    margin-left: 56px;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
`
const Input = styled.input`
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-bottom: 1px solid #717171;
    padding: 5px 0;
    color: ${({theme}) => theme.text};
    place-content: "Add a comment";
    outline: none;
    background: ${({theme})=>theme.bg};
    animation: spread 2s ease-in-out both;
    &::placeholder{
        color: ${({theme})=>theme.textSoft};
    }
    &:focus {
        border-bottom: 2px solid ${({theme})=> theme.commentLine};
        transform: scale3d(0 1 1);
    }
`

const CommentHelper = styled.div`
    padding-top: 10px;
    width: 100%;
    line-height: 60px;
    width: 100%;
    justify-content: flex-end;
    display: flex;
`

const CancelButton = styled.button`
    border: none;
    background: transparent;
    color: #606060;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
`

const ConfirmButton = styled.button`
    margin-left: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 2px;
    background: ${({theme})=> theme.commentButton.bg};
    color: ${({theme})=> theme.commentButton.color};
`

const ActiveConfirmButton = styled.button`
    margin-left: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 2px;
    background:#3ea6ff;
    color: ${({theme})=>theme.bg};
`

const NewComment = () => {
    const [comment, setComment] = useState("")
    const [focus, setFocus] = useState(false)
    const [writing, setWriting] = useState(false)

    useEffect(()=> {
        if(comment.length > 0) {
            setWriting(true)
        } else if (comment.length === 0) {
            setWriting(false)
        }
    },[comment])

    return (
        <Container>
            <Avatar src="https://yt3.ggpht.com/ytc/AKedOLScdfOBQR25fX7dA6aKL6XxoooqdS9PxJ8jxxCHYQ=s48-c-k-c0x00ffffff-no-rj" ></Avatar>
            <InputArea>
                <Input 
                    placeholder="Add a comment..." 
                    onFocus={()=>setFocus(true)}
                    value={comment}
                    onChange={(e)=>setComment(e.target.value) } 
                    >
                </Input>
                {focus &&
                    <CommentHelper>
                        <CancelButton onClick={()=> setFocus(false)} >CANCEL</CancelButton>
                        {writing 
                            ? (<ActiveConfirmButton>COMMENT</ActiveConfirmButton>)
                            : (<ConfirmButton>COMMENT</ConfirmButton>)
                        }                            
                    </CommentHelper>
                }
            </InputArea>
        </Container>
    )
}

export default NewComment