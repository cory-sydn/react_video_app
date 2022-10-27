import styled from "styled-components";

export const Img = styled.img`
	width: ${(props) => (props.size && props.size + "px")} ;
	height: ${(props) => (props.size && props.size + "px")} ;
	border-radius: 50%;
	object-fit: cover;
	cursor: pointer;
`;

export const BlankImg = styled.button`
	width: ${(props) => (props.size && props.size + "px")} ;
	height: ${(props) => (props.size && props.size + "px")} ;
	border-radius: 50%;
	object-fit: scale-down;
	display: grid;
	place-content: center;
	color: white;
	background: #0a413c;
	border: transparent;
	font-family: sans-serif, Arial, Helvetica;
	font-size: 18px;
	font-weight: 500;
	cursor: pointer;
`;

const ProfileImg = ({size, img, name}) => {
  return (
    <>
      {img === "" ? (
					<BlankImg size={size} >{name[0].toUpperCase()}</BlankImg>
				) : (
					<Img size={size} src={img}   alt="" />
      )}
    </>
  )
}

export default ProfileImg;