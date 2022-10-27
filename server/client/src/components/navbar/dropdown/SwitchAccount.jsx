import React from 'react'
import styled from 'styled-components'
import ProfileImg from '../../../utils/constants/ProfileImg'
import { Container } from './Selector'
import { Item } from './DropDown'
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const Info = styled.div`
  display: grid;
  place-content: left;
  height: 56px;
  text-align: left;
  border-bottom: 1px solid #aaa5;
  margin: 0 15px 10px;
`;

const Span = styled.span`
  margin-top: -10px;
`;

const SwitchAccount = ({ user, handleSignout }) => {
  return (
    <Container style={{padding: "15px 0 10px"}} >
      <Info>
        <h5>{user.name} </h5>
        <Span>{user.email} </Span>
      </Info>
      <Info style={{display: "flex"}}>
        <ProfileImg size={48} img={user.img} name={user.name} />
        <Info style={{borderBottom: "none", marginLeft: 15}} >
          <h5>{user.name} </h5>
          <Span>
            {user?.subscribers > 0 ? user.subscribers : "No"}
            {" subsribers"}{" "}
          </Span>
        </Info>
      </Info>
      <Item onClick={handleSignout}>
        <LogoutOutlinedIcon /> Sign out
      </Item>
    </Container>
  )
}

export default SwitchAccount