import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { ThemeProvider } from "@mui/material";
import { muiUploader } from "../../utils/muiTheme";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import WarningMessage from "./WarningMessage";
import Darkness from "../../utils/constants/Darkness";
import { Container,
  Wrapper,
  UploaderBox,
  UploaderHeader,
  UploaderFooter,
  HeaderTitle,
  CloseBtn,
  UploadVideoForm,
  HiddenInput,
  Divided,
  Title3,
  Title4,
  Left,
  Right,
  DetailsForm,
  Input,
  DescInput,
  ThumbnailInputLabel,
  AddImageIcon,
  ThumbnailImg,
  Card,
  Screen,
  Item,
  ItemTitle,
  ItemExplain,
  VideoLink,
  ProcessDisplay,
  ConfirmButton,
  CancelButton,
  VideoFrame} from "../../utils/constants/Upload"

const UploadLabel = styled.label`
	display: grid;
	place-content: center;
	height: 140px;
	width: 140px;
	border-radius: 50%;
	margin-top: 15vmin;
	background: ${({ theme }) => theme.bg};
	color: ${({ theme }) => theme.textSoft};
	cursor: pointer;
	&:hover {
		animation: wawe 3s cubic-bezier(0.165, 0.84, 0.44, 1) both infinite;
		@keyframes wawe {
			0% {
				box-shadow: 0 0 2px 0 #3ea5ff76;
			}
			33% {
				box-shadow: 0 0 5px 0 #3ea5ffcb;
			}
			50% {
				box-shadow: 0 0 5px 0 #3ea5ffcb;
			}
			100% {
				box-shadow: 0 0 2px 0 #3ea5ff76;
			}
		}
	}
`;

const UploadVideoButton = styled.label`
	width: 160px;
	margin-top: 40px;
	padding: 10px 16px;
	font-size: 14px;
	font-weight: 600;
	border: none;
	border-radius: 2px;
	background: #3ea6ff;
	color: ${({ theme }) => theme.bg};
	cursor: pointer;
`;

const Text = styled.p`
	margin-top: 24px;
`;

const Span = styled.span`
	color: ${({ theme }) => theme.textSoft};
	margin-top: 10px;
	font-size: 13px;
`;

const Buttons = styled.div`
	display: flex;
`;

