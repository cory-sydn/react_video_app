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

const Container = styled.div`
  &::after,::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Wrapper = styled.section`
  margin: 0;
  padding: 0;
  position: absolute;
  display: grid;
  justify-content: center;
  top: -10px;
  right: -16px;
  width: calc(100vw - 8px);
  height: 100vh;
  background: #0006;
  overflow: hidden;
  z-index: 11;
`;

const UploaderBox = styled.div`
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
  z-index: 12;
`;

const UploaderHeader = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  height: 56px;
  width: 100%;
  padding: 10px 20px 10px;
	border-bottom: 1px solid ${({ theme }) => theme.soft};
`;

const UploaderFooter = styled.footer`
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
  z-index: 13;
	border-top: 1px solid ${({ theme }) => theme.soft};
`;

const HeaderTitle = styled.h3`
  margin-top: 8px;
`;

const CloseBtn = styled.button`
  border: none;
  outline: none;
  background: transparent;
  margin-top: 3px;
  color: ${({ theme }) => theme.textSoft};
  cursor:pointer;
`;

const UploadVideoForm = styled.form`
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
    animation: glow 3s cubic-bezier(0.165, 0.84, 0.44, 1) both infinite;
    @keyframes glow {
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

const HiddenInput = styled.input`
  display: none ;
`;

const Divided = styled.div`
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

const Title3 = styled.h3`
  width: 100%;
  text-align: left;
  margin-top: 8px;
  margin-bottom: 20px;
`;

const Title4 = styled(Title3)`
  font-size: 16px;
  margin-bottom: 10px;
`;

const Left = styled.div`
  width:63%;
  height: 100%;
  padding: 30px 20px 30px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 12;
`;

const Right = styled.div`
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

const DetailsForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
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

const DescInput = styled.textarea`
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
  &:focus {
    border: 1px solid transparent;
    outline: 1px solid #3ea6ff;
  }
`;

const ThumbnailInputLabel = styled.label`
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

const AddImageIcon = styled(AddPhotoAlternateIcon)`
  place-self: center;
  margin: 5px 0 10px 0;
`;

const ThumbnailImg = styled.img`
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
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
  min-height: 250px;
  height: 100%;
  background: ${({ theme }) => theme.bg};
  border-radius: 5px;
`;

const Screen = styled.div`
  display: grid;
  place-content: center;
  background-color: #080808;
  width: 100%;
  min-height: 170px;
  border-radius: 5px 5px 0 0;
  font-size: 14px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  margin-block: 10px;
  padding: 5px 15px;
  font-size: 14px;
`;

const ItemTitle = styled.p`
  font-size: 13px;
  width: 100%;
  padding-bottom: 10px;
  text-align: left;
  color: ${({ theme }) => theme.textSoft};
`;

const ItemExplain = styled(ItemTitle)`
  font-size: 14px;
  font-weight: 400;
`;

const VideoLink = styled.p`
  font-size: 12px;
  color: #3ea6ff;
`;

const ProcessDisplay = styled.div`
  width: 102px;
  height: 10px;
  border-radius: 5px;
  background: ${({ theme }) => theme.textSoft};
  position: relative;
  &::after{
    content: "";
    position: absolute;
    left: 1px;
    top: 1px;
    height: 8px;
    width: ${(props) => (props.percentage > 0 ? `${props.percentage}px` : 0)};
    background: #3ea6ff;
    border-radius: 5px;
  }
`;

const Buttons = styled.div`
  display: flex;
`;

const ConfirmButton = styled.button`
  text-transform: uppercase;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  border: none;  
  background: #3ea6ff;
  border-radius: 3px;
  color: ${({ theme }) => theme.uploader};
  cursor: pointer;
  &:hover {
    filter: brightness(85%);
  }
`;

const CancelButton = styled(ConfirmButton)`
  background: red;
  color: #c0c0c0;
  margin-right: 25px;
`;

const SecondCheck = styled(Buttons)`
  background: ${({ theme }) => theme.uploader};
  position: absolute;
  top: 10px;
  right: 120px;
`;

