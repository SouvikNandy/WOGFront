import React, { Component } from 'react';
import { FaUser } from "react-icons/fa";
import '../assets/css/login.css';
// Images for shot
// import w1 from "../assets/images/wedding1.jpg";

export class Login extends Component {
    render() {
        const selectedComp = this.props.signInReq === true ? <SignIn /> : <SignUp />;
        console.log("is Login", this.props.isLogin);
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
    render() {
        return (
            <React.Fragment>
                <h1 className="large text-primary">Sign In</h1>
                <p className="lead"><FaUser />Sign into Your Account</p>
                <form className="login-form">
                    <div className="form-group">
                        <input type="email" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Password" />
                    </div>
                    <input type="submit" value="Sign In" className="btn btn-primary" />
                </form>
                <p className="my-1">
                    Don't have an account? <a href="/signup/"> Create One</a>
                </p>
            </React.Fragment>
        )
    }
}


class SignUp extends Component {
    render() {
        return (
            <React.Fragment>
                <h1 className="large text-primary">Sign up</h1>
                <p className="lead"><FaUser />Create Your Account</p>
                <form className="login-form">
                    <div className="form-group f-flex">
                        <input type="text" placeholder="Name" required />
                        <input type="text" placeholder="Username" required />
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Password" />
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Confirm Password" />
                    </div>
                    <input type="submit" value="Create Account" className="btn btn-primary" />
                </form>
                <p className="my-1">
                    Already have an account?<a href="/signin/"> Sign In</a>
                </p>
            </React.Fragment>
        )
    }
}
export default Login;