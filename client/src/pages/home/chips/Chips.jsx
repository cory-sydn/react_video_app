import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import uuid from "react-uuid";
import styled from "styled-components";
import "./chip.css";
import axios from "axios";
import { useEffect } from "react";
import { useRef } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Tags } from "./Tags";
import { useCallback } from "react";
import { useHorizontalScroll } from "./useHorizontalScroll";
import ChipElement from "./ChipElement";

const Container = styled.div`
	position: fixed;
	z-index: 35;
	padding: 12px 0;
	width: 100%;
	background: ${({ theme }) => theme.bgLighter};
	border-top: 1px solid ${({ theme }) => theme.soft};
	border-bottom: 1px solid ${({ theme }) => theme.soft};
	height: 56px;
`;

const Display = styled.div`
	position: relative;
	padding-right: 30px;
	width: calc(100vw - 80px);
	@media (max-width: 660px) {
		width: calc(100vw - 8px);
	}
	z-index: 40;
`;

const Wrapper = styled.div`
	width: 100%;
	z-index: 36;
	overflow: hidden;
	overflow-x: auto;
	scroll-behavior: smooth;
	&::-webkit-scrollbar {
		display: none;
	}
`;

const ArrowWrap = styled.div`
	background: ${({ theme }) => theme.bgLighter};
	box-shadow: 5px 0 9px 6px ${({ theme }) => theme.bgLighter};
	position: absolute;
	top: 0;
	height: 100%;
	width: 40px;
	display: grid;
	place-content: center;
	z-index: 40;
`;

const Chips = ({ setVideos }) => {
	const [chipText, setChipText] = useState("all");
	const [showArrow, setShowArrow] = useState({ left: false, right: true });
	const stackRef = useRef();
	const wrapperRef = useHorizontalScroll();

	const handleClick = async (e) => {
		e.stopPropagation();
		setChipText(e.target.innerText.toLowerCase());
		if (e.target.innerText.toLowerCase() === "all") {
			const res = await axios.get(`http://localhost:8800/api/videos/random`);
			setVideos(res.data);
		} else {
			const res = await axios.get(
				`http://localhost:8800/api/videos/recommend/tags?tags=${e.target.innerText}`
			);
			setVideos(res.data);
		}
	};

	const handleSlide = useCallback(
		(direction) => {
			const el = wrapperRef.current;
			direction
				? el.scrollTo({ left: el.scrollLeft + 200 })
				: el.scrollTo({ left: el.scrollLeft - 200 });
		},
		[wrapperRef]
	);

	const handleSyncArrows = useCallback(() => {
		const el = wrapperRef.current;
		const range = stackRef.current.scrollWidth - el.offsetWidth;
		el.scrollLeft === 0
			? setShowArrow((prev) => ({ ...prev, left: false }))
			: setShowArrow((prev) => ({ ...prev, left: true }));
		range === el.scrollLeft
			? setShowArrow((prev) => ({ ...prev, right: false }))
			: setShowArrow((prev) => ({ ...prev, right: true }));
	}, [wrapperRef, setShowArrow]);

	useEffect(() => {
		const el = wrapperRef.current;
    if (el) {
			el.addEventListener("scroll", handleSyncArrows);
			return () => el.removeEventListener("scroll", handleSyncArrows);
		}
	}, [wrapperRef, handleSyncArrows]);

	return (
		<Container>
			<Display>
				{showArrow.left && (
					<ArrowWrap style={{ left: 0 }} onClick={() => handleSlide(0)}>
						<KeyboardArrowLeftIcon />
					</ArrowWrap>
				)}
				<Wrapper ref={wrapperRef} data-chip={chipText}>
					<Stack
						name="stack"
						direction="row"
						spacing={1.5}
						ref={stackRef}
						className="stack"
					>
						{Tags.map((tag) => (
							<ChipElement
								key={uuid()}
								tag={tag}
								handleClick={handleClick}
								chipText={chipText}
							/>
						))}
					</Stack>
				</Wrapper>
				{showArrow.right && (
					<ArrowWrap
						style={{ right: 0, transform: "rotate(180deg)" }}
						onClick={() => handleSlide(1)}
					>
						<KeyboardArrowLeftIcon />
					</ArrowWrap>
				)}
			</Display>
		</Container>
	);
};

export default Chips;
