import axios from 'axios';
import { getBackendHOST, handleErrorResponse, retrieveFromStorage } from '../utility/Utility';


const backendHost = getBackendHOST();

const getHeader = (includeToken, uploadType) =>{
    if (includeToken && uploadType==='file'){
        return {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer '+ JSON.parse(retrieveFromStorage('tx')).access
          }

    }
    else if(includeToken){
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ JSON.parse(retrieveFromStorage('tx')).access
          }
    }
    else{
        return {
            'Content-Type': 'application/json',
          }
    }

}
export default class HTTPRequestHandler{
    static get = ({url, includeToken=false, callBackFunc=null, errCallBackFunc=null, errNotifierTitle='Something went wrong', completeUrl=false}) =>{
        let burl= url
        if (completeUrl === false){
            burl = backendHost + url;
        }
        axios.get( burl, { headers: getHeader(includeToken)})
        .then(res => {
            if(callBackFunc){
                callBackFunc(res.data);
            }
        })
        .catch(err =>{
            console.log("err", err)
            handleErrorResponse(err, errNotifierTitle);
            if(errCallBackFunc) errCallBackFunc(err)
        }) 

    }
    static post = ({url, requestBody, includeToken=false, callBackFunc=null, 
        errCallBackFunc=null, errNotifierTitle='Something went wrong', uploadType=null, onUploadProgress=null}) =>{
        let options ={ headers: getHeader(includeToken, uploadType)}
        if(onUploadProgress){
            options ={
                headers: getHeader(includeToken, uploadType),
                onUploadProgress: (progressEvent)=>{
                    onUploadProgress(progressEvent)
                }
            }
        }

        axios.post( backendHost + url, requestBody, options)
        .then(res => {
            if(callBackFunc){
                callBackFunc(res.data);
            }
        })
        .catch(err =>{
            console.log("err", err)
            handleErrorResponse(err, errNotifierTitle);
            if(errCallBackFunc) errCallBackFunc(err)
        }) 

    }
    static put = ({url, requestBody, includeToken=false, callBackFunc=null, 
        errCallBackFunc=null, errNotifierTitle='Something went wrong', uploadType=null, onUploadProgress=null}) =>{

        let options ={ headers: getHeader(includeToken, uploadType)}
        if(onUploadProgress){
            options ={
                headers: getHeader(includeToken, uploadType),
                onUploadProgress: (progressEvent)=>{
                    onUploadProgress(progressEvent)
                }
            }
        }

        axios.put( backendHost + url, requestBody, options)
        .then(res => {
            if(callBackFunc){
                callBackFunc(res.data);
            }
        })
        .catch(err =>{
            // console.log("err", err)
            handleErrorResponse(err, errNotifierTitle);
            if(errCallBackFunc) errCallBackFunc(err)
        }) 
    }
    static delete = ({url, includeToken=true, callBackFunc=null, errCallBackFunc=null, errNotifierTitle='Something went wrong'}) =>{
        axios.delete( backendHost + url, { 
            headers: getHeader(includeToken),
        })
        .then(res => {
            if(callBackFunc){
                callBackFunc(res.data);
            }
        })
        .catch(err =>{
            console.log("err", err)
            handleErrorResponse(err, errNotifierTitle);
            if(errCallBackFunc) errCallBackFunc(err)
        }) 

    }
}
