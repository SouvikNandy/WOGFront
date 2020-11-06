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

export const GetUploadTrackerList = () =>{
    return UploadTrackerObjList
}

export const AddUploadTracker = () =>{
    let newObj = UploadProgressTracker()
    UploadTrackerObjList.push(newObj)
    return newObj
}

export default GetUploadTrackerList;