import { useEffect, useState } from "react";
import styled from "styled-components";
import { Hr, LeftHr } from "../../comment/NewComment";
import { CloseBtn } from "../../../utils/constants/Upload";
import CloseIcon from "@mui/icons-material/Close";

const InputContainer = styled.div`
	position: absolute;
	top: 12px;
	left: 50px;
	width: 250px;
	border-radius: 3px;
	height: max-content;
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
	z-index: 45;
	background: ${({ theme }) => theme.bgDarker};
	color: ${({ theme }) => theme.text};
	border: ${({ theme }) => theme.edge};
	box-shadow: 0 1px 3px 0 #00000022;
`;

const Label = styled.label`
	width: 250px;
	padding: 10px 0 10px 15px;
	font-size: 13px;
	font-weight: 400;
	color: 1px solid ${({ theme }) => theme.textSoft};
	text-align: left;
`;

const Title = styled.h2`
	width: 250px;
	padding: 10px 15px;
	font-size: 18px;
	font-weight: 400;
	display: flex;
	justify-content: space-between;
	align-items: center;
	text-align: left;
	text-transform: capitalize;
`;

const InputArea = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	position: relative;
	padding-bottom: 10px;
	margin-inline: 15px;
`;

const Input = styled.input`
	width: 220px;
	height: 28px;
	padding: 4px 0 4px 0;
	caret-color: #3ea6ff;
	background: ${({ theme }) => theme.bgDarker};
	color: ${({ theme }) => theme.text};
	outline: none;
	border: none;
	border-bottom: 1px solid #717171;
`;

const ApplyButton = styled.div`
	color: ${(props) => (props.ready ? "#3ea6ff" : "#717171")};
	padding: 10px 30px;
	width: 100%;
	line-height: 30px;
	width: 100%;
	justify-content: flex-end;
	display: flex;
`;

const Line = styled.div`
	width: 100%;
	height: 1px;
	border-bottom: 1px solid ${({ theme }) => theme.textSoft};
	opacity: 0.3;
`;

const FloatingInput = ({
	floatingRef,
	searchFrom,
	handleCloseFloatingInput,
	handleEnterSearch,
}) => {
	const [focus, setFocus] = useState({ ready: false, line: false });
	const [value, setValue] = useState("");

	useEffect(() => {
		if (value) {
			setFocus((prev) => ({ ...prev, ready: true }));
		} else {
			setFocus((prev) => ({ ...prev, ready: false }));
		}
	}, [value, setFocus]);

	return (
		<InputContainer onSubmit={(e) => e.preventDefault()} ref={floatingRef}>
			<Title>
				{searchFrom}
				<CloseBtn>
					<CloseIcon
						onClick={handleCloseFloatingInput}
						sx={{ fontSize: 25, fontWeight: "bolder" }}
					/>
				</CloseBtn>
			</Title>
			<Line />
			<Label>contains </Label>
			<InputArea>
				<Input
					placeholder="Value"
					type="search"
					role="searchbox"
					value={value}
					onFocus={() => setFocus((prev) => ({ ...prev, line: true }))}
					onBlur={() => setFocus((prev) => ({ ...prev, line: false }))}
					onChange={(e) => setValue(e.target.value)}
					autoFocus={true}
				/>
				{focus.line && (
					<>
						<LeftHr style={{ bottom: 10, left: 95, width: 96 }} />
						<Hr style={{ bottom: 10, left: 95, width: 96 }} />
					</>
				)}
			</InputArea>
			<Line />
			<ApplyButton ready={focus.ready} onClick={() => handleEnterSearch(value)}>
				Apply
			</ApplyButton>
		</InputContainer>
	);
};

export default FloatingInput;
