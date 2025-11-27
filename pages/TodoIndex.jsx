


import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { cleanObject } from "../services/util.service.js"
import { loadTodos, removeTodo, saveTodo } from "../store/actions/todo.actions.js"
import { DECREMENT, INCREASE_BALANCE } from "../store/store.js"
import { addActivity, updateUser, updateBalance } from "../store/actions/user.actions.js"


const { useState, useEffect, useRef } = React
const { useSelector, useDispatch } = ReactRedux
const { Link, useSearchParams } = ReactRouterDOM

export function TodoIndex() {

    const todos = useSelector((storeState) => storeState.todosModule.todos)
    const isLoading = useSelector((storeState) => storeState.todosModule.isLoading)
    const loggedinUser = useSelector((storeState) => storeState.userModule.loggedinUser)

    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)

    const [filterBy, setFilterBy] = useState(defaultFilter)

    const dispatch = useDispatch()

    // const debouncedOnSetFilterBy =
    //     useRef(debounce(setFilterBy, 500)).current


    useEffect(() => {
        setSearchParams(cleanObject(filterBy))
        loadTodos(filterBy)
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load todos')
            })
    }, [filterBy])

    function onRemoveTodo(todoId) {
        let userConfirm = confirm('are you sure?')
        if (!userConfirm) return //TODO: make this one with promise and a modal. try SWAL
        removeTodo(todoId)
            .then(() => {
                // dispatch({ type: DECREMENT })
                showSuccessMsg(`Todo removed`)
            })
            .then(() => {

                // const activity = 
                // updateUser({ ...loggedinUser, })
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot remove todo ' + todoId)
            })
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }

        saveTodo(todoToSave)
            .then((savedTodo) => {
                if (savedTodo.isDone) {
                    updateBalance(10)
                }
                showSuccessMsg(`Todo is ${(savedTodo.isDone) ? 'done' : 'back on your list'}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todo._id)
            })
    }


    function onChangeColor(target, todo) {

        const todoToSave = { ...todo, color: target.value }
        saveTodo(todoToSave)
            .then((savedTodo) => console.log(savedTodo))
            .catch((err) => {
                console.log('err', err)
                showErrorMsg('Cannot change color' + todo._id)
            })

    }
    // if (!todos || todos.length <= 0) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={setFilterBy} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            {isLoading
                ? <div className="loading">Loading...</div>
                : <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} onChangeColor={onChangeColor} />
            }


        </section>
    )
}