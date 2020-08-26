import imageCompression from 'browser-image-compression';
import { createFloatingNotification } from '../components/FloatingNotifications';

const ImgCompressor = (e, callbackFunc, imgKey=null, returnUncompressedList=false) => {
    // console.log("on file selects", e.target.files, e.target.files.length);
    let resultList = [];
    for (let i = 0; i < e.target.files.length; i++) {
        let file = e.target.files[i];
        // console.log("selected file", file)
        // check if file in video or image
        if (!file.type.startsWith("image/")) {
            createFloatingNotification("error", "Invalid File type!", "Please make sure to upload images only.");
            continue;
        }
        if (file.type.startsWith("image/") && file.size / 1024 > 600) {
            let options = {
                maxSizeMB: 0.6,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            }
            console.log(`originalFile size ${file.size / 1024 } KB`);
            // compress image
            imageCompression(file, options)
                .then(function (compressedFile) {
                    // console.log('compressedFile ', compressedFile instanceof Blob); // true
                    console.log(`compressedFile size ${compressedFile.size / 1024 } KB`); // smaller than maxSizeMB
                    console.log('compressedFile ', compressedFile);
                    callbackFunc(compressedFile, imgKey);
                })
                .catch(function (error) {
                    console.log(error.message);
                })
        } else {
            // images below 500kb or videos
            // console.log("images below 500kb")
            if(returnUncompressedList){
                // for multiple simultaneous callbacks, state got messed up 
                resultList.push(file);
            }
            else{
                callbackFunc(file, imgKey);
            } 
        }
    }

    return resultList

}

export default ImgCompressor