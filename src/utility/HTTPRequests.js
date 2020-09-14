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
    static get = ({url, includeToken=false, callBackFunc=null, errNotifierTitle='Something went wrong', completeUrl=false}) =>{
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
        }) 

    }
    static post = ({url, requestBody, includeToken=false, callBackFunc=null, errNotifierTitle='Something went wrong', uploadType=null}) =>{
        
        axios.post( backendHost + url, requestBody, { headers: getHeader(includeToken, uploadType)})
        .then(res => {
            if(callBackFunc){
                callBackFunc(res.data);
            }
        })
        .catch(err =>{
            console.log("err", err)
            handleErrorResponse(err, errNotifierTitle);
        }) 

    }
    static put = ({url, requestBody, includeToken=false, callBackFunc=null, errNotifierTitle='Something went wrong', uploadType=null}) =>{
        axios.put( backendHost + url, requestBody, { headers: getHeader(includeToken, uploadType)})
        .then(res => {
            if(callBackFunc){
                callBackFunc(res.data);
            }
        })
        .catch(err =>{
            console.log("err", err)
            handleErrorResponse(err, errNotifierTitle);
        }) 
    }
    static delete = ({url, includeToken=true, callBackFunc=null, errNotifierTitle='Something went wrong'}) =>{
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
        }) 

    }
}