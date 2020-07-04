import cities from "../utility/cities.json";
import React, { Component } from 'react'
import "../assets/css/cityList.css";

export class cityList extends Component {
    render() {
        console.log(cities);
        return (
            <React.Fragment>
                {cities.cities.map(city=>(
                    <div className="city-block">
                        {city}
                    </div>
                ))}
            </React.Fragment>
        )
    }
}

export default cityList

