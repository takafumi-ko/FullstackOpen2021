import React, { useState } from 'react'
import loginService from '../services/login'
import blogsService from '../services/blogs'
import PropTypes from 'prop-types'

const Login = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password,
            })
            window.localStorage.setItem(
                'loggedBlogAppUser', JSON.stringify(user)
            )

            props.setUser(user)
            setUsername('')
            setPassword('')
            blogsService.setToken(user.token)

        } catch (exception) {
            console.log('login fail')
            props.setMessage({
                type: 'caution',
                messageText: 'wrong username or password'
            })
            setTimeout(() => {
                props.setMessage(null)
            }, 5000)
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        id="username"
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        id="password"
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

Login.propTypes = {
    setUser: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired
}

export default Login