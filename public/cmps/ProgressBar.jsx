const { useSelector } = ReactRedux
export function ProgressBar() {

    const progress = useSelector((storeState) => storeState.todosModule.doneTodosPercent)
    return (
        <section className="todos-progress">
            <h2 className="progress">progress:</h2>
            <div className="progress-bar-container">
                <span>
                    {`${progress.toFixed(1)}%`}
                </span>
                <div style={{ width: `${progress}%` }}></div>
            </div>
        </section>
    )
}