import React, { useState } from "react";
import styled from "styled-components";
import { forwardRef } from "react";
import { useDispatch } from "react-redux";

export const Container = styled.div`
	height: max-content;
	width: 100%;
	background: ${({ theme }) => theme.dropDown.item};
	display: flex;
	flex-direction: column;
`;

const Input = styled.input`
	position: sticky;
	top: 0;
	left: 1px;
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
	padding: 0 15px;
	font-size: 14px;
	background: ${({ theme }) => theme.dropDown.item};
	border: 1px solid ${({ theme }) => theme.textSoft};
	cursor: pointer;
	outline: none;
	&:hover {
		background: ${({ theme }) => theme.soft};
	}
	&:focus {
		border: 1px solid #3ea6ff;
	}
`;

const Wrapper = styled.div`
	max-height: 450px;
	overflow-x: hidden;
	overflow-y: scroll;
	overscroll-behavior: none;
	border: 1px solid ${({ theme }) => theme.soft};
	border-top: transparent;
	&::-webkit-scrollbar {
		background: transparent;
		width: 8px;
	}
	&:hover {
		&::-webkit-scrollbar-thumb {
			background: ${({ theme }) => theme.scroll};
		}
	}
`;

const CountryContainer = styled.div`
	height: 100%;
`;

const Item = styled.div`
	height: 40px;
	display: flex;
	align-items: center;
	padding: 0 15px;
	gap: 10px;
	font-size: 14px;
	cursor: pointer;
	&:hover {
		background: ${({ theme }) => theme.soft};
	}
	&:active {
		background: ${({ theme }) => theme.dropDown.active};
	}
`;

export const Selector = forwardRef((props, ref) => {
	const [options, setOptions] = useState(props.data);
	const dispatch = useDispatch();

	function handleSelect(e) {
		dispatch(props.setter(e.target.outerText))
		props.setSubmenu(undefined);
	}

	const handleChange = (e) => {
		const regex = new RegExp(`${e.target.value}`, "gi");
		const filtered = props.data.filter((el) => el.label.match(regex));
		filtered.length && setOptions(filtered);
	};

	return (
		<Container>
			<Input
				type="text"
				options={options}
				autoFocus
				autoHighlight
				onChange={handleChange}
			/>
			<Wrapper>
				<CountryContainer>
					{options.map((option) => (
						<Item key={option.code} onClick={handleSelect}>
							{props.submenu === "Location" ? (
								<img
									loading="lazy"
									width="20"
									src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
									srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
									alt=""
								/>
							) : (
								<div style={{ width: 15 }}></div>
							)}
							{option.label} ({option.code})
						</Item>
					))}
				</CountryContainer>
			</Wrapper>
		</Container>
	);
});
