import { getCurrentTimeInMS } from "../utility/Utility";

const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_POSTS':
            return {
                ...state,
                feeds: action.payload["feeds"],
                feeds_paginator: action.payload["paginator"],
                feeds_updated: action.payload["feeds_updated"],
            };
        case 'ADD_POST':
            return {
                ...state,
                feeds: state.feeds.concat(action.payload),
                feeds_updated: getCurrentTimeInMS(),
            };
        case 'REMOVE_POST':
            return {
                ...state,
                feeds: state.feeds.filter(post => post.id !== action.payload)
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        case 'SET_USER':
            return {
                ...state,
                user_data: action.payload
            };
        
        case 'SET_CHATROOM':
            return{
                ...state,
                [action.payload.room]: action.payload
            }
        case 'ADD_RECORD_TO_CHATROOM':
            let updated = state[action.payload.room]
            updated.chats = updated.chats.concat(action.payload.chats)
            return{
                ...state,
                [action.payload.room]: updated
            }

        case 'ADD_RECORD_TO_CHATROOM_BEGINNING':
            updated = state[action.payload.room]
            updated.chats = [...action.payload.chats, ...updated.chats]
            return{
                ...state,
                [action.payload.room]: updated
            }
        default:
            return state;
    }
};

export default Reducer;