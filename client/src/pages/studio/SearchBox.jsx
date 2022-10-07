import React from 'react'
import styled from "styled-components";
import FilterListIcon from '@mui/icons-material/FilterList';

const Form = styled.form`
  display: flex;
  align-items: center;
  padding-left: 10px;
`

const Input = styled.input`
	width: 100%;
	padding: 12px 18px 12px 25px;
  caret-color: #3ea6ff;
	background: ${({ theme }) => theme.bg};
  color:  ${({ theme }) => theme.text};
  border: none;
  outline: none;
`;

const SearchBox = ({ search, setSearch }) => {
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <FilterListIcon />
      <Input
        placeholder="Filter"
        type="text"
        role='searchbox'
        value ={search}
        onChange={(e) => setSearch(e.target.value)} 
        />
    </Form>
  )
}

export default SearchBox