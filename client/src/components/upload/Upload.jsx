import React, { useState, useEffect, useCallback } from 'react'
import axios from "axios"
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { ThemeProvider } from '@mui/material';
import { muiUploader } from '../../utils/muiTheme';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import WarningMessage from './WarningMessage';
import Darkness from '../../utils/constants/Darkness';

export const Container = styled.div`
  &::after,::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

export const Wrapper = styled.section`
  margin: 0;
  padding: 0;
  position: absolute;
  display: grid;
  justify-content: center;
  top: -8px;
  right: -16px;
  width: calc(100vw - 0px);
  height: 100vh;
  background: #0006;
  overflow: hidden;
  z-index: 31;
`;

export const UploaderBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  background: ${({ theme }) => theme.uploader};
  width: 1000px;
  height: 600px;
  border-radius: 6px;
  overflow-y: hidden;
  position: relative;
  z-index: 32;
`;

export const UploaderHeader = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  height: 56px;
  width: 100%;
  padding: 10px 20px 10px;
	border-bottom: 1px solid ${({ theme }) => theme.soft};
  box-shadow: 0 1px 2px #00000045;
`;

export const UploaderFooter = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.uploader};
  height: 56px;
  width: 100%;
  padding: 10px 10px 10px 40px;
  z-index: 33;
	border-top: 1px solid ${({ theme }) => theme.soft};
  box-shadow: 0 -1px 2px #00000045;
`;

export const HeaderTitle = styled.h3`
  margin-top: 8px;
`;

export const CloseBtn = styled.button`
  border: none;
  outline: none;
  background: transparent;
  margin-top: 3px;
  color: ${({ theme }) => theme.textSoft};
  cursor:pointer;
`;

export const UploadVideoForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const UploadLabel = styled.label`
  display: grid;
  place-content: center;
  height: 140px;
  width: 140px;
  border-radius: 50%;
  margin-top: 15vmin;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.textSoft};
  cursor: pointer;
  &:hover{
    animation: wawe 3s cubic-bezier(0.165, 0.84, 0.44, 1) both infinite;
    @keyframes wawe {
      0%{
        box-shadow: 0 0 2px 0 #3ea5ff76;
      }
      33%{
        box-shadow: 0 0 5px 0 #3ea5ffcb;
      }
      50%{
        box-shadow: 0 0 5px 0 #3ea5ffcb;
      }
      100%{
        box-shadow: 0 0 2px 0 #3ea5ff76;
      }
    }
  }
`;

const UploadVideoButton = styled.label`
  width: 160px;
  margin-top: 40px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 2px;
  background:#3ea6ff;
  color: ${({theme})=>theme.bg};
  cursor: pointer;
`;

const Text = styled.p`
  margin-top: 24px;
`;

const Span = styled.span`
  color: ${({ theme }) => theme.textSoft};
  margin-top: 10px;
  font-size: 13px;
`;

export const HiddenInput = styled.input`
  display: none ;
`;

export const Divided = styled.div`
  width: 100%;
  height: 488px;
  display: flex;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
	overscroll-behavior: none;
  border-right: 2px solid ${({ theme }) => theme.uploader};
  &::-webkit-scrollbar{
    width: 8px;
    background: ${({ theme }) => theme.uploader};
  }
  &::-webkit-scrollbar-thumb {
    background: #909090;
    border-radius: 8px;
  }
`;

export const Title3 = styled.h3`
  width: 100%;
  text-align: left;
  margin-top: 8px;
  margin-bottom: 20px;
`;

export const Title4 = styled(Title3)`
  font-size: 16px;
  margin-bottom: 10px;
`;

export const Left = styled.div`
  width:63%;
  height: 100%;
  padding: 30px 20px 30px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 32;
`;

export const Right = styled.div`
  position: sticky;
  top: 0;
  right: 0;
  width: 37%;
  padding: 20px;
  display: grid;
  place-content: center;
  padding-right: 15px;
  border-right: 2px solid ${({ theme }) => theme.uploader};
`;

