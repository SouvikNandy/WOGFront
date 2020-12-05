
import React, {createContext, useReducer} from "react";
import Reducer from './Reducer'


const initialState = {
    feeds: null,
    feeds_paginator: null,
    feeds_updated: null,
    user_data: null,
    error: null,
    // also chat data to be stored dynamically

};

const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default Store;