import { userService } from "../services/user.service.js"
import { SET_USER, store } from "./store.js"


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