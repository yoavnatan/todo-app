import { utilService } from './util.service.js'
import { showErrorMsg } from './event-bus.service.js'
// import { download } from '../../services/util.service.js'
// import { pdfService } from '../../services/pdf.service.js'
import { userService } from "./user.service.js"

import fs from 'fs'
// import PDFDocument from 'pdfkit-table'

const BASE_URL = '/api/todo'
const PAGE_SIZE = 4
var gFilteredTodosLength

export const todoService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyTodo,
    getFilterFromSearchParams,
    getImportanceStats,
    getDonePercentage

}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
        .then(todos => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                todos = todos.filter(todo => regExp.test(todo.txt))
            }

            if (filterBy.importance) {
                todos = todos.filter(todo => todo.importance >= filterBy.importance)
            }

            if (filterBy.isDone) {
                todos = todos.filter(todo => JSON.stringify(todo.isDone) === filterBy.isDone)
            }

            if (filterBy.sort) {
                if (filterBy.sort === 'txt') {
                    todos = todos.sort((a, b) => a.txt.localeCompare(b.txt));
                } else {
                    todos = todos.sort((a, b) => a.createdAt - b.createdAt);
                }
            }

            gFilteredTodosLength = todos.length
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE;
                todos = todos.slice(startIdx, startIdx + PAGE_SIZE)
            }
            return Promise.all([getDonePercentage(filterBy), getMaxPage(filterBy)])
                .then(([doneTodosPercent, maxPage]) => {
                    return { todos, maxPage, doneTodosPercent }
                })

        })

}

function getById(todoId) {
    return axios.get(BASE_URL + '/' + todoId)
        .then(res => res.data)
        .catch(err => showErrorMsg(`${err.response.data}`, err))

}

function remove(todoId) {
    return axios.delete(BASE_URL + '/' + todoId)
        .then(() => {
            console.log('deleted')
            return Promise.all([getDonePercentage({}), getMaxPage({})])
                .then(([doneTodosPercent, maxPage]) =>
                    ({ maxPage, doneTodosPercent })
                )
        })
}

function save(todo) {
    if (!userService.getLoggedinUser()) return Promise.reject('User is not logged in')
    return ((todo._id) ? _edit(todo) : _add(todo))
        .then((savedTodo) => {
            return Promise.all([getDonePercentage({}), getMaxPage({})])
                .then(([doneTodosPercent, maxPage]) =>
                    ({ maxPage, doneTodosPercent, savedTodo })
                )
        })
}


function _add(todo) {
    console.log(todo)
    todo.createdAt = todo.updatedAt = Date.now()
    return axios.post(BASE_URL, todo)
        .then(res => res.data)
        .catch(err => {
            console.error('Cannot add todo:', err)
            throw err
        })
}

function _edit(todo) {
    todo.updatedAt = Date.now()
    return axios.put(BASE_URL + '/' + todo._id, todo)
        .then(res => res.data)
        .catch(err => {
            console.error('Cannot update todo: ', err)
            throw err
        })
}


// another syntax:

// const method = bug._id ? 'put' : 'post'
// const bugId = bug._id ? `${bug._id}` : ''

// return axios[method](BASE_URL + '/' + bugId, bug).then(res => res.data).catch(console.error)


function getEmptyTodo(txt = '', importance = 5) {
    return { txt, importance, isDone: false }
}

function getDefaultFilter() {
    return { txt: '', importance: 0, pageIdx: 0, sort: '' }
}


function getDonePercentage(filterBy = {}) {

    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
        .then(todos => {
            console.log(todos)
            const doneTodosCount = todos.reduce((acc, todo) => {
                if (todo.isDone) acc++
                return acc
            }, 0)
            return (doneTodosCount / todos.length) * 100 || 0
        })
        .catch(err => {
            console.error('Cannot get done todos percent:', err)
            throw err
        })
}


function getMaxPage(filterBy = {}) {
    if (gFilteredTodosLength) return Promise.resolve(Math.ceil(gFilteredTodosLength / PAGE_SIZE))
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
        .then(todos => Math.ceil(todos.length / PAGE_SIZE))
        .catch(err => {
            console.error('Cannot get max page:', err)
            throw err
        })
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || ''
    }
    return filterBy
}

function getImportanceStats() {
    return query(TODO_KEY)
        .then(todos => {
            const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
            const data = Object.keys(todoCountByImportanceMap).map(speedName => ({ title: speedName, value: todoCountByImportanceMap[speedName] }))
            return data
        })

}

function _setNextPrevTodoId(todo) {
    return storageService.query(TODO_KEY).then((todos) => {
        const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
        const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
        const prevTodo = todos[todoIdx - 1] ? todos[todoIdx - 1] : todos[todos.length - 1]
        todo.nextTodoId = nextTodo._id
        todo.prevTodoId = prevTodo._id
        return todo
    })
}

function _getTodoCountByImportanceMap(todos) {
    const todoCountByImportanceMap = todos.reduce((map, todo) => {
        if (todo.importance < 3) map.low++
        else if (todo.importance < 7) map.normal++
        else map.urgent++
        return map
    }, { low: 0, normal: 0, urgent: 0 })
    return todoCountByImportanceMap
}