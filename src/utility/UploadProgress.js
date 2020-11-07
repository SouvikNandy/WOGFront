const { generateId } = require("./Utility");

let UploadTrackerObjList = []

let UploadNotifierHandler = []

class UploadProgressTracker{
    constructor(){
        this.id = generateId();
        this.isUploading = false;
        this.value = 0;
        UploadTrackerObjList.push(this)
    }

    UpdateValue =(value) =>{
        this.value = value
        // console.log("value updated", this.value)
        if (value >= 100){
            this.isUploading = false
            UploadTrackerObjList.filter(ele => ele.id!==this.id)
        }
        else{
            this.isUploading = true;
        }
        UploadNotifierHandler.map(ele=> ele.cb(this.id, this.value))
    }
    removeTask = () =>{
        UploadTrackerObjList.filter(ele => ele.id!==this.id)
        console.log("task removed!", this.id)
    }
}

export const GetUploadTrackerList = () =>{
    return UploadTrackerObjList
}

export const AddUploadTracker = () =>{
    let newObj = new UploadProgressTracker()
    UploadTrackerObjList.push(newObj)
    return newObj
}

export const RegisterForProgressUpdates=(key, callbackFunc) =>{
    UploadNotifierHandler.push({key: key, cb: callbackFunc})
}

export const DeRegisterForProgressUpdates=(key) =>{
    UploadNotifierHandler.filter(ele => ele.key!==key)
}


export default GetUploadTrackerList;