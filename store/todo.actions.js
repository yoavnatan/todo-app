import { todoService } from "../services/todo.service.js";
import { REMOVE_TODO, SET_IS_LOADING, SET_TODOS, store, UPDATE_TODO, ADD_TODO } from "./store.js";
import { addActivity } from "./user.actions.js";

export function loadTodos(filterBy) {

    store.dispatch({ type: SET_IS_LOADING, isLoading: true })

    return todoService.query(filterBy)
        .then(todos => {
            store.dispatch({ type: SET_TODOS, todos })
        })
        .catch(err => {
            console.log('Cannot load todos', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        })
}

export function removeTodo(todoId) {

    return todoService.remove(todoId)
        .then(() => {
            store.dispatch({ type: REMOVE_TODO, todoId })
        })
        .catch(err => {
            console.log('Cannot remove todo', err)
            throw err
        })
}

export function saveTodo(todoToSave) {
    const type = todoToSave._id ? UPDATE_TODO : ADD_TODO

    return todoService.save(todoToSave)
        .then((savedTodo) => {
            store.dispatch({ type, todo: savedTodo })
            console.log('saved')
            return addActivity('SAVED TODO')
        })
        .catch(err => {
            console.log('Cannot remove todo', err)
            throw err
        })
}