const Upload = ({ activeUpload, setActiveUpload, setOpenUpload }) => {
	const [warning, setWarning] = useState({ state: false, message: "" });
	const [secondCheck, setSecondCheck] = useState(false);
	const [file, setFile] = useState({ video: null, img: null });
	const [videoPercent, setVideoPercent] = useState(0);
	const [imagePercent, setImagePercent] = useState(0);
	const [videoUploadTask, setVideoUploadTask] = useState([]);
	const [imageUploadTask, setImageUploadTask] = useState([]);
	const [videoDetails, setVideoDetails] = useState({
		title: "",
		desc: "",
		imgUrl: "",
		videoUrl: "",
		tags: [],
	});
	const [darkEffect, setDarkEffect] = useState(false);
	const [suspendConfirm, setSuspendConfirm] = useState(true);
	const navigate = useNavigate();

	const handleDrop = (e) => {
		e.stopPropagation();
		e.preventDefault();
		setFile((prev) => ({ ...prev, video: e.dataTransfer.files[0] }));
	};

	const uploadFiles = useCallback(async (file, dataType) => {
		const storage = getStorage();
		try {
			const fileName = new Date().getTime() + file.name;
			const storageRef = ref(storage, fileName);

			const uploadTask = uploadBytesResumable(storageRef, file);
			dataType === "videoUrl"
				? setVideoUploadTask(uploadTask)
				: setImageUploadTask(uploadTask);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					dataType === "videoUrl"
						? setVideoPercent(progress)
						: setImagePercent(progress);
					switch (snapshot.state) {
						case "paused":
							console.log(` ${dataType} upload is paused`);
							break;
						case "running":
							console.log(`${dataType} upload is running`);
							break;
						default:
							break;
					}
				},
				(error) => {
					console.log(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						console.log(`${dataType} available at`, downloadURL);
						setVideoDetails((prev) => ({ ...prev, [dataType]: downloadURL }));
					});
				}
			);
		} catch (err) {
			console.log(err);
		}
	}, []);

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
		// textarea auto expand functionality
		e.target.style.removeProperty("height");
		e.target.style.height = e.target.scrollHeight + 2 + "px";
	};

	useEffect(() => {
		file.video && uploadFiles(file.video, "videoUrl");
	}, [file.video, uploadFiles]);

	useEffect(() => {
		file.img && uploadFiles(file.img, "imgUrl");
	}, [file.img, uploadFiles]);

	const handleConfirm = async (e) => {
		e.preventDefault();
		// register video with the firebase cloud storage urls and with the videoDetails at MongoDB
		if (videoPercent < 100 && videoDetails.videoUrl === "")
			return setWarning({
				state: true,
				message: "Video uploading is not finished yet!",
			});
		try {
			const res = await axios.post(
				"http://localhost:8800/api/videos",
				{ ...videoDetails },
				{ withCredentials: true }
			);
			setOpenUpload(false);
			res.status === 200 && navigate(`/video/${res.data._id}`);
		} catch (err) {
			console.log(err);
			err.response.data.message &&
				setWarning({ state: true, message: err?.response?.data?.message });
		}
	};

	const handleCancel = () => {
		if (!secondCheck) {
			setWarning({
				state: true,
				message: "Are you sure?\n\nWhole progress will be lost!",
			});
			setSecondCheck(true);
		} else {
			videoPercent &&
				(videoPercent < 100
					? videoUploadTask.cancel()
					: removeFromStorage(videoUploadTask._ref));
			imagePercent &&
				(imagePercent < 100
					? imageUploadTask.cancel()
					: removeFromStorage(imageUploadTask._ref));
			setOpenUpload(false);
		}
	};

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

	useEffect(() => {
		if (warning.state) {
			setDarkEffect(true);
		} else {
			setTimeout(() => {
				setDarkEffect(false);
			}, 400);
		}
	}, [darkEffect, warning.state]);

	const closeComponent = () => {
		// upload component stay mounted and preserves state values
		if (videoPercent > 0) return setActiveUpload(false);
		setActiveUpload(false);
		setOpenUpload(false);
	};

	useEffect(() => {
		// verify that there is no empty space before confirm
		const array = [];
		Object.values(videoDetails).map((el) => {
			return array.push(el.length);
		});
		array.every((el) => el > 0) && setSuspendConfirm(false);
	}, [videoDetails]);

	return (
		<Container>
			{activeUpload && (
				<Wrapper>
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
						{!videoPercent ? (
							<UploadVideoForm
								encType="multipart/form-data"
								htmlFor="upload"
								onDrop={handleDrop}
								onDragOver={handleDrop}
								onSubmit={(e) => e.preventDefault()}
								accept="video/*"
							>
								<UploadLabel htmlFor="upload">
									<ThemeProvider theme={muiUploader}>
										<FileUploadIcon />
									</ThemeProvider>
								</UploadLabel>
								<Text>Drag and drop video files to upload</Text>
								<Span>Your videos will be private until you publish them.</Span>
								<UploadVideoButton
									htmlFor="upload"
									encType="multipart/form-data"
								>
									SELECT FILES
								</UploadVideoButton>
								<HiddenInput
									id="upload"
									type="file"
									onChangeCapture={(e) =>
										setFile((prev) => ({ ...prev, video: e.target.files[0] }))
									}
									accept="video/*"
								/>
							</UploadVideoForm>
						) : (
							<>
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
											/>
											<Title4>Thumbnail</Title4>
											<ItemExplain>
												Select or upload a picture that shows what's in your
												video. A good thumbnail stands out and draws viewers'
												attention.
											</ItemExplain>
											<ThumbnailInputLabel name="imgUrl" htmlFor="thumbnail">
												{imagePercent > 0 && imagePercent < 100 ? (
													<ProcessDisplay
														percentage={Math.round(imagePercent)}
													></ProcessDisplay>
												) : imagePercent === 100 && videoDetails.imgUrl ? (
													<ThumbnailImg
														src={videoDetails?.imgUrl}
													></ThumbnailImg>
												) : (
													<>
														<AddImageIcon />
														<ItemTitle>Upload Thumbnail</ItemTitle>
													</>
												)}
											</ThumbnailInputLabel>
											<HiddenInput
												id="thumbnail"
												type="file"
												name="thumbnail"
												onChange={(e) =>
													setFile((prev) => ({
														...prev,
														img: e.target.files[0],
													}))
												}
												accept="image/*"
											/>
											<Title4>Tags</Title4>
											<ItemExplain>
												Tags can be useful when it comes to searching and
												recommendation, especially if content in your video is
												commonly misspelled.
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
												{videoPercent < 100 ? (
													"Uploading " + Math.round(videoPercent) + "% ..."
												) : (
													<VideoFrame
														src={videoDetails.videoUrl}
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
									<ProcessDisplay
										percentage={Math.round(videoPercent * 3)}
										style={{ width: 300, height: 20 }}
									></ProcessDisplay>
									<Buttons>
										<CancelButton onClick={handleCancel}>cancel</CancelButton>
										<ConfirmButton
											onClick={handleConfirm}
											onBlur={() =>
												setWarning((prev) => ({ ...prev, state: false }))
											}
											disabled={suspendConfirm}
											style={{
												cursor: suspendConfirm ? "not-allowed" : "pointer",
											}}
											suspendConfirm={suspendConfirm}
										>
											confirm
										</ConfirmButton>
									</Buttons>
								</UploaderFooter>
							</>
						)}
					</UploaderBox>
				</Wrapper>
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

export default Upload;
