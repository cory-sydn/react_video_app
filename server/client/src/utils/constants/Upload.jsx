import styled from "styled-components";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export const Container = styled.div`
	&::after,
	::before {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
`;

export const Wrapper = styled.section`
	margin: 0;
	padding: 0;
	position: absolute;
	display: grid;
	justify-content: center;
	top: -8px;
	right: -16px;
	width: calc(100vw - 0px);
	height: 100vh;
	background: #0006;
	overflow: hidden;
	z-index: 31;
`;

export const UploaderBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 40px;
	background: ${({ theme }) => theme.uploader};
	width: 1000px;
	height: 600px;
	border-radius: 6px;
	overflow-y: hidden;
	position: relative;
	z-index: 32;
`;

export const UploaderHeader = styled.header`
	position: sticky;
	top: 0;
	left: 0;
	display: flex;
	justify-content: space-between;
	height: 56px;
	width: 100%;
	padding: 10px 20px 10px;
	border-bottom: 1px solid ${({ theme }) => theme.soft};
	box-shadow: 0 1px 2px #00000045;
`;

export const UploaderFooter = styled.footer`
	position: absolute;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: ${({ theme }) => theme.uploader};
	height: 56px;
	width: 100%;
	padding: 10px 10px 10px 40px;
	z-index: 33;
	border-top: 1px solid ${({ theme }) => theme.soft};
	box-shadow: 0 -1px 2px #00000045;
`;

export const HeaderTitle = styled.h3`
	margin-top: 8px;
`;

export const CloseBtn = styled.button`
	border: none;
	outline: none;
	background: transparent;
	margin-top: 3px;
	color: ${({ theme }) => theme.textSoft};
	cursor: pointer;
`;

export const UploadVideoForm = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	width: 100%;
`;


export const HiddenInput = styled.input`
	display: none;
`;

export const Divided = styled.div`
	width: 100%;
	height: 488px;
	display: flex;
	margin: 0;
	overflow-x: hidden;
	overflow-y: auto;
	overscroll-behavior: none;
	border-right: 2px solid ${({ theme }) => theme.uploader};
	&::-webkit-scrollbar {
		width: 8px;
		background: ${({ theme }) => theme.uploader};
	}
	&::-webkit-scrollbar-thumb {
		background: #909090;
		border-radius: 8px;
	}
`;

export const Title3 = styled.h3`
	width: 100%;
	text-align: left;
	margin-top: 8px;
	margin-bottom: 20px;
`;

export const Title4 = styled(Title3)`
	font-size: 16px;
	margin-bottom: 10px;
`;

export const Left = styled.div`
	width: 63%;
	height: 100%;
	padding: 30px 20px 30px 40px;
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 32;
`;

export const Right = styled.div`
	position: sticky;
	top: 0;
	right: 0;
	width: 37%;
	padding: 20px;
	display: grid;
	place-content: center;
	padding-right: 15px;
	border-right: 2px solid ${({ theme }) => theme.uploader};
`;

export const DetailsForm = styled.form`
	width: 100%;
	display: flex;
	flex-direction: column;
`;

export const Input = styled.input`
	width: 100%;
	background: ${({ theme }) => theme.uploader};
	color: ${({ theme }) => theme.text};
	border-radius: 4px;
	margin-bottom: 24px;
	padding: 12px 18px;
	border: 1px solid ${({ theme }) => theme.textSoft};
	&:focus {
		border: 1px solid transparent;
		outline: 1px solid #3ea6ff;
	}
`;

export const DescInput = styled.textarea`
	width: 100%;
	overflow: auto;
	resize: none;
	outline: none;
	line-height: _px; // thanks to _px textarea padding works
	font-size: 14px;
	font-family: Arial, Helvetica, sans-serif;
	font-weight: 500;
	background: ${({ theme }) => theme.uploader};
	color: ${({ theme }) => theme.text};
	border-radius: 4px;
	border: 1px solid ${({ theme }) => theme.textSoft};
	padding: 12px 18px;
	margin-bottom: 24px;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: none;
	&:focus {
		border: 1px solid transparent;
		outline: 1px solid #3ea6ff;
	}
	&::-webkit-scrollbar {
		width: 8px;
		background: ${({ theme }) => theme.dropDown.active};
		border-radius: 0 4px 4px 0;
	}
	&::-webkit-scrollbar-thumb {
		background: #909090;
		border-radius: 6px;
	}
`;

