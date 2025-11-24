const { useSelector } = ReactRedux
export function ProgressBar() {

    const doneTodos = useSelector((state) => state.todos.filter(todo => todo.isDone).length)
    const todosCount = useSelector((state) => state.todos.length)
    const progress = Math.floor(doneTodos / todosCount * 100)

    // const progress = todosCount && doneCounter > 0 ? Math.floor(doneCounter / todosCount * 100) : 0;
    return (
        <h2 className="progress">progress: <span>
            {`${progress}%`}
        </span>
            <div style={{
                backgroundColor: 'orange', width: `${progress}%`, height: `19px`
            }}></div></h2 >
    )
}