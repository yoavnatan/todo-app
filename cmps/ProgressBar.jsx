const { useSelector } = ReactRedux
export function ProgressBar() {

    const progress = useSelector((storeState) => storeState.todosModule.doneTodosPercent)
    return (
        <h2 className="progress">progress: <span>
            {`${progress}%`}
        </span>
            <div style={{
                backgroundColor: 'orange', width: `${progress}%`, height: `19px`
            }}></div></h2 >
    )
}