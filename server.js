import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
// import PDFDocument from 'pdfkit'

import { todoService } from './services/todo.service.js'
import { loggerService } from './services/logger.service.js'
// import { pdfService } from './public/services/pdf.service.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'


const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.use((req, res, next) => {

    console.log(req.path);
    console.log(req.method);
    console.log(req.query);


    next()
})

app.set('query parser', 'extended')

app.get('/api/todo', (req, res) => {
    const queryOptions = req.query
    console.log(queryOptions)
    todoService.query()
        .then(todos => res.send(todos))
        .catch(err => {
            loggerService.error('Cannot get todos', err)
            res.status(400).send('Cannot get todos')
        })
})

// function parseQueryParams(queryParams) {
//     const filterBy = {
//         txt: queryParams.txt || '',
//         minSeverity: +queryParams.minSeverity || 0,
//         labels: queryParams.labels || [],
//     }

//     const sortBy = {
//         sortField: queryParams.sortField || '',
//         sortDir: +queryParams.sortDir || 1,
//     }

//     const pagination = {
//         pageIdx: queryParams.pageIdx !== undefined ? +queryParams.pageIdx || 0 : queryParams.pageIdx,
//         pageSize: +queryParams.pageSize || 3,
//         paginationOn: queryParams.paginationOn
//     }

//     return { filterBy, sortBy, pagination }
// }


app.get('/api/todo/:id', (req, res) => {
    // const { visitedtodos = [] } = req.cookies
    const { id: todoId } = req.params

    todoService
        .getById(todoId)
        .then(todo => res.send(todo))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})



app.post('/api/todo', (req, res) => {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot add todo')

    const todo = { // must be explicit
        txt: req.body.txt,
        importance: req.body.importance,
        isDone: req.body.isDone
    }


    if (!todo.txt || todo.importance === undefined) return res.status(400).send('Missing required fields')

    todoService.save(todo)
        .then(todo => res.send(todo))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })

})

app.put('/api/todo/:id', (req, res) => {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot edit todo')
    const { _id, txt, isDone, importance, color } = req.body //no createdAt here, came from the front

    if (!_id || !txt || importance === undefined) return res.status(400).send('Missing required fields')
    const todo = { _id, txt, importance: +importance, isDone, color }
    console.log('hi')
    todoService.save(todo)
        .then(savedtodo => res.send(savedtodo))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})

app.delete('/api/todo/:id', (req, res) => {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot delete car')

    const todoId = req.params.id

    todoService
        .remove(todoId)
        .then(() => res.send('todo Removed'))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})


//Auth API: 
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body
    authService.checkLogin({ username, password })
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('cannot signup', err)
            res.status(404).send('Invalid Credentials')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const { username, password, fullname } = req.body
    userService.add({ username, password, fullname })
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})



app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

// User API


app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

app.get('/api/user/todos/:userId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add todo')
    const { userId } = req.params
    todoService.getUsertodos(userId)
        .then(todos => res.send(todos))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })

})

app.delete('/api/user/:userId', (req, res) => {
    console.log('deleting user')
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete todo')

    const { userId } = req.params

    userService
        .remove(userId, loggedinUser)
        .then(() => res.send('user Removed'))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})

// Fallback route

app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const port = process.env.PORT || 3030
app.listen(port, () => {
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})


