import cities from "../utility/cityStates.json";
import React, { Component } from 'react'
import "../assets/css/cityList.css";
import { SideBarHead } from "./SideBar";


export class IndianCityList extends Component {
    state ={
        allStates: [
        "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
        "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", 
        "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", 
        "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Puducherry", "Punjab", 
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
        output:[]
    }

    selectPlace = (city, populateDestId) =>{
        // action on selecting a place
        if (populateDestId){
            let content = city.stateName? city.name+ ', '+ city.stateName : city.name ;
            document.getElementById(populateDestId).value = content;
        }

    }
    findPlaces = (value) =>{
        console.log("received phase", value)
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
            output: [...matchedStates, ...matchedCities]
        })
    }

    render() {
        return (
            <React.Fragment>
                <SideBarHead 
                displaySideView={this.props.displaySideView} 
                searchPlaceHolder={this.props.searchPlaceHolder}
                searchOnChange={this.findPlaces}
                />
                {this.state.output.map(city =>(
                    
                    <div key={city.id} className="city-block" 
                    onClick={this.selectPlace.bind(this, city, this.props.populateOnDestinationID)}>
                        {city.name} {city.stateName? <span>, {city.stateName}</span>:""}
                    </div>
                ))}
            </React.Fragment>
        )
    }
}

export default IndianCityList

