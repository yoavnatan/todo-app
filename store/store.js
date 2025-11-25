import { todoService } from "../services/todo.service.js"
import { userService } from "../services/user.service.js"

const { createStore } = Redux

export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const SET_IS_LOADING = 'SET_IS_LOADING'

export const INCREASE_BALANCE = 'INCREASE_BALANCE'
export const DECREMENT = 'DECREMENT'

export const SET_USER = 'LOGIN'


const initialState = {
    todos: [],
    isLoading: false,
    filterBy: {},
    loggedinUser: userService.getLoggedinUser(),
    doneCounter: 0,
}

function appReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_TODOS:
            return {
                ...state,
                todos: [...cmd.todos]
            }
        case REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo._id !== cmd.todoId)
            }
        case ADD_TODO:
            return {
                ...state,
                todos: [cmd.todo, ...state.todos]
            }
        case UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo => todo._id === cmd.todo._id ? cmd.todo : todo)
            }
        case DECREMENT:
            return {
                ...state,
                doneCounter: state.doneCounter - 1
            }
        case INCREASE_BALANCE:
            return {
                ...state,
                loggedinUser: { ...state.loggedinUser, balance: state.loggedinUser.balance + cmd.diff }
            }
        case SET_USER:
            return {
                ...state,
                loggedinUser: cmd.loggedinUser
            }

        default: return state
    }
}


export const store = createStore(appReducer)

window.gStore = store
