import setup from '../setup.json';
import {createFloatingNotification} from '../components/FloatingNotifications';
import axios from 'axios';

// AUTH TOKEN MANAGEMENT

export const LogOutUser = () =>{
    localStorage.clear();
}

export const storeAuthToken = (token) => {
    let jwt_decoded = parseJwt(token);
    jwt_decoded["access"] = token;
    saveInStorage("tx", JSON.stringify(jwt_decoded));
    // inMemoryToken = jwt_decoded
    // console.log("inmemory token stored", inMemoryToken);
}

export const isAuthenticated = () => {
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

let fetchingToken = false
let intervalFunc = null

export const silentRefresh = () => {
    // clear previous interval funcs
    if(intervalFunc !== null){
        clearInterval(intervalFunc)
        intervalFunc = null
    }
     
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
            if(fetchingToken) return;
            console.log("refresh token each in " + diff +" seconds");
            fetchingToken = true
            intervalFunc = setInterval(() => {
                refreshToken().then(res =>{
                    if (res !== false){
                        fetchingToken = false
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

export const getFrontendHost = () =>{
    let host = window.location.hostname
    if (host ==="localhost"){
        host = "localhost:3000"
    }
    return host
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export const msToDateTime = (secondsVal) =>{
    let dt = new Date(0);
    dt.setUTCSeconds(secondsVal);
    // return dt.toDateString()
    return dt.getDate() + ' ' + months[dt.getMonth()] + ' '+ dt.getFullYear()
}

export const stringToDate = (dtStr) =>{
    let dt = new Date(dtStr)
    return dt.getDate() + ' ' + months[dt.getMonth()] + ' '+ dt.getFullYear()
}

export const dateObjToReadable = (dt) =>{
    return dt.getDate() + ' ' + months[dt.getMonth()] + ' '+ dt.getFullYear()
}

export const ChatTime = (secondsVal) =>{
    let dt = new Date(0);
    dt.setUTCSeconds(secondsVal);
    let dtHours = String(dt.getHours());
    let dtMinutes = String(dt.getMinutes());
    if (dtHours.length <2) dtHours = "0"+dtHours;
    if (dtMinutes.length <2) dtMinutes = "0"+dtMinutes;
    
    return weekdays[dt.getDay()] + ' ' + dtHours + ':'+ dtMinutes;
}

export const timeDifference = (previous) =>{
    let current = getCurrentTimeInMS()
    let msPerMinute = 60 ;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;

    var elapsed = current - previous;
    // console.log("elapsed",current, previous, elapsed )

    if (elapsed < msPerMinute) {
         return Math.floor(elapsed) + ' sec ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.floor(elapsed/msPerMinute) + ' min ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.floor(elapsed/msPerHour ) + ' hrs ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.floor(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.floor(elapsed/msPerMonth) + ' mon ago';   
    }

    else {
        return Math.floor(elapsed/msPerYear ) + ' yrs ago';   
    }
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
        else if(error.response.status=== 404 || error.response.status=== 500){
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

export const checkNotEmptyObject = (ele) =>{
    return Object.keys(ele).length > 0 ? true: false
}



export const SetCookie = (cname, cvalue, exminutes=15)=> {
    var d = new Date();
    d.setTime(d.getTime() + (exminutes * 60 * 1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const GetCookie = (cname) =>{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

export const SortByUpdatedTimeDESC = (a, b) =>{
    // desc order:  to be used in map sort
    let comparison = 0;
    if(a.last_updated >= b.last_updated){
        comparison = -1
    }
    else{
        comparison = 1
    }
    return comparison
}

export const SortByCreatedTimeASC = (a, b) =>{
    // asc order:  to be used in map sort
    let comparison = 0;
    if(a.created_at >= b.created_at){
        comparison = 1
    }
    else{
        comparison = -1
    }
    return comparison
}


export const convertImagetoBinary =(blob, callBackFunc) =>{
    console.log("blob", blob, "callBackFunc", callBackFunc)
    let reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
    let base64data = reader.result;
    callBackFunc(base64data);
    // console.log(base64data);
    }
}

export const BinaryToBlob =(binaryData, dataType)=>{
    let byteString = atob(binaryData.split(',')[1]);
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: dataType });

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