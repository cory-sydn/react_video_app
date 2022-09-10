import axios from "axios"

export const DeleteComment = async(commentId) => {
  try {
    const res = await axios.delete(`http://localhost:8800/api/comments/${commentId}`, { withCredentials: true}, )
    return res
  } catch (err) {
    console.log(err);
  }
}