export const ThumbnailInputLabel = styled.label`
	display: grid;
	place-content: center;
	margin-top: 10px;
	width: 160px;
	height: 90px;
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.uploader};
	border: 1px dashed ${({ theme }) => theme.textSoft};
	padding: 10px 12px;
	margin-bottom: 24px;
	position: relative;
	cursor: pointer;
	&:focus {
		border: 1px solid transparent;
		outline: 1px solid #3ea6ff;
	}
`;

export const AddImageIcon = styled(AddPhotoAlternateIcon)`
	place-self: center;
	margin: 5px 0 10px 0;
`;

export const ThumbnailImg = styled.img`
	width: 160px;
	height: 90px;
	border: 2px solid #151525;
	object-fit: cover;
	object-position: 0, 0;
	position: absolute;
	top: -1px;
	left: -1px;
	&:hover {
		transition: all 0.35s ease-in-out;
		width: 320px;
		height: 180px;
		z-index: 34;
	}
`;

export const Card = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 320px;
	min-height: 250px;
	height: 100%;
	mask-image: linear-gradient(#363636f4 94%, #4c4c4c20);
	isolation: isolate;
	background: ${({ theme }) => theme.bg};
	border-radius: 5px;
`;

export const Screen = styled.div`
	display: grid;
	place-content: center;
	background-color: #080808;
	color: white;
	width: 100%;
	min-height: 170px;
	border-radius: 5px 5px 0 0;
	font-size: 14px;
`;

export const Item = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	text-align: left;
	margin-block: 10px;
	padding: 5px 15px;
	font-size: 14px;
`;

export const ItemTitle = styled.p`
	font-size: 13px;
	width: 100%;
	padding-bottom: 10px;
	text-align: left;
	color: ${({ theme }) => theme.textSoft};
`;

export const ItemExplain = styled(ItemTitle)`
	font-size: 14px;
	font-weight: 400;
`;

export const VideoLink = styled.p`
	font-size: 12px;
	color: #3ea6ff;
`;

export const ProcessDisplay = styled.div`
	width: 100px;
	height: 10px;
	border-radius: 30px;
	background: ${({ theme }) => theme.textSoft};
	position: relative;
	overflow: hidden;
	box-shadow: 0 1px 0 #ffffff60, inset 0 2px 3px rgba(0, 0, 0, 0.3);
	&::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: ${(props) => (props.percentage > 0 ? `${props.percentage}px` : 0)};
		background: linear-gradient(#6ebafd, #3ea6ff);
		box-shadow: inset 0 1px 0 #ffffff60, 0 4px 5px rgba(0, 0, 0, 0.3);
		border-radius: 30px;
	}
	&::after {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: ${(props) => (props.percentage > 0 ? `${props.percentage}px` : 0)};
		background: linear-gradient(300deg, #88c7ff, #3ea6ff);
		animation: flow cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
		animation-duration: ${(props) =>
			props.percentage === 300 ? 0 : `calc(30ms * ${props.percentage})`};
		border-radius: 30px;
	}
	@keyframes flow {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(0);
		}
	}
`;

export const ConfirmButton = styled.button`
	text-transform: uppercase;
	padding: 10px 18px;
	font-size: 14px;
	font-weight: 600;
	border: ${(props) =>
		props.suspendConfirm ? "1px solid #919191aa" : "1px solid #3ea6ff"};
	background: ${(props) =>
		props.suspendConfirm
			? "#919191aa"
			: "linear-gradient(#65b7ff 15% , #3ea6ff 100%)"};
	border-radius: 3px;
	color: ${({ theme }) => theme.uploader};
	filter: brightness(100%);
	transition: filter 0.3s ease-in-out;
	&:hover {
		transition: filter 0.3s ease-in-out;
		filter: brightness(85%);
	}
`;

export const CancelButton = styled(ConfirmButton)`
	background: linear-gradient(#fb3232 20%, red 100%);
	border: 1px solid red;
	color: #c0c0c0;
	margin-right: 25px;
`;

export const VideoFrame = styled.video`
	width: 100%;
	height: 100%;
	object-fit: scale-down;
	background-origin: 0 0;
`;