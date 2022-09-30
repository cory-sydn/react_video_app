import React from 'react'
import Skeleton from '@mui/material/Skeleton'

const SkeletonCard = () => {
  return (
    <div style={{ width: "100%", minWidth: 240, maxWidth: 320, height: 270 }}>
      <Skeleton variant="rectangular" width={"100%"} height={160}  sx={{background: "#313131" }}/>
      <div style={{marginTop: 18, display: 'flex'}} >
        <div style={{ width: 40, height: "100%", marginRight: 14 }}>
          <Skeleton variant="circular" width={36} height={36}  sx={{ background: "#313131" }} />
        </div>
        <div style={{ width: "100%", height: "100%"}}>
          <Skeleton variant="text" sx={{ fontSize: '1rem', background: "#313131" }} />
          <Skeleton variant="text" sx={{ width: 160, fontSize: '1rem', background: "#313131" }} />
          <br/>
          <Skeleton variant="text" sx={{ width: 90, fontSize: '1rem', background: "#313131" }} />
          <Skeleton variant="text" sx={{ width: 90, fontSize: '1rem', background: "#313131" }} />
        </div>
      </div>
    </div>
  )
}

export default SkeletonCard