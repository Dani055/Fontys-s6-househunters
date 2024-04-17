import React from "react"
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../UserProvider";
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { displayUsername, profileUrl } from "service/userService";

function Comment({ deleteComment, setCommentIdToDelete, comment }) {
  const { loggedUser } = useContext(UserContext);

  const deleteModalHTML = () => {
    return <div
      className="modal fade"
      id="confirmCommentDeleteModal"
      tabIndex={-1}
      aria-labelledby="deleteCommentModalLabel">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-black" id="deleteCommentModalLabel">
              Delete comment?
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-black">
            <p>
              Are you sure that you want to delete this comment?
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-bs-dismiss="modal"
              onClick={() => deleteComment()}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>;
  }
  return (
    <div className="comment bg-light rounded p-3 mb-4">
      <div className="comment-header row">
        <div className="col-auto me-auto">
          <p>
            <Link className="link-dark" to={profileUrl(comment.creator)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-person"
                viewBox="0 0 16 16"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
              </svg>{" "}
              {displayUsername(comment)}
            </Link>{" "}
            commented:
          </p>
        </div>
        {
          (loggedUser?._id === comment.creatorId || loggedUser?.roles.includes('Admin')) &&
          <div className="col-auto">
            <Tooltip title={<Typography fontSize={14}><span className="text-danger-light">Delete comment</span></Typography>} placement="left">
              <button data-testid="buttonDeleteComment" onClick={() => setCommentIdToDelete(comment._id)} data-bs-toggle="modal" data-bs-target="#confirmCommentDeleteModal" className="btn btn-danger ms-auto"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
              </svg></button>
            </Tooltip>
            {deleteModalHTML()}
          </div>

        }

      </div>
      <p className="ms-4">{comment.text}</p>
      <p className="m-0 text-end">
        {dayjs(comment.createdAt).format("DD/MM/YYYY HH:mm")}
      </p>
    </div>
  )
}

export default Comment;