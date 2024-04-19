
import axiosConfig from "../axiosConfig"

const createCommentCall = (body, listingId) => {
    return axiosConfig.post(`/api/comment/?listingId=`+listingId, body)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}

const deleteCommentCall = (commentId) => {
    return axiosConfig.delete(`/api/comment/`+ commentId)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}


function throwError (err){
    if (err.response) {
        throw err.response.data.message;
    } else if (err.request) {
        throw err.request;
    } else {
        throw err;
    }
}

export {
    createCommentCall,
    deleteCommentCall
}