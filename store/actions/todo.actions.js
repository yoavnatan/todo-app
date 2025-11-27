import { todoService } from "../../services/todo.service.js";
import { REMOVE_TODO, SET_IS_LOADING, SET_TODOS, UPDATE_TODO, SET_DONE_TODOS_PERCENT, ADD_TODO, SET_MAX_PAGE } from "../reducers/todos.reducer.js";
import { addActivity } from "./user.actions.js";
import { store } from "../store.js";

export function loadTodos(filterBy) {

    store.dispatch({ type: SET_IS_LOADING, isLoading: true })

    return todoService.query(filterBy)
        .then(({ todos, maxPage, doneTodosPercent }) => {
            store.dispatch({ type: SET_TODOS, todos })
            _setTodosData(doneTodosPercent, maxPage)

            return todos
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
        .then(({ doneTodosPercent, maxPage }) => {
            store.dispatch({ type: REMOVE_TODO, todoId })
            _setTodosData(doneTodosPercent, maxPage)
            addActivity('Removed the Todo: ' + todoId)
        })
        .catch(err => {
            console.log('Cannot remove todo', err)
            throw err
        })
}

export function saveTodo(todoToSave) {
    const type = todoToSave._id ? UPDATE_TODO : ADD_TODO

    return todoService.save(todoToSave)
        .then(({ savedTodo, doneTodosPercent, maxPage }) => {
            store.dispatch({ type, todo: savedTodo })

            _setTodosData(doneTodosPercent, maxPage)

            const actionName = (todoToSave._id) ? 'Updated' : 'Added'
            return addActivity(`${actionName} a Todo: ` + savedTodo.txt)
                .then(() => savedTodo)
        })
        .catch(err => {
            console.log('Cannot save todo', err)
            throw err
        })
}

function _setTodosData(doneTodosPercent, maxPage) {
    store.dispatch({ type: SET_DONE_TODOS_PERCENT, doneTodosPercent })
    store.dispatch({ type: SET_MAX_PAGE, maxPage })
}
