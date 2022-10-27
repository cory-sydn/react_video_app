import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

export const Uploader = async(file, setUploadTask, setPercentage, setImageUrl, previousData) => {
  const storage = getStorage();

  const removePrevious = async() => {
    const firebaseName = previousData.split("/o/")[1].split("?alt=")[0]
    const fileRef = ref(storage, firebaseName)
    await deleteObject(fileRef).then(() => {
      console.log("Previous version of the file is successfully deleted.");
    }).catch((err) =>{
      console.log(err);
    })
  }

  try {
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName);
  
    const uploadTask = uploadBytesResumable(storageRef, file)
    setUploadTask(uploadTask)
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;          
        setPercentage(progress)
        switch (snapshot.state) {
          case 'paused':
            console.log(`${file.name} upload is paused`);
            break;
          case 'running':
            console.log(`${file.name} upload is running`);
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
          previousData && removePrevious()
          console.log(`${file.name} available at`, downloadURL);
          return setImageUrl(downloadURL)
        });
      }
    )
  } catch (err) {
    console.log(err);
  }
}