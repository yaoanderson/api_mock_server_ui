import { Fragment, Component } from 'react'
import { Redirect } from "react-router";
import { connect } from 'react-redux'
import axios from 'axios'

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import SettingsIcon from '@material-ui/icons/Settings';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

import './home.css'
import { logoutAction } from '../../common/action'
import ApiConfigDialog from '../../components/apiConfigDialog'

function CircularProgressWithLabel(props) {
    return (
      <Box position="absolute" left='50%' top='50%' style={{ display: props.progressisdisplay, height: 40 }} >
        <CircularProgress variant="determinate" color="inherit" {...props} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color='inherit' >{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography component={'div'}>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            debug: props.debug,
            redirect: props.isLogin ? false : true,
            progress: 0,
            progressIsDisplay: 'none',
            backdrop: false,
            apis: {},
            api_ids: [],
            filterApis: [],
            tab: 0,
            api_all_enabled: false,
            token: props.token,
            refresh_token: props.refresh_token,
        }
    }

    componentDidMount() {
        if (this.state.debug || this.state.token) {
            this.updateProgress(100);
            this.callGetApis();
        }
    }

    render() {
        return (
            <Fragment>
                {this.state.redirect && <Redirect to="/login" /> }
                <div className="mock-server-home">
                    <AppBar position="static">
                        <Paper className="tabs">
                            <Tabs value={this.state.tab} onChange={(event, value) => this.setState({tab: value})} indicatorColor="primary" textColor="primary" centered >
                                <Tab label="API" {...a11yProps(0)} />
                                <Tab label="Others" {...a11yProps(1)} disabled={true} />
                            </Tabs>
                        </Paper>
                        <Button color = "default" id = "logout-button" style = {{ width: 100, position: 'absolute', height: 48, right: 10 }}
                                    onClick = {() => this.logout()} > Logout </Button>
                    </AppBar>
                    <TabPanel value={this.state.tab} index={0} style={{width: 1000, margin: '0 auto'}} >
                        <Autocomplete
                            multiple
                            id="apis_selector"
                            options={this.state.api_ids}
                            getOptionLabel={(option) => option}
                            defaultValue={[]}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Choose APIs"
                                    placeholder="API..."
                                    onKeyDown={(e) => {
                                        if (e.code === 'Enter' && e.target.value) {
                                            const apiList = e.target.value.split(',')
                                            const newApiList = apiList.map(function (api) {
                                                return api.trim()
                                            })
                                            let filterApis = []
                                            while (newApiList.length > 0) {
                                                const api_item = newApiList.pop()
                                                filterApis = filterApis.concat(this.state.apis.filter(api => api === api_item))
                                            }
                                            this.setFilterApis(filterApis)
                                        }
                                    }}
                                />
                            )}
                            onChange={(event, value) => this.setFilterApis(value)}
                            value={this.state.filterApis}
                            style={{ margin: 10, width: 980 }}
                        />
                        <List id="filterApis" >
                            <ListItem key={0} style={{ borderBottom: '1px solid #ccc', backgroundColor: '#d3d3d36b' }} >
                                <ListItemText primary="API" style={{ overflow: 'auto', margin: 'auto 10px auto auto', color: 'rgba(0, 0, 0, 0.54)' }} />
                                <ControlPointIcon onClick={() => this.addApi()} style={{padding: 6, position: 'absolute', left: 60, cursor: 'pointer', color: 'rgba(0, 0, 0, 0.54)' }} />
                                <ListItemSecondaryAction style={{ height: 41, width: 500 }} >
                                    <ListItemText primary="Mock" style={{ overflow: 'auto', margin: '8px 0px 8px 8px', paddingLeft: '35px', color: 'rgba(0, 0, 0, 0.54)', float: 'left' }} />
                                    <Switch
                                        color="primary"
                                        edge="end"
                                        onChange={(event) =>
                                            this.setStatus(null, event.target.checked)
                                        }
                                        checked={this.state.api_all_enabled}
                                        style={{ float: 'left' }} 
                                    />
                                    <SettingsIcon onClick={() => this.openConfig(null)} style={{padding: 6, position: 'relative', float: 'right', top: 1, cursor: 'pointer', height: '28px', color: 'rgba(0, 0, 0, 0.54)' }} />
                                    <ListItemText primary="Batch Config" style={{ overflow: 'auto', margin: '8px 0px 8px 190px', paddingRight: '15px', color: 'rgba(0, 0, 0, 0.54)', float: 'right' }} />
                                </ListItemSecondaryAction>
                            </ListItem>
                            { this.state.filterApis.map((item, index) => {
                                return (
                                    <ListItem key={item} style={{ borderBottom: '1px dotted #ccc' }} >
                                        <ListItemText primary={item} style={{ overflow: 'auto', margin: 'auto 50px auto auto', width: '500px' }} />
                                        <ListItemSecondaryAction style={{ width: 460 }}>
                                            <Switch
                                                color="primary"
                                                edge="end"
                                                onChange={(event) =>
                                                    this.setStatus(index, event.target.checked)
                                                }
                                            />
                                            <SettingsIcon onClick={() => this.openConfig(item)} style={{padding: 6, position: 'relative', float: 'right', marginLeft: 255, top: 1, height: '26px', cursor: 'pointer' }} />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            }) }
                        </List>
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={1} style={{width: 720, margin: '0 auto'}} >
                        Others Content
                    </TabPanel>
                    <ApiConfigDialog onRef={ref => this.apiConfigDialog = ref} updateProgress={(value) => this.updateProgress(value)} domain={this.props.domain} token={this.state.token} refresh_token={this.state.refresh_token} refreshToken={(callback) => this.refreshToken(callback)} filterApis={this.state.filterApis} apis={this.state.apis} ></ApiConfigDialog>
                    <Backdrop style={{ zIndex: 1000, color: '#fff' }} open={this.state.backdrop} onClick={() => {}}>
                        <CircularProgressWithLabel value={this.state.progress} progressisdisplay={this.state.progressIsDisplay} />
                    </Backdrop>
                </div>
            </Fragment>
        )
    }

    updateProgress(targetProgress) {
        const self = this;
        let currentProgress = this.state.progress;
        if (targetProgress < currentProgress) {
            currentProgress = 0;
        }
        let gap = targetProgress - currentProgress;
        let count = 0;
        const progress = setInterval(function(){
            if (count < gap / 10 + 1) {
                self.setState({
                    progress: currentProgress + count * 10,
                    progressIsDisplay: 'block',
                    backdrop: true
                })
            } else {
                clearInterval(progress);
                if (self.state.progress === 100) {
                    self.setState({
                        progress: 0,
                        progressIsDisplay: 'none',
                        backdrop: false
                    })
                }
            }
            count ++;
        }, 200);
    }

    openConfig(item) {
        this.apiConfigDialog.openConfig(item);
    }

    logout() {
        this.props.sendLogout();
        this.setState({
            redirect: true
        })
    }

    async setStatus(index, status) {
        const self = this;
        for (var i=0; i<self.state.filterApis.length; i++) {
            if (index !== null && index !== i) {
                continue;
            }
            let id = self.state.filterApis[i];
            const api = id.split(" ")[0];
            const method = id.split(" ")[1];
            if (self.state.apis[api][method].enabled !== status) {
                self.callUpdateApi(api, method, status);
            }
        }
    }

    setFilterApis(value) {
        this.setState({
            filterApis: value
        })
    }

    checkApiAllEnabled() {
        let count = 0;
        for (var j=0; j<this.state.filterApis.length; j++) {
            const api_method = this.state.filterApis[j].split(" ");
            if (this.state[api_method[0]][api_method[1]].enabled === true) {
                count += 1;
            }
        }
        let enabled = false;
        if (count !== 0 && count === this.state.filterApis.length) {
            enabled = true;
        }
        return enabled;
    }

    async refreshToken (callback) {
        const self = this;
        await axios.post(`https://${self.props.domain}.com:443/rbac-api/v1/authentication`, {
            "client_id": "rbac-service",
            "grant_type": "refresh_token",
            "refresh_token": self.state.refresh_token
        })
        .then(function (response) {
            self.setState({
                token: response.data.access_token,
                refresh_token: response.data.refresh_token
            }, () => {
                if (callback) {
                    callback();
                }
            })
        })
        .catch(function (error) {
            console.error(error);
            self.setState({redirect: true});
        })
    }

    async callUpdateApi(api, method, status)  {
        const self = this;
        await axios.put(`https://${self.props.domain}.com:443/rbac-api/v1/apis/${api}/${method}`, 
            {
                status: status
            },
            {
                headers: {
                    'Authorization': `Bearer ${self.state.token}`
                }
            }
        )
        .then(function (response) {
            self.state[api][method].enabled = status;
            self.setState({
                filterApis: self.state.filterApis
            }, () => {
                self.setState({
                    api_all_enabled: self.checkApiAllEnabled()
                })
            })
        })
        .catch(function (error) {
            console.error(error);
            if (error.response.statusText === "Unauthorized") {
                self.refreshToken(() => {
                    self.callUpdateApi(api, method, status);
                });
            }
        })
    }

    async callGetApis()  {
        const self = this;
        if (self.state.debug) {
            try {
                const response = await fetch(process.env.PUBLIC_URL + '/api_config.json');
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                let api_ids = []
                Object.entries(jsonData).forEach(([api, value]) => {
                    Object.keys(value).forEach(method => {
                        api_ids.push(`${api} ${method}`)
                    });
                });
                self.setState({
                    apis: jsonData,
                    api_ids: api_ids
                });
            } catch (err) {
                console.error(err.message);
            }
        }
        else {
            self.setState({
                apis: {},
                api_ids: []
            });
        }
    }
}

const mapStateToProps = (state) => {
    return state
}

const mapDispatchToProps = dispatch => {
    return {
        // dispatch one logoutAction
        sendLogout: ()=> {
            dispatch(logoutAction())
        }
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);
