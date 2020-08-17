import React from 'react';
import '../assets/css/SiteEssential.css'

export default function CommunityGuidelines() {
    return (
        <div className="site-info-container">
            <div className="headline">
                <span>User's Pledge Towards Wedding-O-Graffiti Community & Guidelines.</span>
                <span className="last-updated">updated by 17 Aug, 2020</span>
            </div>
            <div className="label-heading">I will upload only work that I’ve created</div>
            <div className="context">
                <span>Don’t post others’ work.</span>
                <span>Don’t take credit for others’ work.</span>
                <span>If your uploaded content violates these guidelines, it will be removed and your account may be suspended. 
                    Note: Per our Terms of Service, Wedding-O-Graffiti has final say over whether content is appropriate.</span>
            </div>

            <div className="label-heading">I will ensure to attach logo/watermark/trademark with my content </div>
            <div className="context">
                <span>Don’t forget to add your logo/watermark/trademark.</span>
            </div>

            <div className="label-heading">I will give due credit</div>
            <div className="context">
                <span>If your work is inspired by other work on Wedding-O-Graffiti, make sure to give credit. 
                    You can do this by mentioning the Wedding-O-Graffiti member or mentioning the actual content. 
                    Know that work that’s inspired by others may be interpreted as stolen.</span>
                <span>If you’re the owner of work that has been posted on Wedding-O-Graffiti without your consent, please review our Copyright Policy.</span>
                <span>Please link back to Wedding-O-Graffiti when posting Wedding-O-Graffiti content elsewhere.</span>
            </div>

        </div>
    )
}
