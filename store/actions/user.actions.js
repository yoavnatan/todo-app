import { userService } from "../../services/user.service.js"
import { ADD_ACTIVITY, SET_USER, UPDATE_USER, SET_USER_BALANCE } from "../reducers/user.reducer.js"
import { store } from "../store.js";


export function login(credentials) {

    return userService.login(credentials)
        .then(loggedinUser => {
            store.dispatch({ type: SET_USER, loggedinUser })
        })
        .catch(err => {
            console.log('Cannot login', err)
            throw err
        })

}

export function signup(credentials) {
    return userService.signup(credentials)
        .then(savedUser => {
            console.log(savedUser)

            store.dispatch({ type: SET_USER, loggedinUser: savedUser })
        })
        .catch(err => {
            console.log('Cannot signup', err)
            throw err
        })
}

export function logout() {

    return userService.logout()
        .then(() => {
            store.dispatch({ type: SET_USER, loggedinUser: null })
        })
        .catch(err => {
            throw err
        })
}

export function updateUser(user) {

    return userService.updateUser(user)
        .then((updatedUser) => {
            store.dispatch({ type: SET_USER, user: updatedUser })
        })
        .catch(err => {
            console.error('Cannot update user:', err)
            throw err
        })

}

export function updateBalance(diff) {

    return userService.updateUserBalance(diff)
        .then(newBalance => {
            console.log(newBalance)
            store.dispatch({ type: SET_USER_BALANCE, balance: newBalance })
            return newBalance
        })
        .catch(err => {
            throw err
        })
}


export function addActivity(txt) {

    return userService.addActivity(txt)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            throw err
        })
}
