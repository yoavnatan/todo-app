const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector, useDispatch } = ReactRedux

import { ProgressBar } from './ProgressBar.jsx'

export function AppFooter() {

    const todos = useSelector((storeState) => storeState.todosModule.todos)

    return (
        <footer className="app-footer full main-layout">
            <section className="footer-container">
                {todos.length > 0 && <ProgressBar />}
            </section>
        </footer>
    )
}
