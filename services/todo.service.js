import { makeId, readJsonFile, writeJsonFile, getRandomIntInclusive } from './util.service.js'
import fs from 'fs'
// import PDFDocument from 'pdfkit-table'


export const todoService = {
    query,
    getById,
    remove,
    save,
}
const PAGE_SIZE = 3
const todos = readJsonFile('./data/todo.json')

function query(filterBy = {}) {

    return Promise.resolve(todos)
}

function getById(todoId) {
    const todo = todos.find(todo => todo._id === todoId)
    if (!todo) return Promise.reject('todo not found')
    return Promise.resolve(todo)
}

function remove(todoId) {
    const idx = todos.findIndex(todo => todo._id === todoId)
    if (idx === -1) return Promise.reject('todo not found')

    todos.splice(idx, 1)
    return _savetodos()
}

function save(todo) {
    console.log(todo)
    if (todo._id) {
        const todoToUpdate = todos.find(currtodo => currtodo._id === todo._id)

        todoToUpdate.isDone = todo.isDone
        todoToUpdate.createdAt = todo.createdAt
        todoToUpdate.txt = todo.txt
        todoToUpdate.importance = todo.importance
        todoToUpdate.color = todo.color

        // const idx = todos.findIndex(b => b._id === todo._id)
        // if (idx === -1) return Promise.reject('todo not found')
        // todos[idx] = { ...todo[idx], ...todo } //patch --- because there is no createdAt at the saved todo that came from the front
    } else {
        todo._id = makeId()
        todo.createdAt = todo.updatedAt = Date.now() - getRandomIntInclusive(0, 1000 * 60 * 60 * 24)
        todo.color = 'white'
        todo.isDone = todo.isDone || false

        // todo.creator = loggedinUser
        todos.unshift(todo)
    }
    return _savetodos()
        .then(() => todo)
}


function _savetodos() {
    return writeJsonFile('./data/todo.json', todos)
}

