/**
 * @description : This file is for login page code logic
 * @author      : Anderson.Yao
 */

import { Component } from 'react'
import { connect } from 'react-redux'
import { loginAction } from '../../common/action'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './login.css'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            debug: false,
            environment: "sit",
            username: "",
            password: "",
            alert: "",
            open: false
        };
    }
    
    render() {
        return (
            <div className="mock-solution-login" >
                {this.state.alert && <Collapse in={this.state.open} ><Alert severity="error" onClose={() => this.setState({open: false})} >{this.state.alert}</Alert></Collapse> }
                <h1>API Mock Solution UI</h1>
                <form className="login-form" noValidate autoComplete="off" style={{ margin: 30 }}>
                    <Grid
                        container
                        spacing={2}
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item >
                            <TextField id="login-username" label="Username" variant="outlined" style={{ width: 400 }} 
                            onChange={(event) =>
                                this.setState({username: event.target.value})
                            } value={this.state.username} />
                        </Grid>
                        <Grid item >
                            <TextField id="login-password" type="password" label="Password (No Required)" variant="outlined" style={{ width: 400 }} 
                            onChange={(event) =>
                                this.setState({password: event.target.value})
                            } value={this.state.password} disabled/>
                        </Grid>
                        <Grid item >
                            <Button variant="contained" color="default" id="sign-up-button" style={{ margin: 10 }} onClick={() => {}} disabled>Sign Up</Button>
                            <Button variant="contained" color="primary" id="login-button" style={{ margin: 10 }} onClick={() => this.login()}>Login</Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        )
    }

    async login() {
        let token, refresh_token;
        const domain = "sit-api";

        if ((this.state.debug || (domain && this.state.username)) || (token !== undefined && token !== null)) {
            this.props.sendLogin(domain, token, refresh_token, this.state.username, this.state.debug);
            this.props.history.push('/home');
        }
        else {
            this.setState({
                username: "",
                password: "",
                alert: "Your username or password is incorrect, please try again !",
                open: true
            })
        }
    }
}

const mapDispatchToProps = dispatch => {
    return {
      // dispatch one loginAction
      sendLogin: (domain, token, refresh_token, username, debug)=> {
        dispatch(loginAction(domain, token, refresh_token, username, debug))
      }
    }
}
  
export default connect(null, mapDispatchToProps)(Login);