import { TodoPreview } from "./TodoPreview.jsx"
const { Link } = ReactRouterDOM

export function TodoList({ todos, onRemoveTodo, onToggleTodo, onChangeColor }) {


    return (

        <ul className="todo-list">
            {!todos || todos.length <= 0
                ? <div>No Todos to show...</div>
                : todos.map(todo =>
                    <li key={todo._id} >
                        <TodoPreview todo={todo} onToggleTodo={() => onToggleTodo(todo)} />
                        <section>
                            <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                            <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                            <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                            <input type="color" id="todo-color" name="todo-color" value={todo.color || "#99a695"} onChange={(ev) => onChangeColor(ev.target, todo)} />
                        </section>
                    </li>
                )}
        </ul>
    )
}