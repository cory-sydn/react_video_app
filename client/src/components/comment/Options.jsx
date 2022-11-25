import React, { useEffect, useState } from "react";
import IonFlagOutline from "../../icons/IonFlagOutline.jsx";
import MdiLightPencil from "../../icons/MdiLightPencil.jsx";
import MdiLightDelete from "../../icons/MdiLightDelete.jsx";
import { DeleteComment } from "./DeleteComment";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { deleteComment } from "../../redux/commentSlice";

export const Container = styled.div`
	z-index: 25;
	position: relative;
`;

export const OptionsContainer = styled.div`
	position: absolute;
	top: 10px;
	right: 40px;
	padding: 8px 0;
	border-radius: 5px;
	background: ${({ theme }) => theme.dropDown.bg};
	box-shadow: 0px 1px 2px 0px #0008, inset 0 0 3px 0 #0004;
`;

export const Option = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 8px 24px;
	&:hover {
		background: ${({ theme }) => theme.dropDown.hover};
	}
`;

export const Wrapper = styled.div`
	position: fixed;
	display: grid;
	justify-content: center;
	inset: 0;
	width: calc(100vw - 8px);
	height: 100vh;
	z-index: 99;
`;

export const Message = styled.div`
	position: absolute;
	inset: 0;
	margin: auto;
	width: 300px;
	height: max-content;
	padding: 20px 0;
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.uploader};
  border: ${({ theme }) => theme.edge};
	border-radius: 0;
	white-space: pre-line;
	display: grid;
	align-items: center;
	place-content: center;
	z-index: 99;
`;

export const SecondCheck = styled.div`
	margin-top: 10px;
	padding: 10px 20px 0;
	display: flex;
	justify-content: space-between;
	border-top: 1px solid ${({ theme }) => theme.soft};
`;

export const CheckButton = styled.div`
	margin-inline: 10px;
	padding: 10px;
	color: #3ea6ff;
	cursor: pointer;
`;

export const Title = styled.h4`
	text-align: left;
	margin: 4px 24px;
`;

export const Text = styled.p`
	color: ${({ theme }) => theme.textSoft};
	white-space: pre-line;
	display: flex;
	flex-wrap: wrap;
	text-align: left;
	font-size: 14px;
	line-height: 20px;
	margin-block: 10px;
	letter-spacing: 0.2px;
	padding: 10px 24px 10px;
`;

const Options = ({
	comment,
	optionRef,
	setEditOpen,
	warnRef,
	secondCheck,
	setSecondCheck,
	setOpenOptions,
}) => {
	const { currentVideo } = useSelector((state) => state.video);
	const { currentUser } = useSelector((state) => state.user);
	const [message, setMessage] = useState(null);
	const dispatch = useDispatch();

	const handleDelete = async () => {
		setSecondCheck(false);
		const res = await DeleteComment(comment._id);
		res.status === 200 && dispatch(deleteComment(comment._id));
		setMessage(res.data);
		setTimeout(() => {
			setMessage(null);
			setOpenOptions(false);
		}, 2000);
	};

	useEffect(() => {
		if (secondCheck) {
			const message = comment.childs.length
				? "Are you sure?\nComment will be irreversibly deleted with all these replies it received."
				: "Delete your comment permanently?";
			setMessage(message);
		} else {
			setMessage(null);
		}
	}, [secondCheck, comment.childs, setMessage]);

	return (
		<>
			<Container>
				<OptionsContainer ref={optionRef}>
					{currentUser?._id === comment.userId ? (
						<>
							<Option onClick={() => setEditOpen(true)}>
								<MdiLightPencil style={{ marginRight: 10 }} /> Edit
							</Option>
							<Option onClick={() => setSecondCheck(true)}>
								<MdiLightDelete style={{ marginRight: 10 }} /> Delete
							</Option>
						</>
					) : currentVideo?.userId === currentUser?._id ? (
						<>
							<Option onClick={() => setSecondCheck(true)}>
								<MdiLightDelete style={{ marginRight: 10 }} /> Delete
							</Option>
							<Option>
								<IonFlagOutline style={{ marginRight: 10 }} /> Report
							</Option>
						</>
					) : (
						<Option>
							<IonFlagOutline style={{ marginRight: 10 }} /> Report
						</Option>
					)}
				</OptionsContainer>
			</Container>
			{message !== null && (
				<Wrapper>
					<Message ref={warnRef}>
						<Title>Delete Comment{"\n"}</Title>
						<Text>{message}</Text>
						{secondCheck && (
							<SecondCheck>
								<CheckButton
									onClick={() => setSecondCheck(false)}
									style={{ marginLeft: 85 }}
								>
									Cancel
								</CheckButton>
								<CheckButton onClick={handleDelete}>Delete</CheckButton>
							</SecondCheck>
						)}
					</Message>
				</Wrapper>
			)}
		</>
	);
};

export default Options;
