import React, { Component } from 'react'
import '../assets/css/login.css';
import { Redirect} from 'react-router-dom';
import { createFloatingNotification } from '../components/FloatingNotifications';
import LoadingSubmitButton from '../components/LoadingSubmitButton';
import {ForgotPasswordAPI} from '../utility/ApiSet';

export class ForgotPass extends Component {
    state = {
        email: "",
        emailPass: false,
        otp: null,
        otpPass: false,
        password : "",
        confirmPassword: "",
        isLoading: false,
        isCompleted: false,
        token: null,
        otpText: null
    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value

    });

    validateEmail = () =>{
        if (!this.state.email){
            createFloatingNotification("error", "Can't proceed!", "Please provide a valid email.");
            return false
        }
        return true
    }
    validateOTP = () =>{
        if (!this.state.otp){
            createFloatingNotification("error", "Can't proceed!", "Please provide a valid otp.");
            return false
        }
        return true
    }

    validatePassword = () =>{
        if (!this.state.password){
            createFloatingNotification("error", "Can't proceed!", "Please provide a valid password.");
            return false
        }
        else if (this.state.password !== this.state.confirmPassword){
            createFloatingNotification("error", "Can't proceed!", "Password and confirm Password didn't match.");
            return false

        }
        return true
    }

    onSubmit = (e) =>{
        e.preventDefault();
        this.setState({isLoading: true})
        let _check = false
        if(!this.state.emailPass)
        {
            _check = this.validateEmail()
            if (!_check) {
                this.setState({isLoading: false})
                return false
            }
            ForgotPasswordAPI({email: this.state.email}, this.onEmailVerificationPass, this.onErrCallback)
        }
        else if (this.state.emailPass && !this.state.otpPass){
            _check = this.validateOTP()
            if (!_check) {
                this.setState({isLoading: false})
                return false
            }
            ForgotPasswordAPI({token: this.state.token, otp: this.state.otp}, this.onOTPVerificationPass, this.onErrCallback)
        }
        else if (this.state.emailPass && this.state.otpPass){
            _check = this.validatePassword()
            // console.log(this.state.password, this.state.confirmPassword, _check)
            if (!_check) {
                this.setState({isLoading: false})
                return false
            }
            ForgotPasswordAPI({token: this.state.token, otp: this.state.otp, new_password: this.state.password}, this.onSuccessfulPasswordUpdate, this.onErrCallback)
        }
    }

    onErrCallback = (err)=>{
        this.setState({isLoading: false})

    }

    onEmailVerificationPass = (data) =>{
        this.setState({emailPass: true, isLoading: false, token: data.data.token, otpText: data.message})
    }
    onOTPVerificationPass = () =>{
        this.setState({otpPass: true, isLoading: false})
    }
    onSuccessfulPasswordUpdate = () =>{
        this.setState({isLoading: false, isCompleted: true})
        // console.log("password updated")
        createFloatingNotification("success", "Password Updated!", "Now you can login with your new password");
    }

    render() {
        if (this.state.isCompleted){
            return <Redirect to={`/signin/`} />
        }
        let buttonText = ''
        let loadBtnText = ""
        if (!this.state.emailPass || !this.state.otpPass){
            buttonText = "Proceed"
            loadBtnText = "proceeding ..."
        }
        else{
            buttonText = "Reset"
            loadBtnText = "resetting ..."
        }
        return (
            <React.Fragment>
                <div className="login-layout">
                    <section className="img-holder"></section>
                    <section className="auth-container">
                        <div className="login-container">
                            <h1 className="large text-primary">Forgot your password?</h1>
                            <p className="lead">
                            {!this.state.emailPass && !this.state.otpPass?
                                "Don't worry! Just fill in your email and we will send you an otp to reset your password"
                                :
                                ""
                            }
                            {this.state.emailPass && !this.state.otpPass?
                                this.state.otpText
                                :
                                ""
                            }
                            {this.state.emailPass && this.state.otpPass?
                                "Final Step! Provide passwords below and continue."
                                :
                                ""
                            }
                            </p>
                            <div className="login-form" id="login-form">
                                {!this.state.emailPass && !this.state.otpPass?
                                    <div className="form-group">
                                        <input type="email" name="email" placeholder="Enter your email" onChange={this.onChange} required />
                                    </div>
                                    :
                                    ""
                                }
                                {this.state.emailPass && !this.state.otpPass?
                                    <React.Fragment>
                                        <div className="form-group">
                                            <input type="email" name="email" value={this.state.email} disabled />
                                        </div>
                                        <div className="form-group">
                                            <input type="text" placeholder="Provide otp" name="otp" onChange={this.onChange} required/>
                                        </div>
                                        
                                    </React.Fragment>
                                    :
                                    ""
                                }
                                {this.state.emailPass && this.state.otpPass?
                                    <React.Fragment>
                                        <div className="form-group">
                                            <input type="password" placeholder="Password" name="password" onChange={this.onChange} required/>
                                        </div>
                                        <div className="form-group">
                                            <input className={
                                                this.state.password && this.state.confirmPassword? 
                                                this.state.password===this.state.confirmPassword?
                                                "password-matched": "password-not-matched"
                                                :
                                                ""
                                                } 
                                            type="password" placeholder="Confirm Password" name="confirmPassword" onChange={this.onChange} required />
                                        </div>
                                        
                                    </React.Fragment>
                                :
                                ""
                                }
                                <div className="apply-section">
                                    {this.state.isLoading?
                                        <LoadingSubmitButton textVal={loadBtnText}/>
                                        :
                                        <button className="btn btn-primary-wog" onClick={this.onSubmit}>
                                            {buttonText}
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>

                    </section>

                </div>
            </React.Fragment>
        )
    }
}

export default ForgotPass
