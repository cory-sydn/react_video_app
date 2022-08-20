import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import { ThemeProvider } from '@mui/material';
import { format } from 'timeago.js';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { dislike, like } from '../../redux/commentSlice';
import unknown from "../../img/unnamed.jpg"
import NewComment from './NewComment';
import { muiTheme } from '../../utils/muiTheme';

const Container = styled.div`
    display: flex;    
    margin-top:${(props) => (props.isChild ? "-16px" : 0)};
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const AvatarWrapper = styled.div`   
    width:${(props) => (props.isChild ? "40px" : "56px")};
    height: 100%;
`

const Avatar = styled.img`
    width:${(props) => (props.isChild ? "24px" : "40px")};
    height:${(props) => (props.isChild ? "24px" : "40px")};
    margin-right: 16px;
    border-radius: 50%;
`

const Details = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    padding-right: 2rem;
    color: ${({ theme }) => theme.text};
    &:hover {
        position: relative;
    }
    &:focus-within{
        position: relative;
    }
`

const Name = styled.span`
    font-size: 13px;
    font-weight: 500;
`

const Date = styled.span`
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.textSoft};
    margin-left: 5px;
`

const Text = styled.p`
    white-space: pre-line;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-wrap: wrap;
    text-align: left;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.2px;
`

const Reactions = styled.div`
    font-size: 12px;
    display: flex;
    margin-bottom: 24px;
    margin-left: -11px;
`

const Button = styled.div`
    margin-inline: .75rem;
    cursor: pointer;
    display:flex;
    align-items: center;
`

const DisplayRepliesBtn = styled(Button)`
    margin-left: -6px;
    margin-top: -12px;
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 500;
    width: max-content;
    color: #3ea6ff;
`

const Span = styled.span`
    font-weight: 500;
    color: ${({ theme }) => theme.textSoft};
`

const More = styled.div`
	margin-top: 1px;
	color: ${({ theme }) => theme.textSoft};
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	letter-spacing: -0.5px;
    line-height: 15px;
    &:hover {
        border-bottom: 1px solid ${({ theme }) => theme.textSoft};
        line-height: 14px;
    }
`;

const Comment = ({comment, currentUser, isChild}) => {
    const [commentAuthor, setCommenAuthor] = useState({});
    const [expand, setExpand] = useState(false)
    const [reply, setReply] = useState(false)
    const [openReplies, setOpenReplies] = useState(false)
    const [replies, setReplies] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(()=> {
        const cancelToken = axios.CancelToken.source()        
        const fetchUser = async() => {
            try {
                const res = await axios.get(`http://localhost:8800/api/users/find/${comment.userId}`, {cancelToken: cancelToken.token})
                setCommenAuthor(res.data)
            } catch (err) {
                if(axios.isCancel(err)) return console.log("cancelled!");
                console.log(err);
            }
        }
        fetchUser()        
        return () => {
            cancelToken.cancel()
        }
    }, [comment.userId])

    const handleLike = async() =>  {
		if(!currentUser) return navigate("/signin")
		try {
            await axios.put(`http://localhost:8800/api/comments/like/${comment._id}`,{}, {withCredentials: true}
            )
			dispatch(like(currentUser._id))
		} catch (err) {
			console.log(err);
		}
	}

    const handleDislike = async() =>  {
		if(!currentUser) return navigate("/signin")
		try {
            await axios.put(`http://localhost:8800/api/comments/dislike/${comment._id}`, {},{withCredentials: true}
            )
			dispatch(dislike(currentUser._id))
		} catch (err) {
			console.log(err);
		}
	}

    useEffect(()=> {
        if(!openReplies) return
        const cancelToken = axios.CancelToken.source()
        const fetchReplies = async() => {
            try {
                const res = await axios.get(`/comments/replies/${comment._id}`, {cancelToken: cancelToken.token})
                setReplies(res.data)
            } catch (err) {
                if(axios.isCancel(err)) return console.log("cancelled!");
                console.log(err);
            }
        }
        fetchReplies()
        return () => {
            cancelToken.cancel()
        }
    }, [openReplies])

  return (   
    <Container isChild={isChild}>
        <AvatarWrapper isChild={isChild} >
            <Avatar src={commentAuthor.img === undefined ? unknown : commentAuthor.img} isChild={isChild}></Avatar>
        </AvatarWrapper>
        <Wrapper>
            <Details>
                <Name>{commentAuthor.name}<Date>{format(comment.createdAt)} </Date></Name>
                <Text>
                    {comment?.desc?.length < 356 
                        ? comment.desc 
                        : expand === false 
                            ? `${(comment.desc).slice(0, 355)}...`
                            : comment.desc
                    } 
                </Text>
                    {comment?.desc?.length > 356 &&
                        <More onClick={() => setExpand(!expand)}>
                            {expand === true ? ("Show less") : ("Read more")}                        
                        </More>
                    }
                <Reactions>		
                    <ThemeProvider theme={muiTheme} >
                        <Button>
                            {comment.likes?.includes(currentUser?._id) ? (
                                <ThumbUpAltIcon fontSize="small" onClick={handleLike}  />
                            ) : (
                                <ThumbUpOutlinedIcon fontSize="small" onClick={handleLike}  />
                            )}
                            <Span>&nbsp;{comment?.likes?.length}</Span>
                        </Button>
                        <Button>
                            {comment.dislikes?.includes(currentUser?._id) ? (
                                <ThumbDownAltIcon fontSize="small"onClick={handleDislike} />
                            ) : (
                                <ThumbDownOffAltOutlinedIcon fontSize="small" onClick={handleDislike} />
                            )}
                        </Button>
                        <Button onClick={()=>setReply(true)} >
                            <Span>REPLY</Span>
                        </Button>
                    </ThemeProvider>
                </Reactions>
                <MoreVertSharpIcon 
                    style={{position: "absolute", right:0, top:10, cursor: "pointer", fontSize:"large", }}
                />
            </Details>
            {reply && 
                <NewComment reply={reply} setReply={setReply} videoId={comment.videoId} currentUser={currentUser} parent={comment._id}  />   
            }            
            {comment?.childs.length > 0 && (
                <DisplayRepliesBtn onClick={() => setOpenReplies(!openReplies)} >
                    {openReplies ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/> }
                    {comment?.childs.length} &ensp;
                    {comment.childs.length > 1 ? "REPLIES": "REPLY"} 
                </DisplayRepliesBtn>
            )}
            {openReplies &&(
                replies.map((reply)=>{
                    if (reply.parent !== comment._id ) return;          
                    return <Comment key={reply._id} comment={reply} isChild={true} currentUser={currentUser} />
                })
            )}
        </Wrapper>
    </Container>
  )
}

export default Comment