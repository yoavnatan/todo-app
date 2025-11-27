import { todosReducer } from "./reducers/todos.reducer.js"
import { userReducer } from "./reducers/user.reducer.js"

const { createStore, combineReducers, compose } = Redux

const rootReducer = combineReducers({
    todosModule: todosReducer,
    userModule: userReducer
})


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers())

window.gStore = store
