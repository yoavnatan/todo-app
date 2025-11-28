const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector, useDispatch } = ReactRedux

import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'
import { ProgressBar } from './ProgressBar.jsx'
import { logout } from '../store/actions/user.actions.js'
import { TOGGLE_MENU } from "../store/reducers/todos.reducer.js"



export function AppHeader() {
    const navigate = useNavigate()

    const user = useSelector((storeState) => storeState.userModule.loggedinUser)
    const todos = useSelector((storeState) => storeState.todosModule.todos)
    const menuIsOpen = useSelector((storeState) => storeState.todosModule.menuIsOpen)
    const dispatch = useDispatch()

    function onLogout() {
        logout()
            .then(() => {
                navigate('/')
            })
            .catch(() => {
                showErrorMsg('OOPs try again')
            })
    }

    function onToggleMenu() {
        dispatch({ type: TOGGLE_MENU })
    }

    function getStyleByUser() {
        if (!user) return {}
        const { color, backgroundColor } = user.prefs
        return { color, backgroundColor }
    }

    console.log(menuIsOpen)

    return (
        <header style={getStyleByUser()} className={`app-header full main-layout ${menuIsOpen ? 'menu-open' : ''} `}>
            <div className="main-screen" onClick={() => onToggleMenu()}></div>
            <section className="header-container flex">
                <h1>Todos</h1>
                {user ? (
                    < section className="user">

                        <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                        <h3>Balance: <span>{user.balance}</span></h3>
                        <button onClick={onLogout}>Logout</button>
                    </ section >
                ) : (
                    <section>
                        <LoginSignup />
                    </section>
                )}

                {todos.length > 0 && <ProgressBar />}
                <button className="btn btn-menu" onClick={() => onToggleMenu()}><span className="material-symbols-outlined">
                    menu
                </span></button>
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
