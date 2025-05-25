// actions/index.js
export const loginAction = (domain, token, refresh_token, username, debug) => {
    return {
        type: 'LOGIN',
        payload: {
            debug,
            domain, 
            token,
            refresh_token,
            username
        }
    }
}

export const logoutAction = () => {
    return {
        type: 'LOGOUT'
    }
}