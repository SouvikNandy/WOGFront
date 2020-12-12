import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/commun.css'
import Footer from '../components/Footer';
import { PublicNavBar } from '../components/Navbar/Navbar';

export default function TermsOfServices() {
    return (
        <React.Fragment>
            <div className="landig-nav">
                <PublicNavBar defaultActive={false} />
            </div>
            <div className="commun-container">
                <div className="privacy-policy">
                    <div className="text-container">
                        <span className="header-text">Terms of Services</span>
                        <span className="detailed-text">
                            <div className="lighttext">Last Updated: 13th Sept 2018</div>
                            <p className="lighttext">
                                This Terms of Service (the “Terms”) describes the rights and responsibilities that apply to your use of Dribbble’s websites, services, and mobile app (collectively, the “Service”), each owned and operated by Dribbble Holdings Ltd. (“Dribbble”, “we”, “our” or “us”).
                            </p>
                            <p className="lighttext">
                                Please read the Terms carefully before using the Service. 
                                If you don’t agree to the Terms, as well as 
                                <Link className="link" to={"/privacy-policy"}>Dribbble’s Privacy Policy</Link> 
                                (the “Privacy Policy”) and 
                                <Link className="link" to={"/guidelines"}>Dribbble’s Community Guidelines </Link>
                                (the “Community Guidelines”), you may not use the Service. If you are entering into the Terms on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to the Terms. If you do not have such authority, you must not accept the Terms or use the Service on behalf of such entity. The Service is only available to you if you have entered the age of majority in your jurisdiction of residence and are fully able and competent to enter into, abide by and comply with the Terms.
                            </p>

                            <p className="lighttext">
                                <span className="boldtext">A. Your Dribbble Account.</span> If you create an account on the Service (your “Account”), you are responsible for maintaining the security of your Account and its Content (as defined below), and you are fully responsible for all activities that occur under your Account and any other actions taken on the Service. You must not describe or assign Content to your Account in a misleading or unlawful manner, including in a manner intended to trade on the name or reputation of others, and Dribbble may change or remove any description or keyword that it considers inappropriate or unlawful, or otherwise likely to cause Dribbble liability. You must immediately notify Dribbble of any unauthorized uses of your Account or any other breaches of security. Dribbble will not be liable for any acts or omissions by you, including any damages of any kind incurred as a result of such acts or omissions.
                            </p>
                            <p className="lighttext">
                                <span className="boldtext">B. Your Responsibilities.</span> If you operate an Account, comment on a screenshot, post material to the Service, post links on the Service, or otherwise make (or allow any third party to make) material available by means of the Service (any such material, “Content”), you are entirely responsible for the content of, and any harm resulting from, that Content. That is the case regardless of whether the Content in question constitutes text or graphics. By making Content available, you represent and warrant that:
                            </p>

                            <p className="lighttext romanlines">
                                <div>a. the downloading, copying and use of the Content will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark or trade secret rights, of any third party;</div>
                                <div>b. the downloading, copying and use of the Content will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark or trade secret rights, of any third party;</div>
                                <div>c. the downloading, copying and use of the Content will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark or trade secret rights, of any third party;</div>
                                <div>d. the downloading, copying and use of the Content will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark or trade secret rights, of any third party;</div>
                                <div>e. the downloading, copying and use of the Content will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark or trade secret rights, of any third party;</div>
                            </p>
                        </span>
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>

            
    )
}
