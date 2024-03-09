import React, { useContext } from "react"
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createCommentCall } from "../../../service/commentService";
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { UserContext } from "UserProvider";

function CommentForm(props) {
  const params = useParams();
  const { loggedUser } = useContext(UserContext);
  const [text, setText] = useState("");

  const handleFormChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createCommentCall({ text }, params.listingId);
      const comment = res.comment;
      comment.creator = loggedUser;
      props.onPostComment(comment);
      toast.success(res.message);
      setText('');
    } catch (error) {
      console.log(error);
      toast.error("Could not post comment");
    }
  };
  return (
    <div className="place-bid border-top pt-3">
      <h6>Leave comment:</h6>
      <form className="commentForm" onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Your comment here"
            id="commentText"
            name="commentText"
            onChange={handleFormChange}
            aria-label="Your comment here"
            aria-describedby="button-comment"
          />
          <Tooltip className="tooltipsize" title={<Typography fontSize={14}>Post comment</Typography>} placement="top-start">
            <button
              data-testid="buttonPostComment"
              className="btn px-4 btn-outline-dark mx-1"
              type="submit"
              id="button-comment"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-chat" viewBox="0 0 16 16">
                <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
              </svg>
            </button>
          </Tooltip>
        </div>
      </form>
    </div>
  )
}

export default CommentForm;