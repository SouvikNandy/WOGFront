import React, { Component } from 'react';
import { FaUser } from "react-icons/fa";
import '../assets/css/login.css';
import { Link, Redirect } from 'react-router-dom';
import { createFloatingNotification } from '../components/FloatingNotifications';
import {saveInStorage, storeAuthToken, silentRefresh } from '../utility/Utility';
import HTTPRequestHandler from '../utility/HTTPRequests';

export class Login extends Component {
    render() {
        const selectedComp = this.props.signInReq === true ? <SignIn /> : <SignUp />;
        // console.log("is Login", this.props.isLogin);
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
}


class SignIn extends Component {
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

        let url = 'api/v1/user-authentication/';
        let requestBody = { email: this.state.email, password: this.state.password }
        HTTPRequestHandler.post({url: url, requestBody: requestBody, callBackFunc: this.onSuccessfulLogin, errNotifierTitle: "Authentication failed!"})
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
        if (this.state.isLoggedIn){
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
                    Don't have an account? <Link className="link" to={"/signup/"}> Create One</Link>
                </p>
            </React.Fragment>
        )
    }
}


class SignUp extends Component {
    state = {
        name:"",
        username:"",
        email: "",
        password : "",
        confirmPassword: "",

        signupSuccesful : false
    }

    validateData=()=>{
        console.log(this.state);
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

        let user_type = document.getElementById('i-am')==="team"? "T": "I";
        let url  = 'api/v1/user-registration/';
        let requestBody = { 
            name: this.state.name,
            username: this.state.username,
            user_type: user_type,
            email: this.state.email, 
            password: this.state.password
        }

        HTTPRequestHandler.post({url: url, requestBody: requestBody, callBackFunc: this.onSuccess, errNotifierTitle: "Signup failed!"})

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
        // console.log("reteived auth Token", retrieveAuthToken());
        if (this.state.signupSuccesful){
            return <Redirect to='/signin/' />
        }
        return (
            <React.Fragment>
                <h1 className="large text-primary">Sign up</h1>
                <p className="lead"><FaUser />Create Your Account</p>
                <form className="login-form" id="signup-form" onSubmit={this.onSubmit}>
                    <div className="form-group f-flex">
                        <input type="text" placeholder="Username" name="username" onChange={this.onChange} required />
                        <select name="i-am" id="i-am">
                            <option className="i-am-option" value="individual">I'm an Individual</option>
                            <option className="i-am-option" value="team">I'm a Team</option>
                        </select>
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
                    Already have an account?<Link className="link" to={"/signin/"}> Sign In</Link>
                </p>
            </React.Fragment>
        )
    }
}
export default Login;