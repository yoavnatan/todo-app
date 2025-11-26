import { userService } from "../services/user.service.js"
import { updateUser } from "../store/user.actions.js"

const { useState, useEffect } = React
const { useSelector, useDispatch } = ReactRedux
const { useParams } = ReactRouterDOM


export function UserDetails() {

    const { userId } = useParams()
    const loggedinUser = useSelector((state) => state.loggedinUser)

    const [userToSave, setUserToSave] = useState(loggedinUser)

    function handleChange({ target }) {
        let field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break
            case 'color':
                value = { [field]: value }
                field = 'prefs'

            default: break

        }
        if (field === 'prefs') return setUserToSave(prevUser => ({ ...prevUser, [field]: { ...prevUser.prefs, ...value } }))
        setUserToSave(prevUser => ({ ...prevUser, [field]: value }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
        console.log(userToSave)
        updateUser(userToSave)
    }


    return (
        <React.Fragment>
            <pre>{JSON.stringify(loggedinUser, null, 2)}</pre>
            {userId === loggedinUser._id &&
                <form className="user-Prefs" onSubmit={onSubmit}>
                    <label htmlFor="fullname">Full Name:</label>
                    <input type="text" name="fullname" id="fullname" placeholder="Edit" onChange={handleChange}  ></input>
                    <label htmlFor="color">Color: </label>
                    <input type="color" name="color" id="color" onChange={handleChange} value={userToSave.prefs.color
                        ? userToSave.prefs.color
                        : '##000000'}></input>
                    <label htmlFor="backgroundColor">BG Color: </label>
                    <input type="color" name="backgroundColor" id="backgroundColor" onChange={handleChange} value={userToSave.prefs.backgroundColor
                        ? userToSave.prefs.backgroundColor
                        : '#fffff'} ></input>
                    <button>Save</button>
                </form>}
        </React.Fragment>
    )
}