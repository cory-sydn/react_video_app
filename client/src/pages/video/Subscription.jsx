import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import axios from "axios";
import { subscription } from "../../redux/userSlice";
import Warning from "../../components/Warning";

const Container = styled.div`
	line-height: 39px;
	display: flex;
	float: right;
	align-items: center;
	font-size: 16px;
`;

const Join = styled.button`
	border: 1px solid #3ea6ff;
	color: #3ea6ff;
	background: transparent;
	border-radius: 2px;
	padding: 10px 16px;
	font-weight: 600;
	height: 37px;
	cursor: pointer;
`;

const Subscribe = styled.button`
	color: #ffffff;
	background:#cc0000;
	height: 37px;
	margin-inline: 16px;
	border: none;
	font-weight: 600;
	border-radius: 2px;
	padding: 10px 16px;
	cursor: pointer;
	position: relative;
`;

const Subscribed = styled(Subscribe)`
	color: ${({ theme }) => theme.subscription.color};
	background: ${({ theme }) => theme.subscription.bg};
`

const Subscription = ({channel, setChannel}) => {
	const [warn, setWarn] = useState(false);
	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const handleSubscribe = async() => {
		try {
			!currentUser.subscribedUsers.includes(channel._id) 
				? await axios.put(`http://localhost:8800/api/users/sub/${channel._id}`,{}, { withCredentials: true })
				: await axios.put(`http://localhost:8800/api/users/unsub/${channel._id}`,{}, { withCredentials: true });
			dispatch(subscription(channel._id))
		} catch (err) {
			console.log(err);
		}
	}

	const handleWarn = (boolean) => {
		if (currentUser) return
		setWarn(boolean)
	}

	return (
		<Container>
			{!currentUser && (
				<Subscribe
					onFocus={() => handleWarn(true)}
					onBlur={() => handleWarn(false)}
				>
					SUBSCRIBE
					{warn && (
						<Warning
							title={"Want to subscribe to this channel?"}
							text={"subscribe to this channel."}
						/>
					)}
				</Subscribe>
			)}
			{currentUser && (
				<>
					{currentUser?.subscribedUsers.includes(channel?._id) ? (
						<>
							<Join>JOIN</Join>
							<Subscribed onClick={handleSubscribe}>SUBSCRIBED</Subscribed>
							<NotificationsActiveOutlinedIcon cursor="pointer" />
						</>
					) : (
						<Subscribe onClick={handleSubscribe}>SUBSCRIBE</Subscribe>
					)}
				</>
			)}
		</Container>
	);
};

export default Subscription;
