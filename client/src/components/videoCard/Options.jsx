import React from 'react'
import IonFlagOutline from '../../icons/IonFlagOutline.jsx';
import MdiLightPencil from '../../icons/MdiLightPencil.jsx';
import { useSelector } from "react-redux"
import { Container, 
  OptionsContainer,
  Option } from '../../components/comment/Options';
import { Link } from "react-router-dom";

const Options = ({ video, optionRef}) => {
  const {currentUser} = useSelector(state => state.user)

  return (
    <Container>
      <OptionsContainer ref={optionRef}>
        {currentUser?._id === video.userId ? (
          <Link to={`/channel/studio/${video.userId}/${video._id}`} replace>
            <Option><MdiLightPencil style={{marginRight: 10}}/>Edit</Option>
          </Link>
        )  : (
          <Option><IonFlagOutline style={{marginRight: 10}} />Report</Option>
        )}
      </OptionsContainer>         
    </Container>
  )
}

export default Options