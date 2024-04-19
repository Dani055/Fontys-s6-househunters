
import axiosConfig from "../axiosConfig"

const createListingCall = (body) => {
    return axiosConfig.post(`/api/listing`, body)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}
const getListingsByCreatorCall = (creatorId) => {
    return axiosConfig.get(`/api/listing?creatorId=${creatorId}`)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}
const getLiveListingsWithFiltersAndPage = (filters, page) => {
    return axiosConfig.get(`/api/listing?page=${page}&hasEnded=false`)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}
const getEndedListingsWithFiltersAndPage = (filters, page) => {
    return axiosConfig.get(`/api/listing?page=${page}&hasEnded=true`)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}
const getListingById = (id) => {
    return axiosConfig.get(`/api/listing/` + id)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}
const editListingCall = (body, id) => {
    return axiosConfig.put(`/api/listing/` + id, body)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}
const deleteListingCall = (id) => {
    return axiosConfig.delete(`/api/listing/` + id)
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
    createListingCall,
    getListingsByCreatorCall,
    getLiveListingsWithFiltersAndPage,
    getEndedListingsWithFiltersAndPage,
    getListingById,
    editListingCall,
    deleteListingCall
}