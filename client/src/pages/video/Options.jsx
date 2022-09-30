import React, { useEffect, useState } from "react";
import { deleteVideo } from "../../redux/videoSlice";
import IonFlagOutline from "../../icons/IonFlagOutline.jsx";
import MdiLightPencil from "../../icons/MdiLightPencil.jsx";
import MdiLightDelete from "../../icons/MdiLightDelete.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getStorage, ref, deleteObject } from "firebase/storage";
import {
	Container,
	OptionsContainer,
	Option,
	Wrapper,
	Message,
	SecondCheck,
	CheckButton,
	Title,
	Text,
} from "../../components/comment/Options";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Options = ({
	video,
	optionRef,
	warnRef,
	secondCheck,
	setSecondCheck,
	setOpenOptions,
	close,
	channelId,
}) => {
	const { currentUser } = useSelector((state) => state.user);
	const [message, setMessage] = useState(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const storage = getStorage();

	const handleDelete = async () => {
		setSecondCheck(false);
		try {
			const res = await axios.delete(
				`http://localhost:8800/api/videos/${video._id}`,
				{ withCredentials: true }
			);
			setMessage(res.data);

			const firebaseVideoName = video?.videoUrl
				.split("/o/")[1]
				.split("?alt=")[0];
			const firebaseImgName = video?.imgUrl.split("/o/")[1].split("?alt=")[0];
			const videoRef = ref(storage, firebaseVideoName);
			const imageRef = ref(storage, firebaseImgName);

			if (res.status === 200) {
				dispatch(deleteVideo(video._id));
				deleteObject(videoRef)
					.then(() => {
						console.log("video successfully deleted.");
					})
					.catch((err) => {
						console.log(err);
					});
				deleteObject(imageRef)
					.then(() => {
						console.log("video poster successfully deleted.");
					})
					.catch((err) => {
						console.log(err);
					});
			}
			setTimeout(() => {
				setMessage(null);
				setOpenOptions(false);
				close();
				navigate("/");
			}, 2000);
		} catch (err) {
			setMessage(err?.response?.data?.message);
		}
	};

	useEffect(() => {
		if (secondCheck) {
			const message = "Are you sure?\nVideo will be irreversibly deleted.";
			setMessage(message);
		} else {
			setMessage(null);
		}
	}, [secondCheck, setMessage]);

	return (
		<>
			<Container>
				<OptionsContainer ref={optionRef}>
					{currentUser?._id === video?.userId ? (
						<>
							<Link to={`/channel/studio/${channelId}/${video._id}`} replace>
								<Option>
									<MdiLightPencil style={{ marginRight: 10 }} />
									Edit
								</Option>
							</Link>
							<Option onClick={() => setSecondCheck(true)}>
								<MdiLightDelete style={{ marginRight: 10 }} /> Delete
							</Option>
						</>
					) : (
						<Option>
							<IonFlagOutline style={{ marginRight: 10 }} />
							Report
						</Option>
					)}
				</OptionsContainer>
			</Container>
			{message !== null && (
				<Wrapper>
					<Message ref={warnRef}>
						<Title>Delete Video{"\n"}</Title>
						<Text>{message}</Text>
						{secondCheck && (
							<SecondCheck>
								<CheckButton onClick={close} style={{ marginLeft: 85 }}>
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
