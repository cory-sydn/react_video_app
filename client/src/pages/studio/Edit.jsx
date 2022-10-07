import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
	Wrapper,
	UploaderBox,
	UploaderHeader,
	UploaderFooter,
	HeaderTitle,
	CloseBtn,
	HiddenInput,
} from "../../utils/constants/Upload";
import {
	Divided,
	Title3,
	Title4,
	Left,
	Right,
	DetailsForm,
	Input,
	DescInput,
	ThumbnailImg,
	ThumbnailInputLabel,
} from "../../utils/constants/Upload";
import {
	Card,
	Screen,
	Item,
	ItemTitle,
	ItemExplain,
	VideoLink,
	ProcessDisplay,
	VideoFrame,
	ConfirmButton,
} from "../../utils/constants/Upload";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import { getStorage, ref, deleteObject } from "firebase/storage";
import axios from "axios";
import Darkness from "../../utils/constants/Darkness";
import { useDispatch } from "react-redux";
import { fetchSuccessful } from "../../redux/videoSlice";
import WarningMessage from "../../components/upload/WarningMessage";
import { Uploader } from "../../utils/functions/Uploader";

const Container = styled.div``;

const EditWrapper = styled(Wrapper)`
	height: calc(100% + 50px);
	z-index: 40;
	top: 0;
	right: 0;
`;

