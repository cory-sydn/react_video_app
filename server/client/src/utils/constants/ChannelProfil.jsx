import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Uploader } from "../functions/Uploader";
import ProfileImg from "./ProfileImg";
import { ProcessDisplay } from "../constants/Upload";
import { changeImg } from "../../redux/userSlice";
import { axiosInstance } from "../../apiConfig";

const Container = styled.form`
  position: relative;
  width: 80px;
  height: 80px;
`;

const HiddenInput = styled.input`
  display: none ;
`;

const ProfilUploaderLabel = styled.label`
  display: grid;
  place-content: center;
  position: absolute;
  top: 0;
  left:0;
  margin: auto;
  width: 100%;
  height: calc(100% - 2px);
  background: transparent;
  border: 2px solid transparent;
	border-radius: 50%;
  cursor: pointer;
  transition: all 0.4s linear ;
  &:hover{
    background: #f9f9f973;
    border: 2px dashed #3ea6ff;
  }
  animation: ${(props) => props.state > 0 && "pulse 3s linear infinite"};
  background: ${(props) => props.state > 0 && "linear-gradient(120deg, #e3227fa5, #e1f073b9, #b01fc6c1)"};
  background-size: ${(props) => props.state > 0 && "10000% 10000%"};
  @keyframes pulse {
    0%{background-position:0% 57%}
    50%{background-position:100% 44%}
    100%{background-position:0% 57%}
  }
  z-index: 2;
`;

const ChannelProfil = ({channel}) => {
  const [file, setFile] = useState("")
  const [icon, setIcon] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const [uploadTask, setUploadTask] = useState([])
  const [imageUrl, setImageUrl] = useState("")
  const dispatch = useDispatch()
  const {currentUser} = useSelector(state => state.user)

  const handleUploadProfile = useCallback(async(file, previousData) => {
    file && await Uploader(file, setUploadTask, setPercentage, setImageUrl, previousData)
    setFile("")
  },[])

  useEffect(()=> {
    async function saveUrl () {
      const res = await axiosInstance.put(`/users/${channel._id}`, {img: imageUrl}, {withCredentials:true})
      res.status === 200 && dispatch(changeImg(res.data.img))
      setImageUrl("")
      setPercentage(0)
    }
    imageUrl !== "" && saveUrl()
  }, [dispatch, imageUrl, channel._id])

  useEffect(()=> {
    const previousData = currentUser?.img
    file && handleUploadProfile(file, previousData)
  }, [file, handleUploadProfile, currentUser?.img])

  return (
    <Container
      encType='multipart/form-data'
      onSubmit={(e) => e.preventDefault()}
      >
      {<div style={{zIndex: 1}} >
        <ProfileImg size={78} img={channel?.img} name={channel?.name}/>
      </div>}
      {currentUser?._id === channel?._id && (
        <>
          <ProfilUploaderLabel htmlFor="profile" onMouseEnter={() => setIcon(true)}  onMouseLeave={() => setIcon(false)} state={percentage} >
            {icon && <FileUploadIcon sx={{fontSize: 60, color: "#3ea5ff",}} />}
            {uploadTask._state === "running" && percentage > 0 && ( 
              <ProcessDisplay percentage={Math.round(percentage)} style={{transform: "scale(0.8)"}} ></ProcessDisplay> 
            )}
          </ProfilUploaderLabel>
          <HiddenInput 
            id="profile"
            type="file"
            name='profile'
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </>
      )}
    </Container>
  )
}

export default ChannelProfil