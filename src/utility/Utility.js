

export const isSameUser = (sourceID, currID) =>{
    // return sourceID === currID? true : false
    return true
}

export const generateId = () =>{
    // return current timestamp + random string as id
    return Math.floor(Date.now() / 1000) + Math.random().toString(36).substring(7)
}


export default {isSameUser, generateId}