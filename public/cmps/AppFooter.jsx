const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector, useDispatch } = ReactRedux

import { ProgressBar } from './ProgressBar.jsx'

export function AppFooter() {

    const todos = useSelector((storeState) => storeState.todosModule.todos)
    const user = useSelector((storeState) => storeState.userModule.loggedinUser)

    function getStyleByUser() {
        if (!user) return {}
        const { color = 'white', backgroundColor = 'black' } = user.prefs
        return { color, backgroundColor }
    }

    return (
        <footer style={getStyleByUser()} className="app-footer full main-layout">
            <section className="footer-container">
                {todos.length > 0 && <ProgressBar />}
            </section>
        </footer>
    )
}