const Confirm = styled(ConfirmButton)`
  padding: 10px 12px;
  background: #ff0000;
`;

const Cancel = styled(Confirm)`
  background: #c0c0c0;
  color: ${({ theme }) => theme.uploader};
  margin-right: 15px;
`;

const Upload = ({activeUpload, setActiveUpload, setOpenUpload}) => {
  const [warning, setWarning] = useState({state: false, message: ""})
  const [secondCancelCheck, setSecondCancelCheck] = useState(false)
  const [file, setFile] = useState({video: null, img: null})
  const [videoPercent, setVideoPercent] = useState(50)
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
      console.log(storageRef);
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
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
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
      setVideoDetails(prev => ({...prev, tags: e.target.value.split(",").map((el)=>el.trim()) }))
    } else {
      setVideoDetails(prev => ({...prev, [e.target.name]: e.target.value}));
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
    // creates video with the url and the videoDetails at MongoDB
    if (videoPercent < 100 && videoDetails.videoUrl === "") return setWarning({state: true, message: "Video uploading is not over yet!"})
    try {
      const res = await axios.post("http://localhost:8800/api/videos", {...videoDetails}, {withCredentials:true})
      setOpenUpload(false)
      res.status === 200 && navigate(`/video/${res.data._id}`)
    } catch (err) {
      console.log(err);
    }
  }

  const handleCancel = () => {
    if (!secondCancelCheck){
      setWarning({state: true, message: "Are you sure?\n Whole progress will be lost"})
      setSecondCancelCheck(true)
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
      console.log(`${(storageRef.name).slice(13, -1)} is successfully deleted from storage`);
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <Container>
      {activeUpload && (
        <Wrapper>
          <UploaderBox>
            <UploaderHeader>
              <HeaderTitle>Upload Videos</HeaderTitle>
              <CloseBtn>
                <CloseIcon onClick={() => setActiveUpload(false)} sx={{fontSize:27, fontWeight:"bolder"}} />
              </CloseBtn>
            </UploaderHeader>
            {!videoPercent ? (
                <UploadVideoForm
                  encType='multipart/form-data'
                  htmlFor="upload"
                  onDrop={handleDrop}
                  onDragOver={handleDrop}
                  onSubmit={(e) => e.preventDefault()}
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
                            ) : imagePercent === 100 ? (<ThumbnailImg src={videoDetails?.imgUrl}></ThumbnailImg>  
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
                        <ItemExplain>Tags can be useful when it comes to users trying to find certain contents, especially if content in your video is commonly misspelled. Please separate the tags with commas.</ItemExplain>
                        <Input
                          defaultValue={videoDetails?.tags}
                          name='tags'
                          type="text"
                          maxlength="500"
                          placeholder="#live, #business, ..."
                          onChange={handleInput}
                        />
                      </DetailsForm>
                    </Left>
                    <Right>
                      <Card>
                        <Screen>
                          {"Uploading " + Math.round(videoPercent) + "% ..." }
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
                    <ProcessDisplay percentage={Math.round(videoPercent)}></ProcessDisplay>
                    <Buttons>
                      <CancelButton onClick={handleCancel}>
                        cancel
                      </CancelButton>
                      {secondCancelCheck && (
                        <SecondCheck>
                          <Confirm onClick={handleCancel}>Yes</Confirm>
                          <Cancel onClick={()=> setSecondCancelCheck(false) + setWarning((prev)=>({...prev, state: false}))}>No</Cancel>
                        </SecondCheck>
                      )}
                      <ConfirmButton onClick={handleConfirm} onBlur={()=>setWarning((prev)=>({...prev, state: false}))} >confirm</ConfirmButton>
                      {warning.state && (<WarningMessage message={warning.message} />)}
                    </Buttons>
                  </UploaderFooter>
                </>
              )
            }
          </UploaderBox>
        </Wrapper>
      )}
    </Container>
  )
}

export default Upload