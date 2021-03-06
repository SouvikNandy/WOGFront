import React, { Component } from 'react';
import { FaUser } from "react-icons/fa";
import '../assets/css/login.css';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { createFloatingNotification } from '../components/FloatingNotifications';
import {saveInStorage, storeAuthToken, silentRefresh } from '../utility/Utility';
import Dropdown from '../components/Dropdown';
import {GetUserPrivacyAPI, LoginAPI, SignupAPI} from '../utility/ApiSet';
import {AiFillCloseCircle } from 'react-icons/ai';
import { setNotificationHandler } from '../utility/userData';
import InitializeChatHistory from '../components/ChatModule/chatUtils';
import LoadingSubmitButton from '../components/LoadingSubmitButton';
import {Context} from '../GlobalStorage/Store'


export function Login(props) {
    const selectedComp = props.signInReq === true ? <SignIn /> : <SignUp />;
    return (
        <React.Fragment>
            <div className="login-layout">
                <section className="img-holder"></section>
                <section className="auth-container">
                    <div className="login-container">
                        {selectedComp}
                    </div>

                </section>

            </div>
        </React.Fragment>
    )
}

export class LoginModal extends Component{
    state ={
        signInPage : true
    }
    changePage = () =>{
        this.setState({signInPage: !this.state.signInPage})
    }
    
    gotoPrev = (e) => {
        e.stopPropagation();
        this.props.history.goBack()
    }

    onRedirection = (username) =>{
        this.props.history.push(
            this.props.location.state && this.props.location.state.currLocation && this.props.location.state.currLocation.pathname && this.props.location.state.currLocation.pathname !== "/"? 
            this.props.location.state.currLocation.pathname
            : 
            '/user-feeds/'+username+'/'
            );
    }
    render(){
        // console.log("LoginModal", this.props)
        return(
        <div className={this.props.location.state?"modal-container":"modal-container bg-dark"}>
            <div className="login-container">
                <AiFillCloseCircle className="close-btn close-container" onClick={this.gotoPrev}/>
                {this.state.signInPage?
                    <SignIn onSignup={this.changePage} onRedirection={this.onRedirection}/> 
                    :
                    <SignUp onSignIn={this.changePage}/>
                }

            </div>

        </div>
        )
    }

}

export class SignIn extends Component {
    static contextType = Context

    state = {
        email: "",
        password : "",
        isLoading: false,
        isLoggedIn : false,
        loggedinUser: '',
    }

    validateData=()=>{
        if (!this.state.email){
            createFloatingNotification("error", "Authentication failed!", "Please provide a valid email id");
            return false
        }
        if (!this.state.password){
            createFloatingNotification("error", "Authentication failed!", "Please provide a valid password");
            return false
        }


        let requestBody = { email: this.state.email, password: this.state.password }
        this.setState({isLoading: true})
        LoginAPI(requestBody, this.onSuccessfulLogin, this.onAPIError)
    }
    onAPIError = (message) =>{
        this.setState({isLoading: false})
    }

    onSuccessfulLogin = (data) => {
        this.storeInCache(data)
        storeAuthToken(data.token.access);
        // activate silent refresh
        silentRefresh();
        // initialize notification handler
        setNotificationHandler(data.data.username);
        // initialize blank chat history
        InitializeChatHistory();

        // get and store user privacy
        GetUserPrivacyAPI(this.storePrivacySettings)

                
        // reset 
        document.getElementById("login-form").reset();
        this.setState({ email: '', password:'', isLoggedIn: true, loggedinUser: data.data.username, isLoading: false });
        createFloatingNotification("success", "Successful Login", data.message);
    }

    storeInCache = (data) =>{
        // store user basic data and token in cache
        // store token in localstorage
        saveInStorage("refresh_token", data.token.refresh);
        // store user basic details in localstorage
        saveInStorage("user_data", JSON.stringify(data.data));
        const dispatch = this.context[1]
        dispatch({type: 'SET_USER', payload: data.data});

    }