export const DetailsForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.uploader};
  color: ${({theme})=> theme.text};
  border-radius: 4px;
  margin-bottom: 24px;
  padding: 12px 18px;
  border: 1px solid  ${({ theme }) => theme.textSoft};
  &:focus {
    border: 1px solid transparent;
    outline: 1px solid #3ea6ff;
  }
`;

export const DescInput = styled.textarea`
  width: 100%;
  overflow: auto;
  resize: none;
  outline: none;
  line-height: _px; // thanks to _px textarea padding works
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 500;
  background: ${({ theme }) => theme.uploader};
  color: ${({theme})=> theme.text};
  border-radius: 4px;
  border: 1px solid  ${({ theme }) => theme.textSoft};
  padding: 12px 18px;
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: none;
  &:focus {
    border: 1px solid transparent;
    outline: 1px solid #3ea6ff;
  }
  &::-webkit-scrollbar{
    width: 8px;
    background: ${({ theme }) => theme.dropDown.active};
    border-radius: 0 4px 4px 0;
  }
  &::-webkit-scrollbar-thumb {
    background: #909090;
    border-radius: 6px;
  }
`;

export const ThumbnailInputLabel = styled.label`
  display: grid;
  place-content: center;
  margin-top: 10px;
  width: 160px;
  height: 90px;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.uploader};
  border: 1px dashed ${({ theme }) => theme.textSoft};
  padding: 10px 12px;
  margin-bottom: 24px;
  position: relative;
  cursor: pointer;
  &:focus {
    border: 1px solid transparent;
    outline: 1px solid #3ea6ff;
  }
`;

export const AddImageIcon = styled(AddPhotoAlternateIcon)`
  place-self: center;
  margin: 5px 0 10px 0;
