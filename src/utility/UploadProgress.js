const { generateId } = require("./Utility");

let UploadTrackerObjList = []

class UploadProgressTracker{
    constructor(){
        this.id = generateId();
        this.isUploading = true;
        this.value = 0;
        UploadTrackerObjList.push(this)
    }

    UpdateValue =(value) =>{
        this.value = value
        if (value >= 100){
            this.isUploading = false
            UploadTrackerObjList.filter(ele => ele.id!==this.id)
        }
    }
}

export const GetUploadTracker = () =>{
    return UploadTrackerObjList
}

export const SetUploadTracker = () =>{
    UploadTrackerObjList.push(UploadProgressTracker())
    return UploadTrackerObjList
}

export default GetUploadTracker;