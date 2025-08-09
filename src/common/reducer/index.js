// reducer/index.js
const userStorage = localStorage.getItem('user');
const user = JSON.parse(userStorage);
const initialState = user ? {
  isLogin: true,
  username: user.username,
  domain: user.domain,
  token: user.token,
  refresh_token: user.refresh_token,
  debug: !!user.debug
} : {
  isLogin: false,
  username: "",
  domain: "",
  token: "",
  refresh_token: "",
  debug: false
}

const reducer = (state = initialState, action)=> {
  switch (action.type) {
    case 'LOGIN':
      const user = {
        username: action.payload.username,
        domain: action.payload.domain,
        token: action.payload.token,
        refresh_token: action.payload.refresh_token,
        debug: action.payload.debug
      };
      localStorage.setItem('user', JSON.stringify(user));
      return {
        ...state,
        isLogin: true,
        ...user
      }
    case 'LOGOUT':
      localStorage.clear();
      return {
        ...state,
        isLogin: false,
        username: "",
        domain: "",
        token: "",
        refresh_token: "",
        debug: false
      }
    default:
      return state
  }
}

export default reducer;
