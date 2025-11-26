import { userService } from "../services/user.service.js"
import { ADD_ACTIVITY, SET_USER, store, UPDATE_USER, SET_USER_BALANCE } from "./store.js"


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
    console.log(user)

    return userService.saveUser(user)
        .then((savedUser) => {
            console.log(savedUser)
            store.dispatch({ type: UPDATE_USER, user: savedUser })
        })

}

export function updateBalance(diff) {

    return userService.updateUserBalance(diff)
        .then(newBalance => {
            console.log(newBalance)
            store.dispatch({ type: SET_USER_BALANCE, balance: newBalance })
        })
        .catch(err => {
            throw err
        })
}




// export function addActivity(user, activity = '') {

//     const userToSave = { ...user, activities: [...user.activities, activity] }
// }
// return userService.saveUser(userToSave)
//     .then((savedUser) => {
//         store.dispatch({ type: UPDATE_USER, user: savedUser })
//     })