const Edit = ({ openEdit, setOpenEdit }) => {
	const [video, setVideo] = useState([]);
	const [file, setFile] = useState("");
	const [percentage, setPercentage] = useState(0);
	const [uploadTask, setUploadTask] = useState([]);
	const [imageUrl, setImageUrl] = useState("");
	const [videoDetails, setVideoDetails] = useState([]);
	const [suspendConfirm, setSuspendConfirm] = useState(true);
	const [warning, setWarning] = useState({ state: false, message: "" });
	const [secondCheck, setSecondCheck] = useState(false);
	const [darkEffect, setDarkEffect] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const storage = getStorage();

	const handleInitialState = useCallback(() => {
		if (videoDetails.length) return;
		setVideoDetails(
			(videoDetails) =>
				(videoDetails = {
					title: openEdit?.title,
					desc: openEdit?.desc,
					imgUrl: openEdit?.imgUrl,
					videoUrl: openEdit?.videoUrl,
					tags: openEdit?.tags,
				})
		);
	}, [openEdit, setVideoDetails, videoDetails.length]);

	useEffect(() => {
		setVideo(openEdit);
		handleInitialState();
	}, [openEdit, handleInitialState]);

	const handleInput = (e) => {
		e.preventDefault();
		if (e.target.name === "tags") {
			const processed = e.target.value.split(",").map((el) => {
				// Allowing the storage of just letters and numbers on the DB.
				const trimmed = el.trim().replace(/[^a-z,'0-9\s]+/gi, "");
				return trimmed[0]?.toUpperCase() + trimmed.slice(1);
			});
			const filtered = processed.filter(
				(el) => el !== null && el !== "undefined"
			);
			setVideoDetails((prev) => ({ ...prev, tags: filtered }));
		} else {
			setVideoDetails((prev) => ({
				...prev,
				[e.target.name]: e.target.value.trim(),
			}));
		}
		//textarea auto expand functionality
		e.target.style.removeProperty("height");
		e.target.style.height = e.target.scrollHeight + 2 + "px";
	};

	const handleExpandTextarea = (e) => {
		if (e.target.style.height === e.target.scrollHeight + 2 + "px") return;
		e.target.style.removeProperty("height");
		e.target.style.height = e.target.scrollHeight + 2 + "px";
	};

	const uploadFile = useCallback(async (file) => {
		file && (await Uploader(file, setUploadTask, setPercentage, setImageUrl));
		setFile("");
	}, []);

	useEffect(() => {
		imageUrl && setVideoDetails((prev) => ({ ...prev, imgUrl: imageUrl }));
		setImageUrl("");
	}, [imageUrl]);

	useEffect(() => {
		file && uploadFile(file);
	}, [file, uploadFile]);

	useEffect(() => {
		if (videoDetails && video) {
			const keys = ["title", "desc", "imgUrl", "videoUrl", "tags"];
			for (let key of keys) {
				if (key === "tags") {
					if (videoDetails?.tags?.length) {
						if (videoDetails?.tags?.length !== video?.tags?.length) {
							return setSuspendConfirm(false);
						} else {
							for (let tag of video?.tags) {
								if (videoDetails?.tags?.indexOf(tag) === -1) {
									//as soon as find differance
									return setSuspendConfirm(false);
								}
							}
							return setSuspendConfirm(true);
						}
					}
				}
				if (videoDetails[key]) {
					if (video[key] !== videoDetails[key]) {
						return setSuspendConfirm(false);
					}
				}
			}
			return setSuspendConfirm(true);
		}
	}, [videoDetails, video]);

	const handleConfirm = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.put(
				`http://localhost:8800/api/videos/${video._id}`,
				{ ...videoDetails },
				{ withCredentials: true }
			);

			if (res.status === 200) {
				if (video.imgUrl !== videoDetails.imgUrl) {
					const firebaseImgName = video?.imgUrl
						.split("/o/")[1]
						.split("?alt=")[0];
					const imageRef = ref(storage, firebaseImgName);
					await deleteObject(imageRef)
						.then(() => {
							console.log(
								"Previous version of video poster successfully deleted."
							);
						})
						.catch((err) => {
							console.log(err);
						});
				}
				dispatch(fetchSuccessful(res.data));
				setOpenEdit(false);
				navigate("");
			}
		} catch (err) {
			console.log(err);
			err.response.data.message &&
				setWarning({ state: true, message: err?.response?.data?.message });
		}
	};

	useEffect(() => {
		if (warning.state) {
			setDarkEffect(true);
		} else {
			setTimeout(() => {
				setDarkEffect(false);
			}, 400);
		}
	}, [darkEffect, warning.state]);

	const removeFromStorage = (storageRef) => {
		deleteObject(storageRef)
			.then(() => {
				console.log(
					`${storageRef.name.slice(
						13,
						-1
					)} is successfully deleted from the storage`
				);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleCancel = useCallback(() => {
		if (!secondCheck) {
			setWarning({
				state: true,
				message: "Close without saving?\n\nAll changes will be lost!",
			});
			setSecondCheck(true);
		} else {
			percentage &&
				(percentage < 100
					? uploadTask.cancel()
					: removeFromStorage(uploadTask._ref));
			setOpenEdit(false);
			navigate("");
		}
	}, [percentage, uploadTask, secondCheck, setOpenEdit, navigate]);

	const closeComponent = useCallback(() => {
		if (uploadTask._state && uploadTask._state === "running") {
			return handleCancel();
		} else if (!suspendConfirm) {
			return handleCancel();
		} else {
			navigate("");
			setOpenEdit(false);
		}
	}, [uploadTask, navigate, setOpenEdit, suspendConfirm, handleCancel]);

	const handleKeyDown = useCallback(
		(e) => {
			if (e.key === "Escape") closeComponent();
		},
		[closeComponent]
	);

	useEffect(() => {
		window.addEventListener("keyup", handleKeyDown);
		return () => {
			window.removeEventListener("keyup", handleKeyDown);
		};
	}, [handleKeyDown]);

	return (
		<Container>
			{openEdit && (
				<EditWrapper>
					<UploaderBox>
						<UploaderHeader>
							<HeaderTitle>
								{videoDetails?.title ? videoDetails?.title : "Upload Videos"}
							</HeaderTitle>
							<CloseBtn>
								<CloseIcon
									onClick={closeComponent}
									sx={{ fontSize: 27, fontWeight: "bolder" }}
								/>
							</CloseBtn>
						</UploaderHeader>
						<Divided>
							<Left>
								<DetailsForm encType="multipart/form-data">
									<Title3>Details</Title3>
									<Input
										defaultValue={videoDetails?.title}
										name="title"
										type="text"
										maxlength="100"
										placeholder={file?.name}
										onChange={handleInput}
									/>
									<DescInput
										defaultValue={videoDetails?.desc}
										name="desc"
										rows="5"
										padding="15px"
										type="text"
										placeholder="Tell viewers about your video"
										onChange={handleInput}
										onFocus={handleExpandTextarea}
									/>
									<Title4>Thumbnail</Title4>
									<ItemExplain>
										Select or upload a picture that shows what's in your video.
										A good thumbnail stands out and draws viewers' attention.
									</ItemExplain>
									<ThumbnailInputLabel name="imgUrl" htmlFor="thumbnail">
										{videoDetails?.imgUrl && (
											<ThumbnailImg src={videoDetails?.imgUrl} />
										)}
										{percentage > 0 && percentage < 100 ? (
											<ProcessDisplay
												percentage={Math.round(percentage)}
											></ProcessDisplay>
										) : (
											percentage === 100 && (
												<ThumbnailImg src={videoDetails?.imgUrl}></ThumbnailImg>
											)
										)}
									</ThumbnailInputLabel>
									<HiddenInput
										id="thumbnail"
										type="file"
										name="thumbnail"
										onChange={(e) => setFile(e.target.files[0])}
										accept="image/*"
									/>
									<Title4>Tags</Title4>
									<ItemExplain>
										Tags can be useful and make your video easy to find,
										especially if content in your video is commonly misspelled.
										<br />
										<br />
										Please separate the tags with commas.
									</ItemExplain>
									<Input
										defaultValue={videoDetails?.tags}
										name="tags"
										type="text"
										maxlength="500"
										placeholder="music, comedy, business, ..."
										onInput={(e) =>
											(e.target.value = e.target.value.replace(
												/[^a-z,#'0-9\s]+/gi,
												""
											))
										}
										onChange={handleInput}
									/>
								</DetailsForm>
							</Left>
							<Right>
								<Card>
									<Screen>
										{videoDetails?.videoUrl && (
											<VideoFrame
												src={videoDetails?.videoUrl}
												poster={videoDetails?.imgUrl}
												controls
											/>
										)}
									</Screen>
									<Item>
										<ItemTitle>Video Link</ItemTitle>
										<VideoLink>{videoDetails?.videoUrl}</VideoLink>
									</Item>
									<Item>
										<ItemTitle>Video Title</ItemTitle>
										{videoDetails?.title}
									</Item>
								</Card>
							</Right>
						</Divided>
						<UploaderFooter>
							&nbsp;
							<ConfirmButton
								suspendConfirm={suspendConfirm}
								disabled={
									uploadTask._state === "running" ? true : suspendConfirm
								}
								style={{
									cursor:
										uploadTask._state === "running"
											? "progress"
											: suspendConfirm
											? "not-allowed"
											: "pointer",
								}}
								onClick={handleConfirm}
							>
								Save Changes
							</ConfirmButton>
						</UploaderFooter>
					</UploaderBox>
				</EditWrapper>
			)}
			{warning.state && (
				<WarningMessage
					message={warning.message}
					secondCheck={secondCheck}
					setSecondCheck={setSecondCheck}
					setWarning={setWarning}
					handleCancel={handleCancel}
				/>
			)}
			{darkEffect && <Darkness status={warning.state} />}
		</Container>
	);
};

export default Edit;
