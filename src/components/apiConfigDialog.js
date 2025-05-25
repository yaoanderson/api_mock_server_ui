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
import axios from 'axios'

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
            ...props
        }
    }

    componentDidMount(){
        this.props.onRef(this)
    }

    render() {
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
                            justifyContent="center"
                            alignItems="flex-start"
                            spacing={2}
                        >
                            <Grid item >
                                <TextField
                                    multiline
                                    defaultValue={JSON.stringify(this.state.selectedApi, null, 2)}
                                    minRows={4}
                                    placeholder="Please input api config value"
                                    id="api-config"
                                    label="Json Config"
                                    style={{ width: 560 }}
                                    variant="outlined"
                                    onChange={(event) =>
                                        this.setFieldValue("api_config", event.target.value)
                                    }
                                    InputProps={{
                                        readOnly: false,
                                        disabled: false
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
        console.log(this.props.apis);
        const filterApi = this.props.apis[api_method[0]][api_method[1]];
        this.setState({
            ApiConfigIsOpen: true,
            selectedApi: filterApi
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
        const selectedApi = this.state.selectedApi;
        selectedApi[key] = value;
        this.setState({
            selectedApi: selectedApi
        })
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
}

export default ApiConfigDialog;
