const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector, useDispatch } = ReactRedux

import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'
import { ProgressBar } from './ProgressBar.jsx'
import { logout } from '../store/actions/user.actions.js'



export function AppHeader() {
    const navigate = useNavigate()

    const user = useSelector((storeState) => storeState.userModule.loggedinUser)
    const todos = useSelector((storeState) => storeState.todosModule.todos)

    function onLogout() {
        logout()
            .then(() => {
                navigate('/')
            })
            .catch(() => {
                showErrorMsg('OOPs try again')
            })
    }


    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {user ? (
                    < section >

                        <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                        <h3>Balance: <span>{user.balance}</span></h3>
                        <button onClick={onLogout}>Logout</button>
                    </ section >
                ) : (
                    <section>
                        <LoginSignup />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
                {todos.length > 0 && <ProgressBar />}
            </section>
            <UserMsg />
        </header>
    )
}
