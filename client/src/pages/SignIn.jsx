import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "../img/logo.png";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginFailed, loginStart, loginSuccessful } from "../redux/userSlice";
import { auth, googleProvider } from "../firebase.config";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import googleSvg from "../img/google.svg";
import { useNavigate } from "react-router-dom";

const Container = styled.section`
	min-height: calc(100vh - 56px);
	width: 100%;
	display: grid;
	flex-direction: column;
	place-content: center;
	background: ${({ theme }) => theme.bg};
	z-index: 3;
`;

const Form = styled.form`
	padding: 24px;
	border: 2px solid #434343;
	border-radius: 4px;
	background: ${({ theme }) => theme.bg};
	color: ${({ theme }) => theme.text};
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`;

const Header = styled.header`
	display: flex;
	align-items: center;
	margin-bottom: 1.5rem;
	font-weight: 600;
	letter-spacing: -1px;
`;

const Img = styled.img`
	height: 30px;
	padding: 0 0.25rem 0 0;
`;

const Text = styled.div`
	width: 100%;
	display: flex;
	align-items: flex-start;
`;

const Label = styled.label`
	position: absolute;
	left: -999999px;
`;

const InputWrapper = styled.div`
	width: 100%;
	display: grid;
	place-content: center;
	position: relative;
`;

const Icon = styled.div`
	top: 12px;
	left: 2px;
	transform: scale(0.8);
	position: absolute;
`;

const Input = styled.input`
	min-width: 240px;
	width: calc(240px + 15vmin);
	padding: 10px 10px 10px 30px;
	margin-block: 0.5rem;
	border-radius: 2px;
	background: ${({ theme }) => theme.commentButton.bg};
	color: ${({ theme }) => theme.text};
	border: none;
`;

const Button = styled.button`
	margin-bottom: 1.25rem;
	border-radius: 2px;
	padding: 10px 16px;
	background: ${({ theme }) => theme.bgLighter};
	color: ${({ theme }) => theme.text};
	cursor: pointer;
	border: 1px solid #434343;
	filter: sepia(18%);
	transition: all 0.3s ;
	box-shadow: 0 1px 3px 0 #88888899;
	&:hover {
		box-shadow: 0 1px 7px 0 #2c7ef3;
		transform: scaleY(1.05), translateY(3px)
	}
	&:active {
		box-shadow: 0 0 2px 0 #2c7ef3;
		transform: scaleY(1), translateY(0)
	}
`;

const More = styled.div`
	padding: 10px;
	display: flex;
	justify-content: space-between;
`;

const Span = styled.span`
	padding: 8px 12px;
	font-size: 12px;
	cursor: pointer;
	&:first-child {
		border: 1px solid #434343;
		border-radius: 4px;
	}
`;

const Error = styled.span`
	border: 1px solid orangered;
	border-radius: 4px;
	padding: 4px;
	font-weight: 500;
	font-size: 14px;
	color: #ff0000;
	background: #5c5c5c53;
	position: absolute;
	text-align: left;
	left: 83px;
	top: 0;
	width: 100%;
	height: 100%;
	width: 145px;
	max-width: 145px;
`;

const SinginWithGoogleBtn = styled.button`
	font-size: 16px;
	font-weight: 400;
	display: flex;
	align-items: center;
	margin-bottom: 1.25rem;
	border-radius: 2px;
	padding: 0 12px 0 0;
	background: #2c7ef3;
	color: white;
	cursor: pointer;
	border: 2px solid #2c7ef3;
	box-shadow: 0 0 4px 0.5px #88888899;
	&:hover {
		box-shadow: 0 0 9px 0 #2c7ef3;
	}
`;

const GoogleIcon = styled.img`
	background: white;
	width: 40px;
	height: 40px;
	padding: 10px;
	margin-right: 12px;
`;

