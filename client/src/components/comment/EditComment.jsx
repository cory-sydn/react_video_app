import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { commentFailed, editComment } from '../../redux/commentSlice'

const Container = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 100%;
	margin-bottom: 0;
`;

const InputArea = styled.form`
	width: 100%;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	position: relative;
`;

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
`;

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
`;

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
`;

const CommentButtons = styled.div`
	padding-top: 10px;
	width: 100%;
	line-height: 60px;
	width: 100%;
	justify-content: flex-end;
	display: flex;
`;

const CancelButton = styled.button`
	border: none;
	background: transparent;
	color: #606060;
	padding: 10px 16px;
	font-size: 14px;
	font-weight: 500;
	border-radius: 2px;
	cursor: pointer;
`;

const ConfirmButton = styled(CancelButton)`
	margin-left: 8px;
	font-weight: 600;
	background: ${({theme})=> theme.commentButton.bg};
	color: ${({theme})=> theme.commentButton.color};
	cursor: auto;
`;

const ActiveConfirmButton = styled(ConfirmButton)`
	background:#3ea6ff;
	color: ${({theme})=>theme.bg};
	cursor: pointer;
`;

const NewComment = ({ oldComment, setEditOpen }) => {
	const [comment, setComment] = useState(oldComment.desc || "")
	const [focus, setFocus] = useState({ready: false, line: false})
	const [writing, setWriting] = useState(false)
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
		setFocus({ready: true, line: true})
	}

	const handleInput = (e) => {
		setComment(e.target.value);
		e.target.style.removeProperty("height");
		e.target.style.height = e.target.scrollHeight + 2 + "px";
	}

	const handleCancelBtn = (e) => {
		e.preventDefault()
		setEditOpen(false)
		setFocus({ready: false, line: false})
		setComment("")
	}

	const handleSendComment = async() => {
		try {
			const res = await axios.put(`http://localhost:8800/api/comments/${oldComment._id}`, {
				desc: comment,
			},{withCredentials: true,})
			console.log(res);
			dispatch(editComment(res.data))
			setEditOpen(false)
			setFocus({ready: false, line: false})
			setWriting(false)
			setComment("")
			document.querySelector(".commentInput").style.height = 26 + "px"
		} catch (err) {
			dispatch(commentFailed(err.response.data.message))
		}
	}

	return (
		<Container>
			<InputArea onSubmit={(e) => e.preventDefault()}>
				<Input
					className='commentInput'
					id='comment'
					rows="1"
					placeholder="Add a comment..."
					type="text"
					onFocus={handleFocus}
					onBlur={()=> setFocus((prev) => ({...prev, line: false}))}
					value={comment}
					name="comment"
					onChange={handleInput}
					autoFocus
				/>
				{focus.line && <><LeftHr/> <Hr/></> }
				{focus.ready &&
					<CommentButtons>
						<CancelButton onClick={handleCancelBtn} >CANCEL</CancelButton>
						{writing
							?   (<ActiveConfirmButton onClick={handleSendComment} htmlFor="comment">
											SAVE
									</ActiveConfirmButton>)
							:   (<ConfirmButton>
											SAVE
									</ConfirmButton>)
						}
					</CommentButtons>
				}
			</InputArea>
		</Container>
	)
}

export default NewComment