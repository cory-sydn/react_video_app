import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PortraitOutlinedIcon from "@mui/icons-material/PortraitOutlined";
import SwitchAccountOutlinedIcon from "@mui/icons-material/SwitchAccountOutlined";
import Brightness3OutlinedIcon from "@mui/icons-material/Brightness3Outlined";
import { logout } from "../../../redux/userSlice";
import { Link } from "react-router-dom";

const MenuContainer = styled.div`
	position: absolute;
	top: 36px;
	right: 10px;
	width: 300px;
	height: 450px;
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
	z-index: 10;
	color: ${({ theme }) => theme.text};
	background: ${({ theme }) => theme.bgLighter};
	border: 1px solid ${({ theme }) => theme.soft};
	border-top: transparent;
`;

const Menu = styled.section`
	width: 300px;
	height: 450px;
	display: flex;
	flex-direction: column;
`;

const Header = styled.header`
	display: flex;
	padding: 8px 20px 15px;
	border-bottom: 1px solid ${({ theme }) => theme.soft};
`;

const Container = styled.div`
	font-size: 14px;
	padding-top: 1px;
	text-align: left;
	overflow-x: hidden;
	overflow-y: scroll;
	overscroll-behavior: none;
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

const Wrapper = styled.div`
	width: 300px;
	padding: 8px 0 16px 0;
	flex-basis: 1e-9px;
`;

const Title = styled.h2`
	margin-left: 10px;
	font-size: 18px;
	font-weight: 500;
	text-transform: capitalize;
`;
const Img = styled.img`
	width: 42px;
	height: 42px;
	border-radius: 50%;
	object-fit: cover;
	cursor: pointer;
`;

const BlankImg = styled.button`
	width: 42px;
	height: 42px;
	border-radius: 50%;
	display: grid;
	place-content: center;
	color: white;
	background: #0a413c;
	border: transparent;
	font-family: sans-serif, Arial, Helvetica;
	font-size: 18px;
	font-weight: 500;
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
`;

const Hr = styled.hr`
	width: 100%;
	height: 8px;
	border: transparent;
	border-bottom: 1px solid ${({ theme }) => theme.soft};
	margin-bottom: 8px;
`;

const DropDown = ({ setOpen, menuRef }) => {
	const user = useSelector((state) => state.user.currentUser);
	const dispatch = useDispatch();

	const handleSignout = () => {
		dispatch(logout());
		return setOpen(false);
	};

	return (
		<MenuContainer ref={menuRef}>
			<Menu>
				<Header>
					{user &&
						(user.imgUrl === undefined ? (
							<BlankImg>{user.name[0].toUpperCase()}</BlankImg>
						) : (
							<Img src={user.imgUrl} alt="" />
						))}
					<Title>{user && user.name} </Title>
				</Header>
				<Container>
					<Wrapper>
						<Item>
							<PortraitOutlinedIcon /> Your channel
						</Item>
						<Link to="/">
							<Item>
								<SwitchAccountOutlinedIcon /> Swicth account
							</Item>
						</Link>
						{user && (
							<Item onClick={handleSignout}>
								<LogoutOutlinedIcon /> Sign out
							</Item>
						)}
						<Hr />
						<Item>
							<Brightness3OutlinedIcon /> Appearance:
						</Item>
						1 Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Consequuntur vitae iusto doloremque reprehenderit quod! Nesciunt
						molestiae et impedit. Doloremque amet necessitatibus possimus,
						labore suscipit optio earum velit corporis temporibus quos! 2
						Commodi quia impedit recusandae, corporis perspiciatis nesciunt?
						Odit nisi soluta velit voluptatibus dolores exercitationem,
						deserunt, rerum in nulla deleniti doloribus veritatis quidem maiores
						consequuntur sunt cumque aut, dolore eum quaerat? 3 Lorem ipsum
						dolor sit, amet consectetur adipisicing elit. Atque eveniet
						recusandae impedit rerum quo iste inventore magni neque, dignissimos
						a omnis quas dolorum ad ex maxime, iure maiores tenetur illo. 4
						Pariatur quis consequatur cum harum reiciendis! Temporibus molestiae
						quidem voluptatem, delectus quia eum deleniti eius quis quam, beatae
					</Wrapper>
				</Container>
			</Menu>
		</MenuContainer>
	);
};

export default DropDown;
