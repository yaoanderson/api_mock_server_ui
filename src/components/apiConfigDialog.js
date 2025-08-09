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
import Radio from '@material-ui/core/Radio';

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
                <Dialog maxWidth='sm' fullWidth={true} style={{ zIndex: 100 }} onClose={() => this.closeConfig()} aria-labelledby="customized-dialog-title" open={this.state.ApiConfigIsOpen} >
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
                            <Grid item style={{ width: 560, border: '2px solid #e0e0e0', borderRadius: '8px', padding: '20px 20px 20px 20px', backgroundColor: '#fafafa', marginLeft: 10 }}>
                                <Grid container direction="column" spacing={2} style={{ marginLeft: 0, width: '100%' }}>
                                    {/* Parms */}
                                    <Grid item style={{ marginLeft: 0 }}>
                                        <TextField
                                            label="Parms"
                                            value={this.state.selectedApi.parms || ''}
                                            placeholder="Enter Parms"
                                            variant="outlined"
                                            fullWidth
                                            onChange={(event) => this.setFieldValue("parms", event.target.value)}
                                            InputProps={{
                                                readOnly: false,
                                                disabled: configMode !== 'basic'
                                            }}
                                            style={{ marginLeft: 0 }}
                                        />
                                    </Grid>
                                    {/* Content Type */}
                                    <Grid item style={{ marginLeft: 0 }}>
                                        <TextField
                                            select
                                            label="Content Type"
                                            value={this.state.selectedApi.content_type || ''}
                                            onChange={(event) => this.setFieldValue("content_type", event.target.value)}
                                            variant="outlined"
                                            fullWidth
                                            SelectProps={{ native: true }}
                                            InputProps={{
                                                readOnly: false,
                                                disabled: configMode !== 'basic'
                                            }}
                                            style={{ marginLeft: 0 }}
                                        >
                                            <option value="application/octet-stream">application/octet-stream</option>
                                            <option value="text/html">text/html</option>
                                            <option value="application/javascript">application/javascript</option>
                                            <option value="application/json">application/json</option>
                                            <option value="application/xml">application/xml</option>
                                            <option value="text/css">text/css</option>
                                            <option value="image/vnd.microsoft.icon">image/vnd.microsoft.icon</option>
                                            <option value="image/png">image/png</option>
                                            <option value="image/jpeg">image/jpeg</option>
                                            <option value="image/gif">image/gif</option>
                                        </TextField>
                                    </Grid>
                                    {/* Transfer Rate */}
                                    <Grid item style={{ marginLeft: 0 }}>
                                        <Typography id="speed-slider" gutterBottom style={{ textAlign: 'left', marginLeft: 0 }}>
                                            Transfer Rate
                                        </Typography>
                                        <Slider
                                            value={this.state.selectedApi.speed !== undefined ? Number(this.state.selectedApi.speed) : 60}
                                            onChange={(event, newValue) => this.setFieldValue("speed", newValue)}
                                            aria-labelledby="speed-slider"
                                            step={20}
                                            marks={[
                                                { value: 0, label: '0%' },
                                                { value: 20, label: '20%' },
                                                { value: 40, label: '40%' },
                                                { value: 60, label: '60%' },
                                                { value: 80, label: '80%' },
                                                { value: 100, label: '100%' }
                                            ]}
                                            min={0}
                                            max={100}
                                            valueLabelDisplay="auto"
                                            style={{ marginLeft: 0, marginRight: 0 }}
                                            disabled={configMode !== 'basic'}
                                        />
                                    </Grid>
                                    {/* Mock Switch */}
                                    <Grid item style={{ marginLeft: 0 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={!!this.state.selectedApi.enabled}
                                                    onChange={e => this.setFieldValue("enabled", e.target.checked)}
                                                    color="primary"
                                                    disabled={configMode !== 'basic'}
                                                />
                                            }
                                            label="Mock"
                                            labelPlacement="start"
                                            style={{ marginLeft: 0 }}
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
        const selectedApi = {
            path: api_method[0],
            method: api_method[1],
            enabled: filterApi.enabled,
            parms: filterApi.parms || '',
            content_type: filterApi.content_type || '',
            speed: filterApi.speed !== undefined ? filterApi.speed : 60
        };
        var api_config = {...selectedApi};
        delete api_config.path;
        delete api_config.method;
        this.setState({
            ApiConfigIsOpen: true,
            selectedApi,
            api_config: JSON.stringify(api_config, null, 2)
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
        if (key === 'parms' || key === 'content_type' || key === 'speed' || key === 'enabled') {
            selectedApi[key] = key === 'speed' ? Number(value) : value;
            if (key === 'enabled') {
                selectedApi[key] = +value;
            }
            let jsonObj;
            try {
                jsonObj = JSON.parse(this.state.api_config || JSON.stringify(selectedApi));
            } catch {
                jsonObj = { ...selectedApi };
            }
            jsonObj[key] = selectedApi[key];

            this.setState({
                selectedApi,
                api_config: JSON.stringify(jsonObj, null, 2)
            });
        } else if (key === 'api_config') {
            let jsonObj;
            try {
                jsonObj = JSON.parse(value);
            } catch {
                jsonObj = null;
            }
            if (this.state.configMode === 'advanced' && jsonObj) {
                this.setState({
                    api_config: value,
                    selectedApi: {
                        ...this.state.selectedApi,
                        ...jsonObj
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

    async submitConfig() {
        try {
            const { path, method, parms, content_type, enabled, speed } = this.state.selectedApi;
            const body = JSON.stringify({
                path,
                method,
                parms,
                content_type,
                enabled: +enabled,
                speed
            });
            const response = await fetch(`${(this.props.host || 'http://127.0.0.1')}:${(this.props.port || '8083')}/update_api_config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            });
            if (response.ok) {
                if (typeof this.props.onConfigSave === 'function') {
                    this.props.onConfigSave(path, method, { enabled, parms, content_type, speed });
                }
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