    storePrivacySettings = (data)=>{
        saveInStorage("user_privacy", JSON.stringify(data.data));
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.validateData();

    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value

    });

    render() {
        // console.log(this.state.isLoggedIn, this.state.loggedinUser);
        if (this.state.isLoggedIn && this.props.onRedirection){
            this.props.onRedirection(this.state.loggedinUser)
        }
        else if (this.state.isLoggedIn){
            return <Redirect to={`/user-feeds/${this.state.loggedinUser}`} />
        }
        return (
            <React.Fragment>
                <h1 className="large text-primary">Sign In</h1>
                <p className="lead"><FaUser />Sign into Your Account</p>
                <form className="login-form" id="login-form">
                    <div className="form-group">
                        <input type="email" name="email" placeholder="Email" onChange={this.onChange} required />
                    </div>
                    <div className="form-group">
                        <input type="password" name="password" placeholder="Password" onChange={this.onChange} required/>
                    </div>
                    <Link className="link forgot-password" to={"/forgot-pass/"}>Forgot Password ?</Link>
                    <div className="apply-section">
                        {this.state.isLoading?
                            <LoadingSubmitButton textVal={"Signing In ..."}/>
                            :
                            <button className="btn btn-primary-wog" onClick={this.onSubmit}>
                                Sign In
                            </button>
                        }
                        
                    </div>
                    
                </form>
                <p className="my-1">
                    Don't have an account? 
                    {this.props.onSignup? 
                    <span className="link" onClick={this.props.onSignup}> Create One</span>
                    : 
                    <Link className="link" to={"/signup/"}> Create One</Link>
                    } 
                </p>
            </React.Fragment>
        )
    }
}


export class SignUp extends Component {
    state = {
        name:"",
        username:"",
        email: "",
        password : "",
        confirmPassword: "",
        user_type: "",

        isLoading: false,
        signupSuccesful : false
    }

    validateData=()=>{
        if (!this.state.name){
            createFloatingNotification("error", "Signup failed!", "Please provide a valid name.");
            return false
        }
        if (!this.state.username){
            createFloatingNotification("error", "Signup failed!", "Please provide a valid username.");
            return false
        }
        if (!this.state.email){
            createFloatingNotification("error", "Signup failed!", "Please provide a valid email.");
            return false
        }
        if (!this.state.password){
            createFloatingNotification("error", "Signup failed!", "Please provide a valid password.");
            return false
        }
        else if (this.state.password !== this.state.confirmPassword){
            createFloatingNotification("error", "Signup failed!", "Password and confirm Password didn't match.");
            return false

        }

        if (!this.state.user_type || this.state.user_type === ""){
            createFloatingNotification("error", "Signup failed!", "You must choose between individual/team account.");
            return false
        }
        
        let requestBody = { 
            name: this.state.name,
            username: this.state.username.toLowerCase(),
            user_type: this.state.user_type ==="Team/Organization"? "T": "I",
            email: this.state.email, 
            password: this.state.password
        }
        this.setState({isLoading: true})
        SignupAPI(requestBody, this.onSuccess, this.onAPIError)

    }

    onAPIError = (message) =>{
        this.setState({isLoading: false})
    }

    onSuccess = (data) => {
        document.getElementById("signup-form").reset();
        this.setState({
            name:"",
            username:"",
            email: "",
            password : "",
            confirmPassword: "",
            user_type: "",
            signupSuccesful : true,
            isLoading: false,
        
        })
        createFloatingNotification("success", "Successful Signup", data.message);
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.validateData();
    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value

    });
    updateUserType = (value) => this.setState({
        user_type: value
    })
    render() {
        if( this.state.signupSuccesful && this.props.onSignIn){
            this.props.onSignIn()
        }
        else if (this.state.signupSuccesful){
            return <Redirect to='/signin/' />
        }
        return (
            <React.Fragment>
                <h1 className="large text-primary">Sign up</h1>
                <p className="lead"><FaUser />Create Your Account</p>
                <form className="login-form" id="signup-form">
                    <div className="form-group f-flex">
                        <input type="text" placeholder="Username" name="username" onChange={this.onChange} maxLength="20" required />
                        <div className="i-am">
                            <Dropdown options={["Individual", "Team/Organization"]} placeHolder={"I am"} onChange={this.updateUserType} />
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Name" name="name" onChange={this.onChange} required />
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email" name="email" onChange={this.onChange} required />
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Password" name="password" onChange={this.onChange} required/>
                    </div>
                    <div className="form-group">
                        <input className={
                        this.state.password && this.state.confirmPassword? 
                        this.state.password===this.state.confirmPassword?"password-matched": "password-not-matched"
                        :
                        ""}
                        type="password" placeholder="Confirm Password" name="confirmPassword" onChange={this.onChange} required />
                    </div>
                    <div className="apply-section">
                        {this.state.isLoading?
                            <LoadingSubmitButton textVal={"Creating ..."}/>
                            :
                            <button className="btn btn-primary-wog" onClick={this.onSubmit}>
                                Create Account
                            </button>
                        }
                    </div>
                    
                </form>
                <p className="my-1">
                    Already have an account?
                    {this.props.onSignIn? 
                    <span className="link" onClick={this.props.onSignIn}> Sign In</span>
                    : 
                    <Link className="link" to={"/signin/"}> Sign In</Link>
                    }
                    
                </p>
            </React.Fragment>
        )
    }
}



export default withRouter(LoginModal);