import { useEffect, useReducer, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import uuid from "react-uuid";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Stack } from "@mui/material";
import ChipElement from "./ChipElement";
import { ACTION_TYPES } from "./searchActionTypes";
import { searchReducer, INITIAL_STATE } from "./searchReducer";
import FloatingInput from "./FloatingInput";
import {
	removeSearchGuide,
	resetSearchGuide,
	updateSearchGuide,
} from "../../../redux/studioSlice";

const Form = styled.form`
	height: 50px;
	display: flex;
	align-items: center;
	padding-left: 10px;
	width: 100%;
	position: relative;
`;

const Input = styled.input`
	width: 100%;
	padding: 12px 18px 12px 10px;
	caret-color: #3ea6ff;
	background: ${({ theme }) => theme.bg};
	color: ${({ theme }) => theme.text};
	border: none;
	outline: none;
`;

const OptionsMenu = styled.div`
	position: absolute;
	top: 44.5px;
	left: 10px;
	border-radius: 5px;
	z-index: 10;
	background: ${({ theme }) => theme.chip};
	border: ${({ theme }) => theme.edge};
	box-shadow: 0px 1px 2px 0px #0008, inset 0 0 3px 0 #0004;
`;

const Option = styled.button`
	padding: 16px 20px;
	width: 100%;
	border: none;
	display: grid;
	text-align: left;
	border-radius: 5px;
	background: ${({ theme }) => theme.chip};
	cursor: pointer;
	color: ${({ theme }) => theme.text};
	&:hover {
		background: ${({ theme }) => theme.dropDown.hover};
	}
	&:active {
		background: ${({ theme }) => theme.dropDown.active};
	}
`;

const WrapInput = styled.div`
	width: 100%;
	position: relative;
`;

const SearchBox = ({ options, setSearchFrom, searchFrom }) => {
	const [state, dispatch] = useReducer(searchReducer, INITIAL_STATE);
	const { currentUser } = useSelector((state) => state.user);
	const menuRef = useRef();
	const searchRef = useRef();
	const floatingRef = useRef();
	const warnningRef = useRef();
	const sliceDispatcher = useDispatch();

	const handleClick = () => {
		dispatch({ type: ACTION_TYPES.CLICK_SEARCH });
	};

	const handleWritingSearch = (e) => {
		dispatch({ type: ACTION_TYPES.ON_WRITING, payload: e.target.value });
	};

	const handleAddChip = useCallback(() => {
		dispatch({ type: ACTION_TYPES.ADD_SEARCH_CHIP, payload: searchFrom });
		sliceDispatcher(
			updateSearchGuide({ key: searchFrom, param: state.rawSearch })
		);
	}, [state.rawSearch, dispatch, sliceDispatcher, searchFrom]);

	useEffect(() => {
		if (!searchFrom && setSearchFrom) {
			setSearchFrom(options.at(0));
		}
	}, [handleAddChip]);

	const handleEnterSearch = useCallback(
		(value) => {
			dispatch({ type: ACTION_TYPES.ENTER_SEARCH, payload: value });
			sliceDispatcher(updateSearchGuide({ key: searchFrom, param: value }));
		},
		[dispatch, sliceDispatcher, setSearchFrom, state.searchFrom]
	);

	useEffect(() => {
		const handler = (e) => {
			if (
				(state.openOptions &&
					menuRef.current &&
					!menuRef.current.contains(e.target)) ||
				(state.searchFor &&
					searchRef.current &&
					!searchRef.current.contains(e.target)) ||
				(state.searchFor &&
					floatingRef.current &&
					!floatingRef.current.contains(e.target)) ||
				(state.searchFor &&
					warnningRef.current &&
					!warnningRef.current.contains(e.target))
			) {
				dispatch({ type: ACTION_TYPES.CLICK_OUTSIDE });
			} else if (
				state.openOptions &&
				menuRef.current &&
				menuRef.current.contains(e.target)
			) {
				if (e.target.innerText === "Mentions") {
					handleEnterSearch(`@${currentUser?.name}`);
				} else if (e.target.innerText === "Contains Questions") {
					handleEnterSearch("?");
				} else {
					setSearchFrom(e.target.innerText);
					dispatch({
						type: ACTION_TYPES.CHOOSE_SEARCH_FROM,
						payload: e.target.innerText,
					});
				}
			}
		};
		document.addEventListener("mousedown", handler);
		document.addEventListener("touchstart", handler);
		return () => {
			// Cleanup the event listener
			document.removeEventListener("mousedown", handler);
			document.removeEventListener("touchstart", handler);
		};
	}, [
		state.openOptions,
		currentUser,
		searchRef,
		state.searchFor,
		setSearchFrom,
		handleEnterSearch,
	]);

	const handleDelete = (value) => {
		dispatch({ type: ACTION_TYPES.REMOVE_SEARCH_CHIP, payload: value });
		sliceDispatcher(removeSearchGuide(value));
	};

	const handleCloseFloatingInput = () => {
		dispatch({ type: ACTION_TYPES.CLOSE_FLOATING_INPUT });
	};

	useEffect(() => {
		// if search box is empty, reset sliceReducer. Its required if search box didn't emptied via handleDelete
		!state.search.length && sliceDispatcher(resetSearchGuide());
	}, [state.search, sliceDispatcher]);

	return (
		<Form onSubmit={(e) => e.preventDefault()}>
			<div onClick={handleClick}>
				<FilterListIcon style={{ marginRight: 15, cursor: "pointer" }} />
			</div>
			{state?.chips?.length > 0 && (
				<Stack direction="row" spacing={1}>
					{state?.chips?.map((chip, index) => (
						<ChipElement
							key={uuid()}
							chip={chip}
							index={index}
							handleDelete={handleDelete}
							searchFrom={searchFrom}
						/>
					))}
				</Stack>
			)}
			<WrapInput>
				<Input
					placeholder={state?.search ? "" : "Filter"}
					type="search"
					role="searchbox"
					value={state?.rawSearch}
					onClick={handleClick}
					onChange={handleWritingSearch}
				/>
				{state?.openOptions && (
					<OptionsMenu ref={menuRef}>
						{options.map((option) => (
							<Option key={uuid()}>{option}</Option>
						))}
					</OptionsMenu>
				)}
				{state?.searchFor && (
					<OptionsMenu>
						<Option ref={searchRef} onClick={handleAddChip}>
							{searchFrom
								? `${searchFrom} contains: '${state?.searchFor}'`
								: `search for '${state?.searchFor}'`}
						</Option>
					</OptionsMenu>
				)}
				{state?.warnning && (
					<OptionsMenu>
						<Option ref={warnningRef}>{state?.warnning}</Option>
					</OptionsMenu>
				)}
			</WrapInput>
			{state?.searchFrom && searchFrom && (
				<FloatingInput
					floatingRef={floatingRef}
					searchFrom={searchFrom}
					handleCloseFloatingInput={handleCloseFloatingInput}
					handleEnterSearch={handleEnterSearch}
				/>
			)}
		</Form>
	);
};

export default SearchBox;
