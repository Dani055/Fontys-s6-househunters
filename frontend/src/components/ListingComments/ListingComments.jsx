import React, { useState } from "react"
import CommentForm from "../forms/CommentForm/CommentForm";
import Comment from "../Comment/Comment";

import { useContext } from "react";
import { UserContext } from "../../UserProvider";
import dayjs from "dayjs";
import "./ListingComments.css"
import { deleteCommentCall } from "service/commentService";
import { toast } from "react-toastify";

function ListingComments(props) {
    const { loggedUser } = useContext(UserContext);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);

    const displayCommentForm = () => {
      if (loggedUser !== null) {
        if (dayjs().isBefore(props.listing.endsOn)) {
          return <CommentForm onPostComment={props.onPostComment}/>
        }
      }
    };

    const deleteComment = async () => {
      try {
        const res = await deleteCommentCall(commentIdToDelete);
        props.onDeleteComment(commentIdToDelete)
        toast.success(res.message)
      } catch (error) {
        console.log(error);
        toast.error("Could not delete comment");
      }
    };

    return (
      <div className="comments p-3 mt-2 mb-4">
      <h4>Comments ({props.comments.length})</h4>
      {
        displayCommentForm()
      }
      {props.comments?.map((comment) => {
            return <Comment deleteComment={deleteComment} setCommentIdToDelete={setCommentIdToDelete} key={comment._id} comment={comment}/>
      })}
    </div>   
    )
}

export default ListingComments;