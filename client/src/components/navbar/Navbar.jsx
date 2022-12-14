import React, { useCallback, useEffect, useState } from "react";
import Logo from "../../img/logo.png";
import styled from "styled-components";
import MenuSharpIcon from "@mui/icons-material/MenuSharp";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import Profile from "./profile/Profile";
import GlowingButton from "../../utils/constants/GlowingButton";

const Container = styled.div`
	position: sticky;
	top: 0;
	display: flex;
	align-items: center;
	background: ${({ theme }) => theme.bgLighter};
	box-shadow: inset 0 -1px 1px 0 #00000018;
	padding: 8px 16px;
	z-index: 40;
`;

const Wrapper = styled.div`
	margin-left: 190px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	@media (max-width: 650px) {
		margin-left: 158px;
	}
	@media (max-width: 530px) {
		margin-left: 90px;
	}
`;

export const Header = styled.div`
	font-family: "Roboto Condensed", Arial, Helvetica, sans-serif;
	margin: 8px 0 0 16px;
	font-size: 1.25em;
	display: flex;
	align-items: center;
	gap: 5px;
	position: absolute;
	top: 3px;
	left: 0;
	font-weight: 600;
	letter-spacing: -1px;
`;

export const HamburgerBtn = styled.button`
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.bgLighter};
	border: none;
`;

const Navbar = ({ setSidebar }) => {
	const [disappear, setDisappear] = useState(false);

	const handleDisappear = useCallback(() => {
		if (window.innerWidth < 531) return setDisappear(true);
		setDisappear(false);
	}, []);

	useEffect(() => {
		window.addEventListener("resize", handleDisappear);
		window.addEventListener("load", handleDisappear);
		return () => {
			window.removeEventListener("resize", handleDisappear);
			window.removeEventListener("load", handleDisappear);
		};
	});

	return (
		<Container>
			<Wrapper>
				<Header>
					<HamburgerBtn onClick={() => setSidebar(true)}>
						<GlowingButton
							style={{ marginRight: 10 }}
							icon={<MenuSharpIcon />}
						/>
					</HamburgerBtn>
					<Link to="/" className="logo" cursor="pointer">
						<img src={Logo} className="img" alt="" />
						{!disappear && "YouTube"}
					</Link>
				</Header>
				<SearchBar />
				<Profile />
			</Wrapper>
		</Container>
	);
};

export default Navbar;
