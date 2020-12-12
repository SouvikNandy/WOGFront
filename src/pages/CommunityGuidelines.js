import React from 'react';
import '../assets/css/SiteEssential.css'
import '../assets/css/commun.css'
import Footer from '../components/Footer';
import { PublicNavBar } from '../components/Navbar/Navbar';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

export function CodeOfConduct(props){
    return(
        <div className="commun-container">
            <div className={props.fullCOntext?"privacy-policy full-context": "privacy-policy"}>
                <div className="text-container">
                    <span className="header-text">Code of Conduct</span>
                    <span className="detailed-text">
                        <p className="boldtext">
                            User's Pledge Towards Wedding-O-Graffiti Community & Guidelines.
                        </p>
                        <div className="lighttext">Last Updated: 13th Sept 2018</div>
                        <h4 className="boldtext">1. I will upload only work that I’ve created</h4>
                        <p className="lighttext romanlines">
                            <div><span className="boldtext">A.</span> Don’t post others’ work.</div>
                            <div><span className="boldtext">B.</span> Don’t take credit for others’ work.</div>
                            <div className="boldtext">C. Make sure to add your logo/watermark/trademark to claim the ownership of the uploaded content.</div>
                            <div>
                            <span className="boldtext">D.</span> If your uploaded content violates these guidelines, it will be removed and your account may be suspended. 
                                Note: Per our Terms of Service, Wedding-O-Graffiti has final say over whether content is appropriate.
                            </div>
                        </p>
                        <h4 className="boldtext">2. I won’t post inappropriate content</h4>
                        <p className="lighttext romanlines">
                            <div> Users are requested not to post/share/promote <span className="boldtext">Illegal, Pornographic, mature in content, or gratuitously or overly sexual,
                                Racist, sexist, or otherwise offensive, Shockingly graphic, grotesque, or obscene, Inflammatory (e.g. name-calling, preaching, ranting, stirring up controversy, or venting frustrations) etc</span>
                            </div>
    
                            <div>
                                If you post inappropriate content, it may be removed by Wedding o Graffiti per our Terms of Service. Wedding o Graffiti has final say over whether content is appropriate. If you repost content that’s been removed or continue to post content that violates these guidelines your account may be suspended or removed.
                            </div>
                            <div>If you notice a Wedding o Graffiti member posting inappropriate content, flag the shot or report it by 
                                <HashLink className="link" to={"/commun/#contact-us"}>contacting us.</HashLink></div>
                        </p>
                        <h4 className="boldtext">3. I won’t spam other members on this platform</h4>
                        <p className="lighttext romanlines">
                            <div>Wedding o Graffiti provides many features that allow users to interact with one-another, including messages. Please don’t use these tools indiscriminately to spam or send unsolicited messages to other members. If you’re caught spamming other members, your account may be suspended or removed.</div>
                            <div>If you see a Wedding o Graffiti member spamming others, report it by 
                            <HashLink className="link" to={"/commun/#contact-us"}>contacting us.</HashLink>
                            </div>
                        </p>
                        <h4 className="boldtext">4. I will give due credit</h4>
                        <p className="lighttext romanlines">
                            <div>If your work is inspired by other work on Wedding-O-Graffiti, make sure to give credit. 
                    You can do this by mentioning the Wedding-O-Graffiti member or mentioning the actual content. 
                    Know that work that’s inspired by others may be interpreted as stolen.</div>
                            <div>If you’re the owner of work that has been posted on Wedding-O-Graffiti without your consent, please review our 
                                <Link className="link" to={"/copyright-policy"}>Copyright Policy.</Link></div>
                            <div>Please link back to Wedding-O-Graffiti when posting Wedding-O-Graffiti content elsewhere.</div>
                        </p>
                        <h4 className="boldtext">5. I recognize that personal accounts are only to be used for posting my personal work</h4>
                        <p className="lighttext romanlines">
                            All work posted under an individual player account represents that account holders personal work and not the work of a team, collective, community or any other group of individuals. If you would like to share work created by a team, create a Team account.
                        </p>
                        <h4 className="boldtext">6. I recognize that Team accounts are for teams/organisation</h4>
                        <p className="lighttext romanlines">
                            Any work posted under an team account represents that Each person invited to the team works as part of team or collective effort of all individuals associated with the team. Any work posted earlier on the team account can not be claimed as a subject to copyright by any individual associate of team. 
                        </p>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default function CommunityGuidelines() {
    return (
        <React.Fragment>
            <div className="landig-nav">
                <PublicNavBar defaultActive={false} />
            </div>
            <CodeOfConduct />
            <Footer/>
        </React.Fragment>
    )
}
export function CopyrightPolicy(){
    return(
        <React.Fragment>
            <div className="landig-nav">
                <PublicNavBar defaultActive={false} />
            </div>
            <div className="commun-container">
                <div className="privacy-policy">
                    <div className="text-container">
                        <span className="header-text">Copyright Policy</span>
                        <span className="detailed-text">
                            <div className="lighttext">Last Updated: 13th Sept 2018</div>
                            <h4 className="boldtext">
                                Reporting Claims of Copyright Infringement
                            </h4>
                            
                            <p className="lighttext">
                            We take claims of copyright infringement seriously. We will respond to notices of alleged copyright infringement that comply with applicable law. If you believe any materials accessible on or from this site (the “Site”) infringe your copyright, you may request removal of those materials (or access to them) from the Site by submitting written notification to our copyright agent designated below. In accordance with the Online Copyright Infringement Liability Limitation Act of the Digital Millennium Copyright Act (17 U.S.C. § 512) (“DMCA”), the written notice (the “DMCA Notice”) must include substantially the following:
                            </p>
                            <p className="lighttext romanlines">
                                <div>A. Your physical or electronic signature.</div>
                                <div>B. Identification of the copyrighted work you believe to have been infringed or, if the claim involves multiple works on the Site, a representative list of such works.</div>
                                <div>C. Identification of the material you believe to be infringing in a sufficiently precise manner to allow us to locate that material.</div>
                                <div>D. Adequate information by which we can contact you (including your name, postal address, telephone number, and, if available, email address).</div>
                                <div>E. A statement that you have a good faith belief that use of the copyrighted material is not authorized by the copyright owner, its agent, or the law.</div>
                                <div>F. A statement that the information in the written notice is accurate.</div>
                                <div>G. A statement, under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</div>
                                <div>If you fail to comply with all of the requirements of Section 512(c)(3) of the DMCA, your DMCA Notice may not be effective.</div>
                                <div>Please be aware that if you knowingly materially misrepresent that material or activity on the Site is infringing your copyright, you may be held liable for damages (including costs and attorneys’ fees) under Section 512(f) of the DMCA.</div>
                                <div className="boldtext">We provide a form for submission of claims, which you may optionally use to submit a claim.</div>
                            </p>

                            <h4 className="boldtext">
                                Counter-Notification Procedures
                            </h4>
                            <p className="lighttext">
                                If you believe that material you posted on the Site was removed or access to it was disabled by mistake or misidentification, you may file a counter-notification with us (a “Counter-Notice”) by submitting written notification to our copyright agent designated above. Pursuant to the DMCA, the Counter-Notice must include substantially the following:
                            </p>
                            <p className="lighttext romanlines">
                                <div>A. Your physical or electronic signature.</div>
                                <div>B. An identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access disabled.</div>
                                <div>C. Adequate information by which we can contact you (including your name, postal address, telephone number, and, if available, email address).</div>
                                <div>D. A statement under penalty of perjury by you that you have a good faith belief that the material identified above was removed or disabled as a result of a mistake or misidentification of the material to be removed or disabled.</div>
                                <div>E. A statement that you will consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located (or if you reside outside the United States for any judicial district in which the Site may be found) and that you will accept service from the person (or an agent of that person) who provided the Site with the complaint at issue.</div>
                                
                                <div>A statement that you will consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located (or if you reside outside the United States for any judicial district in which the Site may be found) and that you will accept service from the person (or an agent of that person) who provided the Site with the complaint at issue.</div>
                            </p>
                            <h4 className="boldtext">Repeat Infringers</h4>
                            <p className="lighttext">
                            It is our policy in appropriate circumstances to disable and/or terminate the accounts of users who are repeat infringers.
                            </p>
                        </span>
                    </div>
                </div>
            </div>
            <Footer/>
        </React.Fragment>
    )
}