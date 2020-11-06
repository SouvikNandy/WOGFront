import cities from "../utility/cityStates.json";
import React, { Component } from 'react'
import "../assets/css/cityList.css";
import { SideBarHead } from "./SideBar";

import {FaMapMarkerAlt} from 'react-icons/fa';
import {MdMyLocation} from 'react-icons/md'


export class IndianCityList extends Component {
    state ={
        allStates: [
        "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
        "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", 
        "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", 
        "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Puducherry", "Punjab", 
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
        output:[],
        searchedPhase: ''
    }

    selectPlace = (city, populateDestId) =>{
        // action on selecting a place
        if (populateDestId){
            let content = city.stateName? city.name+ ', '+ city.stateName : city.name ;
            document.getElementById(populateDestId).value = content;
        }
        // after selecting close sidebar
        this.props.displaySideView({sureVal: false});
    }

    ownPlace = (city, populateDestId) =>{
        // action on selecting a place
        if (populateDestId){
            document.getElementById(populateDestId).value = city;
        }
        // after selecting close sidebar
        this.props.displaySideView({sureVal: false});
    }
    findPlaces = (value) =>{
        let phase = value.toLowerCase();
        if(!phase){
            // show last filtered results
            return true
        }
        let matchedStates = [];
        this.state.allStates.map((item, index) => {
            if(item.toLocaleLowerCase().startsWith(phase)){
                matchedStates.push({"id": "st"+index, "name": item, "stateName": null})
            }
            return item
        })
            
        let matchedCities = cities.filter(item => item.name.toLowerCase().startsWith(phase));
        // let results = [...matchedStates, ...matchedCities]
        this.setState({
            output: [...matchedStates, ...matchedCities],
            searchedPhase: phase
        })
    }

    render() {
        return (
            <React.Fragment>
                <SideBarHead 
                displaySideView={this.props.displaySideView} 
                searchPlaceHolder={this.props.searchPlaceHolder}
                searchOnChange={this.findPlaces}
                focusSearchBar={true}
                />
                {this.state.searchedPhase !==""?
                <div className="city-block own-place" key={"manual"}
                onClick={this.ownPlace.bind(this, this.state.searchedPhase, this.props.populateOnDestinationID)}
                >
                <MdMyLocation className="map-icon" /> Add your entered place
                </div>
                :
                ""
            
                }
                
                {this.state.output.length > 1?
                <React.Fragment>
                <div className="select-label">Or select from locations below</div>
                {this.state.output.map(city =>(
                    <div key={city.id} className="city-block" 
                    onClick={this.selectPlace.bind(this, city, this.props.populateOnDestinationID)}>
                        <FaMapMarkerAlt className="map-icon" /> {city.name} {city.stateName? <span>, {city.stateName}</span>:""}
                    </div>
                ))}
                </React.Fragment>
                :
                <div className='info-mssg'>Enter First 3 letters of the place you are searching for / add your custom location</div>
                }
                
            </React.Fragment>
        )
    }
}

export default IndianCityList

