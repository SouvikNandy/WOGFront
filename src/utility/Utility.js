import setup from '../setup.json';
import {createFloatingNotification} from '../components/FloatingNotifications';
import axios from 'axios';

// AUTH TOKEN MANAGEMENT

export const LogOutUser = () =>{
    localStorage.removeItem("tx");
    localStorage.removeItem("refresh_token");
}

export const storeAuthToken = (token) => {
    let jwt_decoded = parseJwt(token);
    jwt_decoded["access"] = token;
    saveInStorage("tx", JSON.stringify(jwt_decoded));
    // inMemoryToken = jwt_decoded
    // console.log("inmemory token stored", inMemoryToken);
}

export const isAuthenticaed = () => {
    let inMemoryToken = retrieveFromStorage("tx");
    if (inMemoryToken){
        inMemoryToken = JSON.parse(inMemoryToken);
        if(inMemoryToken.exp > getCurrentTimeInMS()){
            return true
        }
        else{
            return false
        }     
    }
    else{
        return null
    }
    
}



export const silentRefresh = () => {
    let inMemoryToken = retrieveFromStorage("tx");
    if (inMemoryToken) {
        // console.log("inMemoryToken exists! ")
        inMemoryToken = JSON.parse(inMemoryToken) 
        let expiry = inMemoryToken.exp
        let cur_ms = getCurrentTimeInMS();

        let diff = expiry - cur_ms
        // if diff is less than one minutes
        if (diff < 60) {
            // console.log("diff is less than one minutes, setting token directly");
            refreshToken().then(res =>{
                if (res !== false){
                    silentRefresh();
                }
                else{
                    return false
                }
                
            })
            
        } 
        else {
            // console.log("refresh token each in " + diff +" seconds");
            setInterval(() => {
                refreshToken().then(res =>{
                    if (res !== false){
                        silentRefresh();
                    }
                    else{
                        return false
                    }
                })
            }, diff * 1000)

        }
    } 
    else {
        let ref_token = retrieveFromStorage("refresh_token");
        if (ref_token) {
            refreshToken().then(res =>{
                if (res !== false){
                    silentRefresh();
                }
                else{
                    return false
                }
            }
            );
            
        } 
        else {
            console.log("silentRefresh called but no ref_token found.")
        }
    }

}

async function refreshToken () {
    let url = getBackendHOST() + 'api/v1/refresh-token/';
    let response = await axios.post(url, {
            refresh: retrieveFromStorage("refresh_token")
        })
    if (response.status === 200){
        storeAuthToken(response.data.access);
        return response.data.access
    }
    else{
        handleErrorResponse(response, "Please Sign In Again!");
        return false
    }
}


// REUASBLE methods
export const isSelfUser = (sourceID, targetID) => {
    return sourceID.toLowerCase() === targetID.toLowerCase() ? true : false
}

export const getCurrentTimeInMS = () => {
    return Math.floor(Date.now() / 1000);
}

export const generateId = () => {
    // return current timestamp + random string as id
    return getCurrentTimeInMS() + Math.random().toString(36).substring(7)
}

export const getBackendHOST = (env = 'dev') => {
    return setup[env]["BACKEND_HOST"]
}

export const msToDateTime = (secondsVal) =>{
    let dt = new Date(0);
    dt.setUTCSeconds(secondsVal);
    return dt.toDateString()
}

// LOCAL STORAGE MANAGEMENT
export const saveInStorage = (key, value) => {
    localStorage.setItem(key, value);
    return true
}

export const retrieveFromStorage = (key) => {
    if (key in localStorage) {
        return localStorage.getItem(key);
    } else {
        return null
    }

}

// Error handling and notifier
export const notifyMultipleErrorMsg = (headingText, msgObj) => {
    Object.keys(msgObj).map(key => {
        createFloatingNotification("error", headingText, key + ' : ' +msgObj[key]);
        return key
    })

}

export const handleErrorResponse = (error, notifierKey) => {
    let errorResponse = '';
    let errDefaultMsg = "Excuse us! We are facing some issues. Will be back in sometime."
    if (error.response && error.response.data) {
        // console.log("response", error.response)
        if(error.response.status=== 401 || error.response.status=== 403){
            createFloatingNotification('error' ,'Request Unautorized!', 'You might not have the permission to access the requested content');
        }
        else if(error.response.status=== 500){
            createFloatingNotification('error' ,'Something went wrong!', errDefaultMsg);
        }
        // error occurred/reported from response
        else if (typeof error.response.data.message !== "string") {
            notifyMultipleErrorMsg(notifierKey, error.response.data.message);
        } else {
            createFloatingNotification("error", notifierKey, error.response.data.message);
        }
    } else if (error.request) {
        // error occurred while requesting
        errorResponse = error.request.message || error.request.statusText;
        console.log("error occurred while requesting", errorResponse);

        createFloatingNotification("error", notifierKey, errDefaultMsg);
    } else {
        errorResponse = error.message;
        console.log("error occurred ", errorResponse);
        createFloatingNotification("error", notifierKey, errDefaultMsg);
    }
}


// JWT DECODE
export const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export const ControlledEventFire = (el, etype) =>{
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      var evObj = document.createEvent('MouseEvents');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
}

export default {
    isSelfUser,
    generateId,
    getBackendHOST,
    storeAuthToken,
    saveInStorage,
    retrieveFromStorage,
    silentRefresh
}