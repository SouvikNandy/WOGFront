import React, { Component } from 'react';
import { FaUser } from "react-icons/fa";
import '../assets/css/login.css';
import { Link, Redirect } from 'react-router-dom';
import { createFloatingNotification } from '../components/FloatingNotifications';
import {saveInStorage, storeAuthToken, silentRefresh } from '../utility/Utility';
import Dropdown from '../components/Dropdown';
import {LoginAPI, SignupAPI} from '../utility/ApiSet';


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
    onRedirection = () =>{
        this.props.history.goBack();
    }
    render(){
        console.log(this.props)
        return(
        <div className="modal-container">
            <div className="login-container">
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
    state = {
        email: "",
        password : "",
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
        LoginAPI(requestBody, this.onSuccessfulLogin)
    }

    onSuccessfulLogin = (data) => {
        this.storeInCache(data)
        storeAuthToken(data.token.access);
        // activate silent refresh
        silentRefresh();
                
        // reset 
        document.getElementById("login-form").reset();
        this.setState({ email: '', password:'', isLoggedIn: true, loggedinUser: data.data.username });
        createFloatingNotification("success", "Successful Login", data.message);
    }

    storeInCache = (data) =>{
        // store user basic data and token in cache
        // store token in localstorage
        saveInStorage("refresh_token", data.token.refresh);
        // store user basic details in localstorage
        saveInStorage("user_data", JSON.stringify(data.data));

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
            this.props.onRedirection()
        }
        else if (this.state.isLoggedIn){
            return <Redirect to={`/user-feeds/${this.state.loggedinUser}`} />
        }
        return (
            <React.Fragment>
                <h1 className="large text-primary">Sign In</h1>
                <p className="lead"><FaUser />Sign into Your Account</p>
                <form className="login-form" id="login-form" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <input type="email" name="email" placeholder="Email" onChange={this.onChange} required />
                    </div>
                    <div className="form-group">
                        <input type="password" name="password" placeholder="Password" onChange={this.onChange} required/>
                    </div>
                    <div className="apply-section">
                        <input type="submit" value="Sign In" className="btn btn-primary" />
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

        let user_type = document.getElementById('i-am');
        if (!user_type || user_type === ""){
            createFloatingNotification("error", "Signup failed!", "You must choose between individual/team account.");
            return false
        }
        
        let requestBody = { 
            name: this.state.name,
            username: this.state.username.toLowerCase(),
            user_type: user_type ==="team"? "T": "I",
            email: this.state.email, 
            password: this.state.password
        }
        SignupAPI(requestBody, this.onSuccess)

    }

    onSuccess = (data) => {
        document.getElementById("signup-form").reset();
        this.setState({
            name:"",
            username:"",
            email: "",
            password : "",
            confirmPassword: "",
            signupSuccesful : true
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
                <form className="login-form" id="signup-form" onSubmit={this.onSubmit}>
                    <div className="form-group f-flex">
                        <input type="text" placeholder="Username" name="username" onChange={this.onChange} maxlength="20" required />
                        <div className="i-am">
                            <Dropdown options={["Individual", "Team/Organization"]} placeHolder={"I am"} />
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
                        <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={this.onChange} required />
                    </div>
                    <div className="apply-section">
                        <input type="submit" value="Create Account" className="btn btn-primary" />
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
export default Login;