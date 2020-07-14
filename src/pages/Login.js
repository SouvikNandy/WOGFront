import React, { Component } from 'react';
import { FaUser } from "react-icons/fa";
import '../assets/css/login.css';
import { Link } from 'react-router-dom';
import { createFloatingNotification } from '../components/FloatingNotifications';
import { getBackendHOST } from '../utility/Utility';
import axios from 'axios';

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
        password : ""
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
        let backendHost = getBackendHOST();
        console.log("backend Host", backendHost)
        let url  = backendHost + 'api/v1/user-authentication/';
        axios.post(url, { email: this.state.email, password: this.state.password })
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({ email: '', password:'' });
                // form reset doesnot clear hidden field values
                document.getElementById("login-form").reset();
                createFloatingNotification("success", "Successful Login", res.data.message);
            })
            .catch(err =>{
                console.log(err.response);
                createFloatingNotification("error", "Authentication failed!", err.response.data.message);
            })
            
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.validateData();

    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value

    });

    render() {
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
                    <input type="submit" value="Sign In" className="btn btn-primary" />
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
        confirmPassword: ""
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

        // check if login is valid
        createFloatingNotification("success", "Signup Successful!", "Welcome!");
        return true

    }

    onSubmit = (e) => {
        e.preventDefault();
        let _validation = this.validateData();
        if(_validation === false){
            return
        }
        this.setState({ 
            name:"",
            username:"",
            email: "",
            password : "",
            confirmPassword: "" 
        });
        // form reset doesnot clear hidden field values
        document.getElementById("signup-form").reset();
    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value

    });
    render() {
        return (
            <React.Fragment>
                <h1 className="large text-primary">Sign up</h1>
                <p className="lead"><FaUser />Create Your Account</p>
                <form className="login-form" id="signup-form" onSubmit={this.onSubmit}>
                    <div className="form-group f-flex">
                        <input type="text" placeholder="Username" name="Username" onChange={this.onChange} required />
                        <select name="i-am" id="i-am">
                            <option className="i-am-option" value="individual">I'm an Individual</option>
                            <option className="i-am-option" value="team">I'm a Team</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Name" name="Name" onChange={this.onChange} required />
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
                    <input type="submit" value="Create Account" className="btn btn-primary" />
                </form>
                <p className="my-1">
                    Already have an account?<Link className="link" to={"/signin/"}> Sign In</Link>
                </p>
            </React.Fragment>
        )
    }
}
export default Login;