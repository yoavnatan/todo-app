const { useSelector } = ReactRedux
export function ProgressBar() {

    // const doneTodos = useSelector((storeState) => storeState.todosModule.todos.filter(todo => todo.isDone).length)
    // const todosCount = useSelector((storeState) => storeState.todosModule.todos.length)
    const progress = useSelector((storeState) => storeState.todosModule.doneTodosPercent)
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