import React, { Component } from 'react';
import '../assets/css/commun.css'
import Footer from '../components/Footer';
import { PublicNavBar } from '../components/Navbar/Navbar';

export default function Commun() {
    return (
        <React.Fragment>
            <div className="landig-nav">
                <PublicNavBar defaultActive={false}/>
            </div>
            <div className="commun-container">
                <div id="about-us"></div>
                <AboutUs />
                <div id="how-it-works"></div>
                <HowItWorks />
                <div id="contact-us"></div>
                <ContactUs />
            </div>
            <Footer />
        </React.Fragment>
        
    )
}


const AboutUs = () =>{
    return (
        <div className="about-us-container" >
            <div className="doodle"></div>
            <div className="text-container">
                <span className="header-text">About Us</span>
                <span className="detailed-text">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>
            </div>
        </div>
    )
}

const HowItWorks = () =>{
    return(
        <div className="how-it-works-container">
            <div className="text-container">
                <span className="header-text">How It Works</span>
                <span className="detailed-text">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>
            </div>
            <div className="doodle">
                <iframe title="hiw" className="tut-video" src="https://www.youtube.com/embed/tgbNymZ7vqY"></iframe>
            </div>
        </div>

    )
}

class ContactUs extends Component{
    state = {
        name: null,
        email: null,
        message: null
    }
    onChange =(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit =(e)=>{
        e.preventDefault();
        console.log(this.state.name, this.state.email, this.state.message)
    }

    render(){
        return (
            <div className="contact-us-container">
                <div className="doodle"></div>
                <div className="text-container">
                    <form className="contact-us-form" action="">
                        <div className="title-text">Get In Touch</div>
                        <input type="text" placeholder="Name" name="name" onChange={this.onChange}></input>
                        <input type="email" placeholder="Email" name="email" onChange={this.onChange}></input>
                        <textarea placeholder="Message" name="message" onChange={this.onChange}></textarea>
                        <button className="btn" onClick={this.onSubmit}>Submit</button>
                    </form>
                </div>
            </div>
    )

    }
    
}
