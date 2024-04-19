
import axiosConfig from "../axiosConfig"

const createBidCall = (body, listingId) => {
    return axiosConfig.post(`/api/bid?listingId=`+listingId, body)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}
const getBidsForListingCall = (listingId) => {
    return axiosConfig.get(`/api/bid?listingId=`+listingId)
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
    createBidCall,
    getBidsForListingCall
}