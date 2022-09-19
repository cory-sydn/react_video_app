import React from 'react'
import IonFlagOutline from '../../icons/IonFlagOutline.jsx';
import MdiLightPencil from '../../icons/MdiLightPencil.jsx';
import { useSelector } from "react-redux"
import { Container, 
  OptionsContainer,
  Option } from '../../components/comment/Options';

const Options = ({ video, optionRef, setEditOpen, warnRef, secondCheck, setSecondCheck, setOpenOptions, close }) => {
  const {currentUser} = useSelector(state => state.user)

  return (
    <Container>
      <OptionsContainer ref={optionRef}>
        {currentUser?._id === video.userId ? (
          <>
            <Option onClick={() => setEditOpen(true)} ><MdiLightPencil style={{marginRight: 10}}/>Edit</Option>
          </>
        )  : (
          <Option><IonFlagOutline style={{marginRight: 10}} />Report</Option>
        )}
      </OptionsContainer>         
    </Container>
  )
}

export default Options