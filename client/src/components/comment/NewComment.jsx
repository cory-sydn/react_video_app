import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { commentFailed, commentSuccessful } from '../../redux/commentSlice'
import unknown from "../../img/unnamed.jpg"

const Container = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: ${(props) => (props.reply ? "40px 100%" : "56px 100%")};
    margin-bottom:  ${(props) => (props.reply ? "0px" : "3rem")};
`
const AvatarWrapper = styled.div`
    width: ${(props) => (props.reply ? "40px" : "56px")};
    height: 100%;
    display: grid;
    place-items: left;
`
const Avatar = styled.img`
    min-width: ${(props) => (props.reply ? "24px" : "40px")};;
    height: ${(props) => (props.reply ? "24px" : "40px")};;
    border-radius: 50%;
`

const InputArea = styled.form`
    width: ${(props) => (props.reply ? "calc(100% - 40px)" : "calc(100% - 56px)")};
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    position: relative;
`

const Input = styled.textarea`
    width: 100%;
    overflow: auto;
    resize: none;
    min-height: 25px;
    line-height: 20px;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 500;
    outline: none;
    border: none;
    border-bottom: 1px solid #717171;
    padding: 0;
    color: ${({theme}) => theme.text};
    background: ${({theme})=>theme.bg};
    &::placeholder{
        color: ${({theme})=>theme.textSoft};
    }
    &::-webkit-scrollbar {
        background: transparent;
    }
`

const Hr = styled.hr`
    width: 50%;
    position: absolute;
    bottom: 47px;
    left: 50%;
    border: transparent;
    border-bottom: 2px solid ${({theme})=> theme.commentLine};
    animation: draw 0.3s both;

    @keyframes draw {
        0%{
            width: 0;
        }
        100% {
            width: 50%;
        }
    }
`
const LeftHr = styled.hr`
    width: calc( 50% + 1px );
    position: absolute;
    bottom: 47px;
    left: 50%;
    border: transparent;
    border-bottom: 2px solid ${({theme})=> theme.commentLine};
    animation: slide 0.3s both;

    @keyframes slide {
        0%{
            width: 0;
            transform: translateX(0);
        }
        100% {            
            transform: translateX( calc( -100% + 1px ));
        }
    }
`

const CommentButtons = styled.div`
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
    cursor: pointer;
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
    cursor: pointer;
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

const NewComment = ({currentUser, videoId, reply, setReply, parent}) => {
    const [comment, setComment] = useState("")
    const [focus, setFocus] = useState({ready: false, line: false})
    const [writing, setWriting] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(()=> {
        let isCancelled = false
        if (!isCancelled) {
            if(comment.length > 0) {
                setWriting(true)
            } else if (comment.length === 0) {
                setWriting(false)
            }
        }
        return () => {
            isCancelled  = true
        }
    },[comment])
   
    const handleFocus = () => {
        if (!currentUser) return navigate("/signin")       
        setFocus({ready: true, line: true})
    }

    const handleInput = (e) => {
        setComment(e.target.value);
        console.log(e.target.value,  e.target.scrollHeight);        
        e.target.style.removeProperty("height");
        e.target.style.height = e.target.scrollHeight + 2 + "px";
    }

    const handleCancelBtn = (e) => {
        e.preventDefault()
        setFocus({ready: false, line: false})
        setComment("")
        if(reply) return setReply(!reply)
    }

    const handleSendComment = async() => {        
        try {
            if (reply) {
                const replyResponse = await axios.post("http://localhost:8800/api/comments", {
                    videoId,
                    parent,
                    desc: comment,
                },{withCredentials: true,})
                console.log(replyResponse);
                dispatch(commentSuccessful(replyResponse.data))
                const updateParent = await axios.put(`http://localhost:8800/api/comments/reply/${parent}`, {
                    childId: replyResponse.data._id
                }, {withCredentials: true,})
                dispatch(commentSuccessful(updateParent.data))
                setReply(!reply)
            } else {
                const res = await axios.post("http://localhost:8800/api/comments", {
                    videoId,
                    desc: comment,
                },{withCredentials: true,})
                dispatch(commentSuccessful(res.data))
            }
            setFocus({ready: false, line: false})
            setWriting(false)
            setComment("")
        } catch (err) {
            dispatch(commentFailed(err))
        }
    }

    return (
        <Container reply={reply}>
            <AvatarWrapper reply={reply}>
                <Avatar src={currentUser?.img === undefined ? unknown : currentUser?.img} reply={reply}/>
            </AvatarWrapper>
            <InputArea onSubmit={(e) => e.preventDefault()} reply={reply}>
                <Input
                    height={25}
                    rows="1"
                    placeholder="Add a comment..."
                    type="text"
                    onFocus={handleFocus}
                    onBlur={()=> setFocus((prev) => ({...prev, line: false}))}
                    value={comment}
                    name="comment"
                    onChange={handleInput}
                    autoFocus={reply ? true : false}
                />
                {focus.line && <><LeftHr/> <Hr/></> }
                {focus.ready &&
                    <CommentButtons>
                        <CancelButton onClick={handleCancelBtn} >CANCEL</CancelButton>                        
                        {writing 
                            ?   (<ActiveConfirmButton onClick={handleSendComment}>
                                    {reply ? "REPLY" : "COMMENT" }
                                </ActiveConfirmButton>)
                            :   (<ConfirmButton>
                                    {reply ? "REPLY" : "COMMENT" }
                                </ConfirmButton>)
                        }                            
                    </CommentButtons>
                }
            </InputArea>
        </Container>
    )
}

export default NewComment