import React from "react";
import { useState } from "react";
import styled from "styled-components";
import "./glow.css"

export const BtnContainer = styled.button`
	display: flex;
	align-items: center;
	cursor: pointer;
	position: relative;
	font-size: 14px;
	font-weight: 600;
  margin-right: 20px;
	padding: 0 5px;
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.bg};
	border: none;
	@media (max-width: 600px) {
		margin-right: 3px;
	}
`;

const Button = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: grid;
	place-content: center;
	cursor: pointer;
`;

const GlowingButton = ({icon}) => {
	const [glow, setGlow] = useState(false);

	const handleGlow = () => {
		setGlow(true)
		setTimeout(()=> {setGlow(false)},500)
	}

	return (
		<Button
			className={glow ? "glow" : ""}
			onClick={handleGlow}
		>
			{icon}
		</Button>
	)
}

export default GlowingButton;