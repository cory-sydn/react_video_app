import styled from "styled-components";

export const Img = styled.img`
	width: ${(props) => props.size && props.size + "px"};
	height: ${(props) => props.size && props.size + "px"};
	border-radius: 50%;
	object-fit: cover;
	cursor: pointer;
`;

export const BlankImg = styled.div`
	width: ${(props) => props.size && props.size + "px"};
	height: ${(props) => props.size && props.size + "px"};
	border-radius: 50%;
	object-fit: scale-down;
	display: grid;
	place-content: center;
	color: white;
	background: ${(props) =>
		props.name &&
		(props.name.charCodeAt(0) < 73
			? "#252a48"
			: props.name.charCodeAt(0) < 82
			? "#0a413c"
			: props.name.charCodeAt(0) < 91
			? "#4e212a" 
			: props.name.charCodeAt(0) < 106
			? "#252a48"
			: props.name.charCodeAt(0) < 114
			? "#0a413c"
			: "#4e212a"
		)};
	border: transparent;
	font-family: sans-serif, Arial, Helvetica;
	font-size: ${(props) => props.size && props.size * 0.6 + "px"};
	font-weight: 500;
	cursor: pointer;
`;

const ProfileImg = ({ size, img, name }) => {
	return (
		<>
			{img === "" ? (
				<BlankImg size={size} name={name}>
					{name[0]?.toUpperCase()}
				</BlankImg>
			) : (
				<Img size={size} src={img} alt="" />
			)}
		</>
	);
};

export default ProfileImg;
