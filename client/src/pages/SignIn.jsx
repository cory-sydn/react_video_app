import React from 'react'
import styled from 'styled-components'
import Logo from '../img/logo.png'
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';

const Container = styled.form`
    min-height: calc(100vh - 56px);   
    display: grid;
    flex-direction: column;
    place-content: center;
`

const Form = styled.form`
    padding: 24px;
    border: 2px solid #434343;
    border-radius: 4px;
    background: ${({theme})=>theme.bg};
    color: ${({theme}) => theme.text};
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`

const Header = styled.header`
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
`

const Img = styled.img`
    height: 30px;
    padding: 0 0.25rem 0 0.6rem;
`
const Text = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-start;
`

const Label = styled.label`
    position: absolute;
    left: -999999px;
`
const InputWrapper = styled.div`
    width: 100%;
    display: grid;
    place-content: center;
    position: relative;
`

const Icon= styled.div`
    top: 12px;
    left: 2px;
    transform: scale(0.8);
    position: absolute;
`
const Input = styled.input`
    min-width: 240px;
    width: calc(240px + 15vmin);
    padding: 10px 10px 10px 28px;
    margin-block: 0.5rem;
    border-radius: 2px;
    background: ${({theme})=>theme.commentButton.bg};
    color: ${({theme}) => theme.text};
    border: none;
`
const Button = styled.button`
    margin-bottom: 1.25rem;
    border-radius: 2px;
    padding: 10px 16px;
    background: ${({theme})=>theme.bgLighter};
    color: ${({theme}) => theme.text};
    cursor: pointer;
    border: 1px solid #434343;
    filter: sepia(18%);
    &:hover {
        transform: scaleY(2px);
    }
`
const More = styled.div`
    padding: 10px;
    display: flex;
    justify-content: space-between;
`

const Span = styled.span`
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    &:first-child {
        border: 1px solid #434343;
        border-radius: 4px;
    }
`


const SignIn = () => {
  return (
    <Container>
        <Form onSubmit={(e)=> e.preventDefault()}>
            <Header>
                <Img src={Logo} className="img" alt='logo' />FrogTube
            </Header>
            <Text>Sing in if you have an account</Text>
            <Label>User Name</Label>
            <InputWrapper>
                <Icon><PersonIcon /></Icon>
                <Input placeholder='User Name' type="text" ></Input>
            </InputWrapper>
            <Label>Password</Label>
            <InputWrapper>
                <Icon><KeyIcon /></Icon>
                <Input placeholder='Password' type="password" ></Input>
            </InputWrapper>
            <Button>Sign in</Button>
            <Text>or create a new account</Text>
            <Label>User Name</Label>
            <InputWrapper>
                <Icon><PersonIcon /></Icon>
                <Input placeholder='User Name' type="text"></Input>
            </InputWrapper>
            <Label>Email</Label>
            <InputWrapper>
                <Icon><EmailIcon /></Icon>
                <Input placeholder='Email' type="email" ></Input>
            </InputWrapper>
            <Label>Password</Label>
            <InputWrapper>
                <Icon><KeyIcon /></Icon>
                <Input placeholder='Password' type="password" ></Input>
            </InputWrapper>
            <Button>Sign up</Button>
        </Form>
        <More>
            <Span>English (US)  &#9660;</Span>
            <Span>Privaciy&ensp; &bull; &ensp;Terms</Span>
        </More>
    </Container>
  )
}

export default SignIn