`;

export const ThumbnailImg = styled.img`
  width: 160px;
  height: 90px;
  border: 2px solid #151525;
  object-fit: cover;
  object-position: 0, 0;
  position: absolute;
  top: -1px;
  left: -1px;
  &:hover {
    transition: all 0.35s ease-in-out;
    width: 320px;
    height: 180px;
    z-index: 34;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
  min-height: 250px;
  height: 100%;
  mask-image: linear-gradient(#363636f4 94%, #4c4c4c20 );
  isolation: isolate;
  background: ${({ theme }) => theme.bg};
  border-radius: 5px;
`;

export const Screen = styled.div`
  display: grid;
  place-content: center;
  background-color: #080808;
  color: white;
  width: 100%;
  min-height: 170px;
  border-radius: 5px 5px 0 0;
  font-size: 14px;
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  margin-block: 10px;
  padding: 5px 15px;
  font-size: 14px;
`;

export const ItemTitle = styled.p`
  font-size: 13px;
  width: 100%;
  padding-bottom: 10px;
  text-align: left;
  color: ${({ theme }) => theme.textSoft};
`;

export const ItemExplain = styled(ItemTitle)`
  font-size: 14px;
  font-weight: 400;
`;

export const VideoLink = styled.p`
  font-size: 12px;
  color: #3ea6ff;
`;

export const ProcessDisplay = styled.div`
  width: 100px;
  height: 10px;
  border-radius: 30px;
  background: ${({ theme }) => theme.textSoft};
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 0 #ffffff60, inset 0 2px 3px rgba(0,0,0,0.3);
  &::before{
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height:100%;
    width: ${(props) => (props.percentage > 0 ? `${props.percentage}px` : 0)};
    background: linear-gradient(#6ebafd , #3ea6ff);
    box-shadow: inset 0 1px 0 #ffffff60, 0 4px 5px rgba(0,0,0,0.3);
    border-radius: 30px;
  }
  &::after {
    content: "";
    position: absolute;
    left:0;
    top: 0;
    height:100%;
    width: ${(props) => (props.percentage > 0 ? `${props.percentage}px` : 0)};
    background: linear-gradient(300deg, #88c7ff, #3ea6ff);
    animation: flow cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
    animation-duration: ${(props) => props.percentage === 300 ? 0 : `calc(30ms * ${props.percentage})`};
    border-radius: 30px;
  }
  @keyframes flow {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }
`;

const Buttons = styled.div`
  display: flex;
`;

export const ConfirmButton = styled.button`
  text-transform: uppercase;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  border: ${(props) => props.suspendConfirm ? "1px solid #919191aa" : "1px solid #3ea6ff"};
  background: ${(props) => props.suspendConfirm ? "#919191aa" : "linear-gradient(#65b7ff 15% , #3ea6ff 100%)"};
  border-radius: 3px;
  color: ${({ theme }) => theme.uploader};
  //cursor: ${(props) => props.suspendConfirm ? "progress" : "pointer"};
  filter: brightness(100%);
  transition: filter 0.3s ease-in-out;
  &:hover {
    transition: filter 0.3s ease-in-out;
    filter: brightness(85%);
  }
`;

const CancelButton = styled(ConfirmButton)`
  background: linear-gradient(#fb3232 20%, red 100%);
  border: 1px solid red;
  color: #c0c0c0;
  margin-right: 25px;
`;

export const VideoFrame = styled.video`
  width: 100%;
  height: 100%;
	object-fit: scale-down;
  background-origin: 0 0;
`;

const Upload = ({activeUpload, setActiveUpload, setOpenUpload}) => {
  const [warning, setWarning] = useState({state: false, message: ""})
  const [secondCheck, setSecondCheck] = useState(false)
  const [file, setFile] = useState({video: null, img: null})
  const [videoPercent, setVideoPercent] = useState(0)
  const [imagePercent, setImagePercent] = useState(0)
  const [videoUploadTask, setVideoUploadTask] = useState([])
  const [imageUploadTask, setImageUploadTask] = useState([])
  const [videoDetails, setVideoDetails] = useState({
    title: "",
    desc: "",
    imgUrl: "",
    videoUrl: "",
    tags: []
  });
  const [darkEffect, setDarkEffect] = useState(false)
  const [suspendConfirm, setSuspendConfirm] = useState(true)
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setFile((prev) => ({...prev, video: e.dataTransfer.files[0]}))
  }

  const uploadFiles = useCallback(async(file, dataType) => {
    const storage = getStorage();
    try {
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName);
    
      const uploadTask = uploadBytesResumable(storageRef, file)
      dataType === "videoUrl" ? setVideoUploadTask(uploadTask) : setImageUploadTask(uploadTask)
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;          
          dataType === "videoUrl" ? setVideoPercent(progress) : setImagePercent(progress)
          switch (snapshot.state) {
            case 'paused':
              console.log(` ${dataType} upload is paused`);
              break;
            case 'running':
              console.log(`${dataType} upload is running`);
              break;
            default:
              break;
          }
        }, 
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(`${dataType} available at`, downloadURL);
            setVideoDetails(prev => ({...prev, [dataType]: downloadURL}))
          });
        }
      )
    } catch (err) {
      console.log(err);
    }
  }, [])

  const handleInput = (e) => {
    e.preventDefault()
    if (e.target.name === "tags") {
      const processed = e.target.value.split(",").map((el)=> {
        // Allowing the storage of just letters and numbers on the DB.
        const trimmed = el.trim().replace(/[^a-z,'0-9\s]+/gi, '')
        return trimmed[0]?.toUpperCase() + trimmed.slice(1)
      })
      const filtered = processed.filter((el)=> (el !== null && el !== "undefined") )
      setVideoDetails(prev => ({...prev, tags: filtered}))
    } else {
      setVideoDetails(prev => ({...prev, [e.target.name]: e.target.value.trim()}));
    }
    // textarea auto expand functionality
    e.target.style.removeProperty("height");
    e.target.style.height = e.target.scrollHeight + 2 + "px";
  }

  useEffect(() => {
    file.video && uploadFiles(file.video, "videoUrl")
  }, [file.video, uploadFiles])

  useEffect(() => {
    file.img && uploadFiles(file.img, "imgUrl")
  }, [file.img, uploadFiles])
  
  const handleConfirm = async(e) => {
    e.preventDefault()
    // register video with the firebase cloud storage urls and with the videoDetails at MongoDB
    if (videoPercent < 100 && videoDetails.videoUrl === "") return setWarning({state: true, message: "Video uploading is not finished yet!"})
    try {
      const res = await axios.post("http://localhost:8800/api/videos", {...videoDetails}, {withCredentials:true})
      setOpenUpload(false)
      res.status === 200 && navigate(`/video/${res.data._id}`)
    } catch (err) {
      console.log(err);
      err.response.data.message && setWarning({state: true, message: err?.response?.data?.message})
    }
  }

  const handleCancel = () => {
    if (!secondCheck){
      setWarning({state: true, message: "Are you sure?\n\nWhole progress will be lost!"})
      setSecondCheck(true)
    } else {
      videoPercent && (videoPercent < 100
        ? (videoUploadTask.cancel())
        : (removeFromStorage(videoUploadTask._ref)));
      imagePercent && (imagePercent < 100
        ? (imageUploadTask.cancel())
        : (removeFromStorage(imageUploadTask._ref)));
      setOpenUpload(false)
    }
  }

  const removeFromStorage = (storageRef) => {
    deleteObject(storageRef).then(()=> {
      console.log(`${(storageRef.name).slice(13, -1)} is successfully deleted from the storage`);
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    if(warning.state ){
      setDarkEffect(true)
    } else {
      setTimeout(() => {
        setDarkEffect(false)
      }, 400)
    }
  }, [darkEffect, warning.state])

  const closeComponent = () => {
    // upload component stay mounted and preserves state values
    if (videoPercent > 0) return setActiveUpload(false); 
    setActiveUpload(false);
    setOpenUpload(false)
  }

  useEffect(() => {
    // verify that there is no empty space before confirm
    const array = []
    Object.values(videoDetails).map((el)=> {return array.push(el.length)})
    array.every(el => el > 0) && setSuspendConfirm(false)
  }, [videoDetails])

  return (
    <Container>
      {activeUpload && (
        <Wrapper>
          <UploaderBox>
            <UploaderHeader>
              <HeaderTitle>{videoDetails?.title ? videoDetails?.title : "Upload Videos"}</HeaderTitle>
              <CloseBtn>
                <CloseIcon onClick={closeComponent} sx={{fontSize:27, fontWeight:"bolder"}} />
              </CloseBtn>
            </UploaderHeader>
            {!videoPercent ? (
                <UploadVideoForm
                  encType='multipart/form-data'
                  htmlFor="upload"
                  onDrop={handleDrop}
                  onDragOver={handleDrop}
                  onSubmit={(e) => e.preventDefault()}
                  accept="video/*"
                  >
                  <UploadLabel htmlFor="upload">
                    <ThemeProvider theme={muiUploader} >
                      <FileUploadIcon />
                    </ThemeProvider>
                  </UploadLabel>
                  <Text>Drag and drop video files to upload</Text>
                  <Span>Your videos will be private until you publish them.</Span>
                  <UploadVideoButton htmlFor="upload" encType='multipart/form-data' >SELECT FILES</UploadVideoButton>
                  <HiddenInput
                    id='upload'
                    type="file"
                    onChangeCapture={(e)=> setFile(prev => ({...prev, video: e.target.files[0]}))}
                    accept="video/*"
                    />
                </UploadVideoForm>
              ) : (
                <>
                  <Divided>
                    <Left>
                      <DetailsForm
                        encType='multipart/form-data'
                        >
                        <Title3>Details</Title3>
                        <Input
                          defaultValue={videoDetails?.title}
                          name='title'
                          type="text"
                          maxlength="100"
                          placeholder={file?.name}
                          onChange={handleInput}
                        />
                        <DescInput
                          defaultValue={videoDetails?.desc}
                          name='desc'
                          rows="5"
                          padding="15px"
                          type="text"
                          placeholder="Tell viewers about your video"
                          onChange={handleInput}
                        />
                        <Title4>Thumbnail</Title4>
                        <ItemExplain>Select or upload a picture that shows what's in your video. A good thumbnail stands out and draws viewers' attention.</ItemExplain>
                        <ThumbnailInputLabel
                          name='imgUrl'
                          htmlFor="thumbnail"
                          >
                          {imagePercent > 0 && imagePercent < 100 ? ( 
                              <ProcessDisplay percentage={Math.round(imagePercent)}></ProcessDisplay> 
                            ) : imagePercent === 100 && videoDetails.imgUrl ? (<ThumbnailImg src={videoDetails?.imgUrl}></ThumbnailImg>  
                            ) : (
                              <>
                                <AddImageIcon />
                                <ItemTitle>Upload Thumbnail</ItemTitle> 
                              </>
                          )}
                        </ThumbnailInputLabel>                        
                        <HiddenInput
                          id="thumbnail"
                          type="file"
                          name='thumbnail'
                          onChange={(e) => setFile( (prev) => ({...prev, img: e.target.files[0]}))}
                          accept="image/*"
                        />
                        <Title4>Tags</Title4>
                        <ItemExplain>Tags can be useful when it comes to searching and recommendation, especially if content in your video is commonly misspelled.<br/><br/>Please separate the tags with commas.</ItemExplain>
                        <Input
                          defaultValue={videoDetails?.tags}
                          name='tags'
                          type="text"
                          maxlength="500"
                          placeholder="music, comedy, business, ..."
                          onInput={(e) => e.target.value = e.target.value.replace(/[^a-z,#'0-9\s]+/gi, "")}
                          onChange={handleInput}
                        />
                      </DetailsForm>
                    </Left>
                    <Right>
                      <Card>
                        <Screen>
                          {videoPercent < 100 ? ("Uploading " + Math.round(videoPercent) + "% ..."
                            ) : (
                            <VideoFrame src={videoDetails.videoUrl} poster={videoDetails?.imgUrl} controls />
                          )}
                        </Screen>
                        <Item>
                          <ItemTitle>Video Link</ItemTitle>
                          <VideoLink>{videoDetails?.videoUrl}</VideoLink> 
                        </Item>
                        <Item>
                          <ItemTitle>Video Title</ItemTitle>
                          {videoDetails?.title}
                        </Item>
                      </Card>                      
                    </Right>                    
                  </Divided>
                  <UploaderFooter>
                    <ProcessDisplay percentage={Math.round(videoPercent * 3)} style={{width: 300, height: 20}} ></ProcessDisplay>
                    <Buttons>
                      <CancelButton onClick={handleCancel}>
                        cancel
                      </CancelButton>
                      <ConfirmButton 
                        onClick={handleConfirm}
                        onBlur={()=>setWarning((prev)=>({...prev, state: false}))}
                        disabled={suspendConfirm}
                        style={{cursor: suspendConfirm ? "not-allowed" : "pointer"}}
                        suspendConfirm={suspendConfirm}
                        >
                        confirm
                      </ConfirmButton>
                    </Buttons>
                  </UploaderFooter>
                </>
              )
            }
          </UploaderBox>
        </Wrapper>
      )}
      {warning.state && (
        <WarningMessage 
          message={warning.message}
          secondCheck={secondCheck}
          setSecondCheck={setSecondCheck}
          setWarning={setWarning}
          handleCancel={handleCancel}
        />)}
      {darkEffect && (
        <Darkness status={warning.state} />
      )}
    </Container>
  )
}

export default Upload