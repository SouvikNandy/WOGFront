import cover from '../assets/images/default-cover-img.jpg'

export const getUserData = () =>{
    let userData = JSON.parse (localStorage.getItem("user_data"));
    return userData
}

export const defaultCoverPic = () =>{
    return cover
}

export default getUserData;