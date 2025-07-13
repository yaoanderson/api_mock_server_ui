import { Fragment, Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from 'axios'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
            <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
            </IconButton>
        ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

class ApiConfigDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ApiConfigIsOpen: false,
            selectedApi: {},
            api_config: '',
            configMode: 'basic', // 新增
            ...props
        }
    }

    componentDidMount(){
        this.props.onRef(this)
    }

    // 新增方法
    handleConfigModeChange = (mode) => {
        if (mode === 'basic') {
            let jsonObj;
            try {
                jsonObj = JSON.parse(this.state.api_config);
            } catch {
                jsonObj = null;
            }
            if (jsonObj && jsonObj.b !== undefined) {
                this.setState(prevState => ({
                    configMode: mode,
                    selectedApi: {
                        ...prevState.selectedApi,
                        b: jsonObj.b
                    }
                }));
                return;
            }
        }
        this.setState({ configMode: mode });
    }

    render() {
        const { configMode } = this.state;
        return (
            <Fragment>
                <Dialog maxWidth='sm' fullWidth={true} style={{ zIndex: 100 }} onClose={() => this.closeProfile()} aria-labelledby="customized-dialog-title" open={this.state.ApiConfigIsOpen} >
                    <DialogTitle id="customized-dialog-title" onClose={() => this.closeConfig()}>
                        API Config
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid
                            container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={2}
                        >
                            <Grid container alignItems="center" style={{ width: 560, marginBottom: 0 }} direction="row">
                                <Grid item>
                                    <FormControlLabel
                                        control={<Radio checked={configMode === 'basic'} onChange={() => this.handleConfigModeChange('basic')} />}
                                        label=""
                                        style={{ marginRight: 8 }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6" gutterBottom style={{ color: '#333', textAlign: 'left', marginLeft: 0, marginBottom: 0 }}>
                                        Basic Configuration
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item style={{ width: 560, border: '2px solid #e0e0e0', borderRadius: '8px', padding: '20px 10px 20px 10px', backgroundColor: '#fafafa', marginLeft: 10 }}>
                                <Grid container direction="column" spacing={2} style={{ marginLeft: 0, width: '100%' }}>
                                    <Grid item style={{ marginLeft: 0 }}>
                                        <TextField
                                            label="B Value"
                                            value={this.state.selectedApi.b || ""}
                                            placeholder="Enter B value"
                                            variant="outlined"
                                            fullWidth
                                            onChange={(event) => this.setFieldValue("b", event.target.value)}
                                            InputProps={{
                                                readOnly: false,
                                                disabled: configMode !== 'basic'
                                            }}
                                            style={{ marginLeft: 0 }}
                                        />
                                    </Grid>
                                    <Grid item style={{ marginLeft: 0 }}>
                                        <Typography id="speed-slider" gutterBottom style={{ textAlign: 'left', marginLeft: 0 }}>
                                            Transmission Speed
                                        </Typography>
                                        <Slider
                                            value={this.state.selectedApi.speed !== undefined ? Number(this.state.selectedApi.speed) : 60}
                                            onChange={(event, newValue) => this.setFieldValue("speed", newValue)}
                                            aria-labelledby="speed-slider"
                                            step={20}
                                            marks={[
                                                { value: 0, label: '0' },
                                                { value: 20, label: '20' },
                                                { value: 40, label: '40' },
                                                { value: 60, label: '60' },
                                                { value: 80, label: '80' },
                                                { value: 100, label: '100' }
                                            ]}
                                            min={0}
                                            max={100}
                                            valueLabelDisplay="auto"
                                            style={{ marginLeft: 0 }}
                                            disabled={configMode !== 'basic'}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="center" style={{ width: 560, marginTop: 24, marginBottom: 0 }} direction="row">
                                <Grid item>
                                    <FormControlLabel
                                        control={<Radio checked={configMode === 'advanced'} onChange={() => this.handleConfigModeChange('advanced')} />}
                                        label=""
                                        style={{ marginRight: 8 }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6" gutterBottom style={{ color: '#333', textAlign: 'left', marginLeft: 0, marginBottom: 0 }}>
                                        Advanced Configuration
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item style={{ width: 560, marginLeft: 0 }}>
                                <TextField
                                    multiline
                                    value={this.state.api_config}
                                    minRows={4}
                                    placeholder="Please input api config value"
                                    id="api-config"
                                    label="Json Config"
                                    style={{ width: 560, marginLeft: 0 }}
                                    variant="outlined"
                                    onChange={(event) =>
                                        this.setFieldValue("api_config", event.target.value)
                                    }
                                    InputProps={{
                                        readOnly: false,
                                        disabled: configMode !== 'advanced'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.submitConfig()} color="primary">
                            Save changes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }

    openConfig(item) {
        const api_method = item.split(" ");
        const filterApi = this.props.apis[api_method[0]][api_method[1]];
        this.setState({
            ApiConfigIsOpen: true,
            selectedApi: filterApi,
            api_config: JSON.stringify(filterApi, null, 2)
        })
    }

    addConfig() {
        this.setState({
            ApiConfigIsOpen: true,
            selectedUser: {
                first_name: "",
                last_name: "",
                language_locale_key: "",
                external_id: "",
                emailIsDisabled: false,
                email: "",
                usernameIsDisabled: false,
                username: "",
                company_id: ""
            },
            companies: [],
            companyId: "",
            companyIdToNameMap: {},
            method: "post"
        }, () => {
            this.getCompanies();
        })
    }

    closeConfig() {
        this.setState({
            ApiConfigIsOpen: false,
            selectedApi: {}
        })
    }

    setFieldValue(key, value) {
        const selectedApi = { ...this.state.selectedApi };
        if (key === 'b') {
            // 更新b字段并同步到api_config
            selectedApi.b = value;
            let jsonObj;
            try {
                jsonObj = JSON.parse(this.state.api_config || JSON.stringify(selectedApi));
            } catch {
                jsonObj = { ...selectedApi };
            }
            jsonObj.b = value;
            this.setState({
                selectedApi,
                api_config: JSON.stringify(jsonObj, null, 2)
            });
        } else if (key === 'speed') {
            // 新增：同步speed字段到api_config
            selectedApi.speed = Number(value);
            let jsonObj;
            try {
                jsonObj = JSON.parse(this.state.api_config || JSON.stringify(selectedApi));
            } catch {
                jsonObj = { ...selectedApi };
            }
            jsonObj.speed = Number(value);
            this.setState({
                selectedApi,
                api_config: JSON.stringify(jsonObj, null, 2)
            });
        } else if (key === 'api_config') {
            // 更新api_config并同步b字段
            let jsonObj;
            try {
                jsonObj = JSON.parse(value);
            } catch {
                jsonObj = null;
            }
            // 只有在 advanced 模式下才同步 selectedApi
            if (this.state.configMode === 'advanced' && jsonObj) {
                this.setState({
                    api_config: value,
                    selectedApi: {
                        ...selectedApi,
                        b: jsonObj.b !== undefined ? jsonObj.b : selectedApi.b,
                        speed: jsonObj.speed !== undefined ? Number(jsonObj.speed) : selectedApi.speed
                    }
                });
            } else {
                this.setState({
                    api_config: value
                });
            }
        } else {
            selectedApi[key] = value;
            this.setState({
                selectedApi
            });
        }
    }

    async submitProfile() {
        const self = this;
        let data = self.state.selectedApi;
        const payload = {
            ...data,
            first_name: self.state.selectedApi.first_name,
            last_name: self.state.selectedApi.last_name,
            language_locale_key: self.state.selectedApi.language_locale_key,
            external_id: self.state.selectedApi.external_id,
            email: self.state.selectedApi.email,
            username: self.state.selectedApi.username,
            send_welcome_email: false,
            company_id: self.state.companyId,
            company_name: self.state.companyIdToNameMap[self.state.companyId]
        }
        let callObject, url;
        if (self.state.method === "put") {
            callObject = axios.put;
            url = `https://${self.props.domain}.com:443/rbac-api/v1/api/${data.id}`;
        }
        else if (self.state.method === "post") {
            callObject = axios.post;
            url = `https://${self.props.domain}.com:443/rbac-api/v1/apis`;
        }
        await callObject(url,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${self.props.token}`
                }
            }
        )
        .then(function (response) {
            if (self.state.method === "post") {
                self.props.addPropsUser(response.data)
            }
            self.closeProfile();
        })
        .catch(function (error) {
            console.log(error);
            if (error.response.statusText === "Unauthorized") {
                self.props.refreshToken(() => {
                    self.submitProfile();
                });
            }
        })
    }

    async submitConfig() {
        try {
            const response = await fetch('https://127.0.0.1/update_api_config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: this.state.api_config
            });
            if (response.ok) {
                window.alert('submit success');
                this.setState({
                    ApiConfigIsOpen: false,
                    selectedApi: {},
                    api_config: '',
                    currentApiMethod: undefined
                });
            } else {
                const errText = await response.text();
                window.alert('submit failed: ' + errText);
            }
        } catch (err) {
            window.alert('submit failed: ' + err.message);
        }
    }
}

export default ApiConfigDialog;
