
import axiosConfig from "../axiosConfig"

const registerUserCall = (body) => {
    return axiosConfig.post(`/api/auth/register`, body)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err);
        })
}

const loginUserCall = (body) => {
    return axiosConfig.post(`/api/auth/login`, body)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}

const checkLoginKey = () => {
    return axiosConfig.get(`/api/auth/checkkey`)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}
const getUserProfile = (username) => {
    return axiosConfig.get(`/api/user/${username}`)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}
const deleteUserAccount = (id) => {
    return axiosConfig.delete(`/api/user/${id}`)
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}
const getUsersBulk = (userIds) => {
    return axiosConfig.post(`/api/user/getBulk`, {ids: userIds})
        .then((response) => response.data)
        .catch((err) => {
            throwError(err)
        })
}
function throwError (err){
    if (err.response.data) {
        throw err.response.data.message;
    } else if (err.request) {
        throw err.request;
    } else {
        throw err;
    }
}
export function profileUrl(creator){
    return creator?.username ? `/profile/${creator.username}` : '/'
}
export function displayUsername(entity){
    console.log(entity)
    return !entity.creatorId && !entity.creator ? "user_deleted" : entity.creator?.username
}
export const mapEntityWithCreator = async (entityNoUser) => {
    if(entityNoUser.length <= 0){
        return entityNoUser;
    }
    const entityIdToUserId = Object.fromEntries(
        entityNoUser.map(ent => {
        return [ent._id, ent.creatorId]
      })
    );
    const userIdsToGet = Object.values(entityIdToUserId);

    let userIdToUser = {};

    const usersRes = await getUsersBulk(userIdsToGet);
    userIdToUser = usersRes.userIdToUser;

    let entityIdToUser = {};
    Object.keys(entityIdToUserId).forEach((entId) => {
        entityIdToUser[entId] = userIdToUser[entityIdToUserId[entId]]
    })
    const entitiesWithUsers = entityNoUser.map(ent => {
      if(!ent.creator){
        return {...ent, creator: entityIdToUser[ent._id]}
      }
      return ent;
    })
    return entitiesWithUsers;
  }
export {
    registerUserCall,
    loginUserCall,
    checkLoginKey,
    getUserProfile,
    getUsersBulk,
    deleteUserAccount
}