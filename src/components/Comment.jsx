import React from 'react'
import styled from 'styled-components';
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";

const Container = styled.div`
    display: flex;
    margin-bottom: 20px ;
`

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 16px;
    border-radius: 50%;
`
const Details = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    color: ${({ theme }) => theme.text};
`

const Name = styled.span`
    font-size: 13px;
    font-weight: 500;
`

const Date = styled.span`
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.textSoft};
    margin-left: 5px;
`

const Text = styled.span`
    display: flex;
    text-align: left;
    font-size: 14px;
`
const Reactions = styled.div`
    font-size: 12px;
    display: flex;
`

const Button = styled.div`
    margin-inline: .75rem;
    cursor: pointer;
    display:flex;
    align-items: center;
`

const Span = styled.span`
    font-weight: 500;
    color: ${({ theme }) => theme.textSoft};
`

const Comment = () => {
  return (
    <Container>
        <Avatar src="https://yt3.ggpht.com/ytc/AKedOLQX4sFgnQGQO9qW8UpJFobW_mHmunCWorXnsWF-Bg=s48-c-k-c0x00ffffff-no-rj" ></Avatar>
        <Details>
            <Name>Vinayalk Guplta <Date>3 weeks ago</Date></Name>
            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga eius possimus perferendis autem exercitationem reprehenderit eveniet expedita, veniam quisquam nostrum laudantium. Dolorum iure quasi cumque commodi ad accusamus laborum dolores.</Text>
            <Reactions>
                <Button><ThumbUpOutlinedIcon fontSize='small' /><Span>&nbsp;12</Span></Button>
                <Button><ThumbDownOffAltOutlinedIcon fontSize='small' /></Button>
                <Button><Span>REPLY</Span></Button>
            </Reactions>
        </Details>
    </Container>
  )
}

export default Comment