const SignIn = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate()
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user);

	const handleSignIn = async () => {
		if (!name || !password) return;
		if (name.length < 4 || password.length < 4) return;
		dispatch(loginStart());
		try {
			const res = await axios.post(
				"http://localhost:8800/api/auth/signin",
				{ name, password },
				{
					withCredentials: true,
				}
			);
			dispatch(loginSuccessful(res.data));
			login(auth, res.data.email, password)
			navigate("/")
		} catch (err) {
			dispatch(loginFailed(err?.response?.data?.message));
		}
	};

	const googleSignIn = async () => {
		dispatch(loginStart());

		signInWithPopup(auth, googleProvider)
			.then( async(result) => {
				await axios.post("/auth/google", {
					name: result.user.displayName,
					email: result.user.email,
					img: result.user.photoURL
				})
				.then((res) => {
					dispatch(loginSuccessful(res.data))
					navigate("/")
				})
			})
			.catch((err) => {
				dispatch(loginFailed(err?.response?.data?.message))
				console.log(err);
			})
	};

	const handleSignUp = async () => {
		dispatch(loginStart())
		if (!name || !password) return;
		if (name.length < 4 || password < 9) return;
		try {
			register()
			const newUser = {	name, email, password,};
			const res = await axios.post("http://localhost:8800/api/auth/signup", newUser, {withCredentials: true, })
			dispatch(loginSuccessful(res.data))
			navigate("/")
		} catch (err) {
			console.log(err);
			dispatch(loginFailed(err?.response?.data?.message))
		}
	};

	async function register() {
		try {
			await createUserWithEmailAndPassword(auth, email, password)
		} catch (err) {
			dispatch(loginFailed(err?.response?.data?.message))
			console.log(err);
		}
	}

	async function login (auth, email, password) {
		try {
			await signInWithEmailAndPassword(auth, email, password)
		} catch (err) {
			dispatch(loginFailed(err))
		}
	}

	useEffect(()=> {
		document.title = "YouTube"
	}, []);

	return (
		<Container>
			<Form onSubmit={(e) => e.preventDefault()}>
				<Header>
					<Img src={Logo} className="img" alt="logo" />
					YouTube
				</Header>
				<Text>Sing in if you have an account</Text>
				<Label>User Name</Label>
				<InputWrapper>
					<Icon>
						<PersonIcon />
					</Icon>
					<Input
						placeholder="User Name"
						type="text"
						onChange={(e) => setName(e.target.value)}
						enterKeyHint="send"
					></Input>
				</InputWrapper>
				<Label>Password</Label>
				<InputWrapper>
					<Icon>
						<KeyIcon />
					</Icon>
					<Input
						placeholder="Password"
						type="password"
						onChange={(e) => setPassword(e.target.value)}
						enterKeyHint="send"
					></Input>
				</InputWrapper>
				<Button onClick={handleSignIn}>
					Sign in
					{currentUser?.error && <Error>{currentUser?.error} </Error>}
				</Button>
				<SinginWithGoogleBtn onClick={googleSignIn}>
					<GoogleIcon src={googleSvg} /> Sing in with Google{" "}
				</SinginWithGoogleBtn>
				<Text>Or create a new account</Text>
				<Label>User Name</Label>
				<InputWrapper>
					<Icon>
						<PersonIcon />
					</Icon>
					<Input
						placeholder="User Name"
						type="text"
						onChange={(e) => setName(e.target.value)}
					></Input>
				</InputWrapper>
				<Label>Email</Label>
				<InputWrapper>
					<Icon>
						<EmailIcon />
					</Icon>
					<Input
						placeholder="Email"
						type="email"
						onChange={(e) => setEmail(e.target.value)}
					></Input>
				</InputWrapper>
				<Label>Password</Label>
				<InputWrapper>
					<Icon>
						<KeyIcon />
					</Icon>
					<Input
						placeholder="Password"
						type="password"
						onChange={(e) => setPassword(e.target.value)}
					></Input>
				</InputWrapper>
				<Button onClick={handleSignUp} disabled={currentUser?.loading === true ? true : false } >Sign up</Button>
			</Form>
			<More>
				<Span>English (US) &#9660;</Span>
				<Span>Privaciy&ensp; &bull; &ensp;Terms</Span>
			</More>
		</Container>
	);
};

export default SignIn;
