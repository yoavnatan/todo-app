import { userService } from "../../services/user.service.js"

export const INCREASE_BALANCE = 'INCREASE_BALANCE'

export const SET_USER = 'LOGIN'
export const UPDATE_USER = 'UPDATE_USER'
export const ADD_ACTIVITY = 'ADD_ACTIVITY'
export const SET_USER_BALANCE = 'SET_USER_BALANCE'


const initialState = {

    loggedinUser: userService.getLoggedinUser(),

}

export function userReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {

        case INCREASE_BALANCE:
            return {
                ...state,
                loggedinUser: { ...state.loggedinUser, balance: state.loggedinUser.balance + cmd.diff }
            }
        case SET_USER:
            return {
                ...state,
                loggedinUser: cmd.user
            }

        case SET_USER_BALANCE:
            return {
                ...state,
                loggedinUser: { ...state.loggedinUser, balance: cmd.balance }
            }


        default: return state
    }
}


