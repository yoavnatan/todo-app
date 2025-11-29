export function ActivitiesList({ activities, getActivityTime }) {
    return (
        <div>
            <h3>Activities: </h3>
            <ul className='activities-list clean-list'>
                {activities.map((activity) => (
                    <li key={activity.at}>{getActivityTime(activity)} | {activity.txt}</li>
                ))}
            </ul >
        </div>
    )
}