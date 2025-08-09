import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'

import './App.css';
import Login from './pages/login'
import Home from './pages/home'
import store from './common/store'

function PrivateRoute({ component: Component, ...rest }) {
  const isLogin = useSelector((state) => state.isLogin);
  return (
    <Route
      {...rest}
      render={(props) => (
        isLogin ? <Component {...props} /> : <Redirect to="/login" />
      )}
    />
  );
}

function App() {
  return (
    <div className="App">
      <Provider store={ store }>
        <HashRouter>
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute path="/home" component={Home} />
            <Route exact path="/" render={() => (<Redirect to="/home" />)} />
          </Switch>
        </HashRouter>
      </Provider>
    </div>
  );
}

export default App;
