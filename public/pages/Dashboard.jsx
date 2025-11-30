const { useEffect, useState } = React
import { Chart } from '../cmps/Chart.jsx'
import { todoService } from '../services/todo.service.js'
const { useSelector, useDispatch } = ReactRedux

export function Dashboard() {
    const todos = useSelector((storeState) => storeState.todosModule.todos)
    // const [todos, setTodos] = useState([])
    const [importanceStats, setImportanceStats] = useState([])

    useEffect(() => {
        // todoService.query()
        //     .then()
        todoService.getImportanceStats()
            .then(setImportanceStats)
    }, [])
    console.log(todos)

    return (
        <section className="dashboard">
            <h1>Dashboard</h1>
            <h2>Statistics for {todos.length} Todos</h2>
            <hr />
            <h4>By Importance</h4>
            <Chart data={importanceStats} />
        </section>
    )
}