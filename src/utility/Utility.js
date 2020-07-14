import setup from '../setup.json';
import { createFloatingNotification } from '../components/FloatingNotifications';

export const isSelfUser = (sourceID, targetID) =>{
    return sourceID === targetID? true : false
}

export const generateId = () =>{
    // return current timestamp + random string as id
    return Math.floor(Date.now() / 1000) + Math.random().toString(36).substring(7)
}

export const getBackendHOST = (env='dev') =>{
    return setup[env]["BACKEND_HOST"]
}

export const notifyMultipleErrorMsg = (headingText, msgObj) =>{
    Object.keys(msgObj).map(key=>{
        createFloatingNotification("error", headingText, msgObj[key]);
        return key
    })

}



export default {isSelfUser, generateId, getBackendHOST}