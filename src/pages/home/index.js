import { Fragment, Component } from 'react'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import axios from 'axios'

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Switch from '@material-ui/core/Switch';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import SettingsIcon from '@material-ui/icons/Settings';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import PropTypes from 'prop-types';
import DescriptionIcon from '@material-ui/icons/Description';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { visuallyHidden } from '@material-ui/utils';

import './home.css';
import { logoutAction } from '../../common/action'
import ApiConfigDialog from '../../components/apiConfigDialog'
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slider from '@material-ui/core/Slider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Tooltip from '@material-ui/core/Tooltip';
import Radio from '@material-ui/core/Radio';
import Chip from '@material-ui/core/Chip';

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

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  const headCells = [
    {
      id: 'client_ip',
      numeric: false,
      disablePadding: true,
      label: 'CLIENT IP',
    },
    {
      id: 'api',
      numeric: false,
      disablePadding: false,
      label: 'API',
    },
    {
      id: 'method',
      numeric: false,
      disablePadding: false,
      label: 'METHOD',
    },
    {
      id: 'parms',
      numeric: false,
      disablePadding: false,
      label: 'PARMS',
    },
    {
      id: 'body',
      numeric: false,
      disablePadding: false,
      label: 'BODY',
    },
    {
      id: 'mock',
      numeric: true,
      disablePadding: false,
      label: 'MOCK',
    },
    {
      id: 'config',
      numeric: false,
      disablePadding: false,
      label: 'CONFIG',
    },
    {
      id: 'file',
      numeric: false,
      disablePadding: false,
      label: 'FILE',
    }
  ];
  
  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" style={{backgroundColor: "rgba(211, 211, 211, 0.42)", borderBottom: "1px solid rgb(204, 204, 204)"}}>
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.id === 'client_ip'? 'left': 'center'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{paddingRight: "0px", backgroundColor: "rgba(211, 211, 211, 0.42)", borderBottom: "1px solid rgb(204, 204, 204)", color: "rgba(0, 0, 0, 0.54)"}}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

const AddDialogTitle = withStyles((theme) => ({
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
}))((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <DialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
});

const AddDialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(DialogContent);

const AddDialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(DialogActions);


class Home extends Component {
    constructor(props) {
        super(props);
        const token = props.token || localStorage.getItem('token') || '';
        this.state = {
            debug: this.props.debug ?? false,
            redirect: props.isLogin ? false : true,
            progress: 0,
            progressIsDisplay: 'none',
            backdrop: false,
            apis: {},
            api_method_parms_bodys: [],
            filterApis: [],
            tab: 0,
            api_all_enabled: false,
            username: "",
            token,
            refresh_token: props.refresh_token,
            host: localStorage.getItem('host') || 'https://127.0.0.1',
            port: localStorage.getItem('port') || '443',
            order: 'asc',
            orderBy: 'client_ip',
            selected: [],
            page: 0,
            rowsPerPage: 5,
            apisLoading: false,
            error: null,
            staticFileList: [],
            addStaticApiDialogOpen: false,
            selectedStaticFile: null,
            selectedStaticFileName: '',
            addApiDialogOpen: false,
            newApiClientIp: '',
            newApiUrl: '',
            newApiMethod: 'GET',
            newApiMockEnabled: true,
            newApiParms: '',
            newApiContentType: '',
            newApiOrigin: '',
            newApiSpeed: 60,
            newApiCode: 200,
            deleteConfirmDialogOpen: false,
            fileDialogOpen: false,
            fileLoading: false,
            fileError: null,
            staticFileLoading: false,
            staticFileError: null,
            currentFileInfo: { client_ip: '', api: '', method: '', filePath: '', fileName: '' },
            fileName: '',
            fileContent: '',
            fileContentType: 'application/json',
            fileCollapsed: true,
            selectedFile: null,
            selectedFileName: '',
            fileEditMode: 'content',
            contentEditable: true,
            addNewCertFileDialogOpen: false,
            newCertFileName: "",
            cachedMinRows: 1,
            cachedMaxRows: 1
        }
    }

    handleRequestSort = (event, property) => {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({
          order: isAsc ? 'desc' : 'asc',
          orderBy: property
        });
      };
    
    handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const selected = this.state.filterApis.map((row) => row);
            this.setState({ selected }, () => {
            localStorage.setItem('selected', JSON.stringify(this.state.selected));
            });
        } else {
            this.setState({ selected: [] }, () => {
            localStorage.setItem('selected', '[]');
            });
        }
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [...selected];

        if (selectedIndex === -1) {
            newSelected.push(id);
        } else {
            newSelected.splice(selectedIndex, 1);
        }

        this.setState({ selected: newSelected });
    };

    handleChangePage = (event, newPage) => {
        const maxPage = Math.max(0, Math.ceil((this.state.filterApis || []).length / this.state.rowsPerPage) - 1);
        const validPage = Math.min(newPage, maxPage);
        this.setState({ page: validPage });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    decodeJWT(token) {
        try {
            const parts = token.split('.');
            
            if (parts.length !== 3) {
            throw new Error('Invalid JWT token');
            }
            
            const payload = parts[1];
            
            const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            
            return JSON.parse(decodedPayload);
        } catch (error) {
            console.error('Failed to decode JWT:', error);
            return null;
        }
    }

    componentDidMount() {
        localStorage.removeItem('filterApis');
        const savedFilterApis = localStorage.getItem('filterApis');
        if (savedFilterApis) {
            this.setState({ filterApis: JSON.parse(savedFilterApis) });
        }
        const savedSelected = localStorage.getItem('selected');
        if (savedSelected) {
            this.setState({ selected: JSON.parse(savedSelected) });
        }

        const _path = window.location.hash;
        let _username = "";
        if (_path.indexOf("?") !== -1) {
            const token = _path.split("?")[1].split("xtoken=")[1];
            const decoded = this.decodeJWT(token);
            _username = decoded.billNumber;
            this.setState({ 
                token: token,
                username: _username 
            });
        }

        if (_username || this.props.isLogin) {
            this.updateProgress(100);
            this.callGetApis();
        }
    }

    createData(id, fileName, fileLink) {
        return { id, fileName, fileLink };
    }

    render() {
        if (!this.props.isLogin) {
            return <Redirect to="/login" />;
        }
        const { order, orderBy, selected, page, rowsPerPage } = this.state;
        var rows = this.state.filterApis || [];

        // Ensure page is within valid range
        const maxPage = Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1);
        const validPage = Math.min(page, maxPage);

        const visibleRows = [...rows]
            .sort(getComparator(order, orderBy))
            .slice(validPage * rowsPerPage, (validPage + 1) * rowsPerPage);

        const emptyRows = Math.max(0, rowsPerPage - visibleRows.length);

        if (this.state.apisLoading) {
          return <div>Loading...</div>;
        }
        if (this.state.error) {
          return <div>Loading Failed: {this.state.error}</div>;
        }

        return (
            <Fragment>
                {this.state.redirect && <Redirect to="/login" /> }
                <div className="mock-solution-home">
                    <AppBar position="static" style={{width: "100%", margin: '0 auto'}}>
                        {this.state.username && <Typography style = {{ width: "auto", position: 'absolute', lineHeight: "48px", height: 48, left: 35, color: "rgba(0, 0, 0, 0.87)", fontFamily: "emoji" }} >Hello <b>{this.state.username}</b></Typography>}
                        <Paper className="tabs">
                            <Tabs value={this.state.tab} onChange={(event, value) => this.setState({tab: value})} indicatorColor="primary" textColor="primary" centered >
                                <Tab label="API" {...a11yProps(0)} />
                                <Tab label="Others" {...a11yProps(1)} disabled={true} />
                            </Tabs>
                        </Paper>
                        {!this.state.username && <Button color = "default" id = "logout-button" style = {{ width: 100, position: 'absolute', height: 48, right: 10 }}
                                    onClick = {() => this.logout()} > Logout </Button>}
                    </AppBar>
                    <TabPanel value={this.state.tab} index={0} style={{width: 1200, margin: '0 auto'}} >
                        <div style={{ display: 'flex', alignItems: 'center', width: 1200, margin: '0 auto' }}>
                            <Autocomplete
                                multiple
                                id="apis_selector"
                                options={this.state.api_method_parms_bodys}
                                getOptionLabel={(option) => `${option[0]} ${option[1]} ${option[2]} ${option[3]} ${option[4]}`}
                                defaultValue={[]}
                                renderOption={(option, { selected }) => (
                                    <Tooltip title={`${option[0]} ${option[1]} ${option[2]} ${option[3]} ${option[4]}`} placement="top">
                                        <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', display: 'block' }}>
                                            {`${option[0]} ${option[1]} ${option[2]} ${option[3]} ${option[4]}`}
                                        </span>
                                    </Tooltip>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Choose APIs"
                                        placeholder="API..."
                                        onKeyDown={(e) => {
                                            if (e.code === 'Enter' && e.target.value) {
                                                const apiList = e.target.value.split(',')
                                                const newApiList = apiList.map(function (api_method) {
                                                    return api_method.trim()
                                                })
                                                let filterApis = []
                                                while (newApiList.length > 0) {
                                                    const api_item = newApiList.pop();
                                                    const api_items = api_item.split(" ");
                                                    const api_client_ip = api_items[0];
                                                    const new_api = api_items[1];
                                                    const new_method = api_items[2];
                                                    const new_parm = api_items[3];
                                                    const new_body = api_items[4];
                                                    filterApis = filterApis.concat(this.state.api_method_parms_bodys.filter((client_ip, api, method, parms, body) => client_ip === api_client_ip && api === new_api && method === new_method && parms === new_parm && body === new_body))
                                                }
                                                this.setFilterApis(filterApis)
                                            }
                                        }}
                                    />
                                )}
                                renderTags={(value, getTagProps) => 
                                    value.map((option, index) => {
                                    const fullTagText = `${option[0]} ${option[1]} ${option[2]} ${option[3]} ${option[4]}`;
                                    return (
                                        <Tooltip 
                                        key={index}
                                        title={fullTagText} 
                                        placement="top"
                                        arrow
                                        >
                                        <Chip
                                            {...getTagProps({ index })}
                                            label={fullTagText}
                                            style={{ 
                                            textOverflow: 'ellipsis', 
                                            whiteSpace: 'nowrap', 
                                            overflow: 'hidden', 
                                            maxWidth: '150px'
                                            }}
                                        />
                                        </Tooltip>
                                    );
                                    })
                                }
                                onChange={(event, value) => this.setFilterApis(value)}
                                value={this.state.filterApis}
                                style={{ margin: 10, width: 700 }}
                                getOptionSelected={(option, value) =>
                                    option[0] === value[0] && option[1] === value[1] && option[2] === value[2] && option[3] === value[3]
                                }
                            />
                            {this.state.selected.length > 0 && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{ marginLeft: 10, height: 40, textTransform: 'none' }}
                                    onClick={() => this.setState({ deleteConfirmDialogOpen: true })}
                                >
                                    Delete
                                </Button>
                            )}
                            {this.state.selected.length === 1 && (
                                <Button
                                    variant="contained"
                                    style={{ marginLeft: 10, height: 40, textTransform: 'none', backgroundColor: 'rgb(3 195 60)', color: '#fff' }}
                                    onClick={() => {
                                        const [client_ip, path, method, parms, body] = this.state.selected[0];
                                        const ob = this.state.apis[client_ip][path][method][parms][body];
                                        this.setState({ 
                                            addApiDialogOpen: true,
                                            newApiClientIp: '',
                                            newApiUrl: path,
                                            newApiMethod: method,
                                            newApiParms: parms,
                                            newApiBody: body,
                                            newApiCode: ob.code,
                                            newApiContentType: ob.content_type,
                                            newApiMockEnabled: !!ob.enabled,
                                            newApiSpeed: ob.speed
                                        })
                                    }}
                                >
                                    Clone
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                style={{ width: 140, marginLeft: 10, height: 40, textTransform: 'none', backgroundColor: 'rgb(24 167 229)', color: '#fff' }}
                                onClick={() => this.setState({ addApiDialogOpen: true })}
                            >
                                Add Config
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginLeft: 10, height: 40, textTransform: 'none', minWidth: 90, paddingLeft: 0, paddingRight: 0 }}
                                onClick={async () => {
                                    this.setState({ addStaticApiDialogOpen: true, staticFileLoading: true })
                                    try {
                                        const response = await fetch(`${this.state.host}:${this.state.port}/update_api_assets_file`, {
                                            method: 'GET',
                                            headers: { 'Content-Type': 'application/json' }
                                        });
                                        if (response.ok) {
                                            var jsonData = await response.json();
                                            jsonData = JSON.parse(jsonData["content"])
                                            let staticFileList = []
                                            for (let i = 0; i < jsonData.length; i++) {
                                                let item = jsonData[i];
                                               staticFileList.push(this.createData(item[0], item[1], item[2]));
                                            }
                                            this.setState({
                                                staticFileList: staticFileList,
                                                staticFileLoading: false
                                            });
                                        } else {
                                            const errText = await response.text();
                                            window.alert('Get static file list failed: ' + errText);
                                        }
                                    } catch (err) {
                                        window.alert('Get static file list error: ' + err.message);
                                    }
                                }}
                            >
                                Add File
                            </Button>
                            <Button
                                variant="contained"
                                color="inherit"
                                style={{ marginRight: 10, marginLeft: 10, height: 40, textTransform: 'none', minWidth: 90, paddingLeft: 0, paddingRight: 0 }}
                                onClick={() => this.setState({ addNewCertFileDialogOpen: true })}
                            >
                                New Cert
                            </Button>
                        </div>

                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle"
                                size={'medium'}
                            >
                                <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={rows.length}
                                />
                                <TableBody>
                                {visibleRows.map((row, index) => {
                                    const client_ip = row[0];
                                    const api = row[1];
                                    const method = row[2];
                                    const parms = row[3];
                                    const body = row[4];
                                    const clientIpObj = this.state.apis[client_ip];
                                    const apiObj = clientIpObj ? clientIpObj[api] : undefined;
                                    const methodObj = apiObj ? apiObj[method] : undefined;
                                    const parmsObj = methodObj ? methodObj[parms] : undefined;
                                    const bodyObj = parmsObj ? parmsObj[body] : undefined;
                                    if (!clientIpObj || !apiObj || !methodObj || !parmsObj || !bodyObj) return null;

                                    const isItemSelected = selected.includes(row);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                    <TableRow
                                        hover
                                        onClick={(event) => this.handleClick(event, row)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="none"
                                        style={{maxWidth: "200px", overflow: "auto"}}
                                        >
                                            {client_ip}
                                        </TableCell>
                                        <TableCell align="center">{api}</TableCell>
                                        <TableCell align="center">{method}</TableCell>
                                        <Tooltip title={parms}>
                                            <TableCell align="left" className='apiListCell' >{parms}</TableCell>
                                        </Tooltip>
                                        <Tooltip title={body}>
                                            <TableCell align="left" className='apiListCell' >{body}</TableCell>
                                        </Tooltip>
                                        <TableCell align="center">
                                            <Switch
                                                color="primary"
                                                edge="end"
                                                onChange={async (event) => {
                                                    const self = this;
                                                    const checked = event.target.checked;
                                                    try {
                                                        const response = await fetch(`${this.state.host}:${this.state.port}/update_api_config`, {
                                                            method: 'PUT',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                client_ip: client_ip,
                                                                path: api,
                                                                method: method,
                                                                parms: parms,
                                                                body: body,
                                                                enabled: +checked
                                                            })
                                                        });
                                                        if (!response.ok) {
                                                            const errText = await response.text();
                                                            window.alert('update failed: ' + errText);
                                                        }
                                                        else {
                                                            self.setState(prevState => {
                                                                const newItem = { ...prevState.apis };
                                                                if (newItem[client_ip] && newItem[client_ip][api] && newItem[client_ip][api][method] && newItem[client_ip][api][method][parms] && newItem[client_ip][api][method][parms][body]) {
                                                                    newItem[client_ip][api][method][parms][body].enabled = +checked;
                                                                }
                                                                return { apis: newItem };
                                                            });
                                                        }
                                                    } catch (err) {
                                                        window.alert('update failed: ' + err.message);
                                                    }
                                                }}
                                                checked={!!this.state.apis[client_ip][api][method][parms][body].enabled}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <SettingsIcon 
                                                style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.54)' }} 
                                                onClick={(e) => { e.stopPropagation(); this.openConfig(`${client_ip} ${api} ${method} ${parms} ${body}`); }} 
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <DescriptionIcon
                                                style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.54)' }}
                                                onClick={(e) => { e.stopPropagation(); this.openFileInfo(client_ip, api, method, parms, body); }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                    style={{
                                        height: (53) * emptyRows,
                                    }}
                                    >
                                    <TableCell colSpan={12} />
                                    </TableRow>
                                )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={validPage}
                        onPageChange={this.handleChangePage}
                        onRowsPerPageChange={this.handleChangeRowsPerPage}
                        />
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={1} style={{width: 720, margin: '0 auto'}} >
                        Others Content
                    </TabPanel>
                        <ApiConfigDialog
                            onRef={ref => this.apiConfigDialog = ref}
                            updateProgress={value => this.updateProgress(value)}
                            domain={this.props.domain}
                            token={this.state.token}
                            refresh_token={this.state.refresh_token}
                            refreshToken={callback => this.refreshToken(callback)}
                            filterApis={this.state.filterApis}
                            apis={this.state.apis}
                            host={this.state.host}
                            port={this.state.port}
                            onConfigSave={this.handleApiConfigSave}
                        />
                    <Backdrop style={{ zIndex: 1000, color: '#fff' }} open={this.state.backdrop} onClick={() => {}}>
                        <CircularProgressWithLabel value={this.state.progress} progressisdisplay={this.state.progressIsDisplay} />
                    </Backdrop>
                </div>
                <Dialog
                    open={this.state.addApiDialogOpen}
                    onClose={() => this.setState({ addApiDialogOpen: false })}
                    maxWidth="sm"
                    fullWidth={true}
                    PaperProps={{
                        style: { borderRadius: 8, minWidth: 400, background: '#fff' }
                    }}
                >
                    <AddDialogTitle onClose={() => this.setState({ addApiDialogOpen: false })}>
                        Add New API
                    </AddDialogTitle>
                    <AddDialogContent dividers>
                        <TextField
                            label="Client IP"
                            value={this.state.newApiClientIp}
                            onChange={e => this.setState({ newApiClientIp: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="API Url"
                            value={this.state.newApiUrl}
                            onChange={e => this.setState({ newApiUrl: e.target.value })}
                            fullWidth
                            margin="normal"
                            style={{ marginTop: 0}}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Method</InputLabel>
                            <Select
                                value={this.state.newApiMethod}
                                onChange={e => this.setState({ newApiMethod: e.target.value })}
                            >
                                <MenuItem value="GET">GET</MenuItem>
                                <MenuItem value="POST">POST</MenuItem>
                                <MenuItem value="PUT">PUT</MenuItem>
                                <MenuItem value="DELETE">DELETE</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Parms"
                            value={this.state.newApiParms}
                            onChange={e => this.setState({ newApiParms: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Body"
                            value={this.state.newApiBody}
                            onChange={e => this.setState({ newApiBody: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Content Type</InputLabel>
                            <Select
                                value={this.state.newApiContentType}
                                onChange={e => this.setState({ newApiContentType: e.target.value })}
                            >
                                <MenuItem value="application/octet-stream">application/octet-stream</MenuItem>
                                <MenuItem value="text/html">text/html</MenuItem>
                                <MenuItem value="application/javascript">application/javascript</MenuItem>
                                <MenuItem value="application/json">application/json</MenuItem>
                                <MenuItem value="application/xml">application/xml</MenuItem>
                                <MenuItem value="text/css">text/css</MenuItem>
                                <MenuItem value="image/vnd.microsoft.icon">image/vnd.microsoft.icon</MenuItem>
                                <MenuItem value="image/png">image/png</MenuItem>
                                <MenuItem value="image/jpeg">image/jpeg</MenuItem>
                                <MenuItem value="image/gif">image/gif</MenuItem>
                            </Select>
                        </FormControl>
                        <div style={{ margin: '16px 0', width: '97%' }}>
                            <Typography id="speed-slider" gutterBottom style={{ textAlign: 'left' }}>
                                Transfer Rate
                            </Typography>
                            <Slider
                                value={this.state.newApiSpeed}
                                onChange={(event, newValue) => this.setState({ newApiSpeed: newValue })}
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
                                style={{ width: '100%' }}
                            />
                        </div>
                        <TextField
                            label="Code"
                            value={this.state.newApiCode}
                            onChange={e => this.setState({ newApiCode: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.newApiMockEnabled}
                                    onChange={e => this.setState({ newApiMockEnabled: e.target.checked })}
                                    color="primary"
                                />
                            }
                            label="Mock"
                            labelPlacement="start"
                            style={{ marginLeft: 0 }}
                        />
                    </AddDialogContent>
                    <AddDialogActions>
                        <Button onClick={() => this.setState({ addApiDialogOpen: false })}>Cancel</Button>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={this.handleAddApiSubmit}
                            style={{ margin: 10 }}
                        >
                            Submit
                        </Button>
                    </AddDialogActions>
                </Dialog>
                <Dialog
                    open={this.state.deleteConfirmDialogOpen}
                    onClose={() => this.setState({ deleteConfirmDialogOpen: false })}
                    maxWidth="xs"
                    fullWidth={false}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>Are you sure you want to delete the selected APIs?</DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ deleteConfirmDialogOpen: false })}>Cancel</Button>
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={async () => {
                                let selected = [...this.state.selected];
                                let filterApis = [...this.state.filterApis];
                                let apis = { ...this.state.apis };
                                let failed = false;
                                for (let i = 0; i < this.state.selected.length; i++) {
                                    const [client_ip, path, method, parms, body] = this.state.selected[i];
                                    try {
                                        const response = await fetch(`${this.state.host}:${this.state.port}/update_api_config`, {
                                            method: 'DELETE',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ client_ip, path, method, body }),
                                        });
                                        if (!response.ok) {
                                            const errText = await response.text();
                                            window.alert('delete failed: ' + errText);
                                            failed = true;
                                            continue;
                                        }
                                        selected = selected.filter(item => !(item[0] === client_ip && item[1] === path && item[2] === method && item[3] === parms && item[4] === body));
                                        filterApis = filterApis.filter(item => !(item[0] === client_ip && item[1] === path && item[2] === method && item[3] === parms && item[4] === body));
                                        if (apis[client_ip] && apis[client_ip][path] && apis[client_ip][path][method] && apis[client_ip][path][method][parms] && apis[client_ip][path][method][parms][body]) {
                                            delete apis[client_ip][path][method][parms][body];
                                            if (Object.keys(apis[client_ip]).length === 0) {
                                                delete apis[client_ip];
                                            }
                                        }
                                    } catch (err) {
                                        window.alert('delete failed: ' + err.message);
                                        failed = true;
                                    }
                                }
                                let api_method_parms_bodys = [];
                                Object.entries(apis).forEach(([client_ip, cvalue]) => {
                                    Object.entries(cvalue).forEach(([api, avalue]) => {
                                        Object.entries(avalue).forEach(([method, mvalue]) => {
                                            Object.entries(mvalue).forEach(([parms, pvalue]) => {
                                                if (parms !== "api_mock_solution_filter_out_rule"){
                                                    Object.keys(pvalue).forEach(body => {
                                                        if (body !== "api_mock_solution_body_filter_out_rule"){
                                                            api_method_parms_bodys.push([client_ip, api, method, parms, body]);
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    });
                                });
                                const validApiMethodsSet = new Set(api_method_parms_bodys.map(item => JSON.stringify(item)));
                                filterApis = filterApis.filter(item => validApiMethodsSet.has(JSON.stringify(item)));

                                localStorage.setItem('filterApis', JSON.stringify(filterApis));
                                localStorage.setItem('selected', JSON.stringify(selected));
                                this.setState({
                                    apis,
                                    api_method_parms_bodys,
                                    filterApis,
                                    selected,
                                    deleteConfirmDialogOpen: false
                                });
                                if (!failed) {
                                    window.alert('All selected APIs deleted successfully!');
                                }
                            }}
                            style={{ margin: 10 }}
                        >
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.fileDialogOpen}
                    onClose={() => this.setState({ fileDialogOpen: false, fileError: null })}
                    maxWidth="sm"
                    fullWidth={true}
                    PaperProps={{ style: { borderRadius: 8, minWidth: 400, background: '#fff' } }}
                >
                    <DialogTitle>API File</DialogTitle>
                    <DialogContent dividers>
                        {this.state.fileLoading ? (
                            <Typography>Loading...</Typography>
                        ) : this.state.fileError ? (
                            <Typography color="error">{this.state.fileError}</Typography>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <TextField
                                    label="File Name"
                                    value={this.state.fileName || ''}
                                    onChange={(e) => this.setState({ fileName: e.target.value })}
                                    variant="outlined"
                                    fullWidth
                                    style={{ marginBottom: 12 }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <FormControlLabel
                                            control={<Radio checked={this.state.fileEditMode === 'content'} onChange={() => this.state.contentEditable && this.setState({ fileEditMode: 'content' })} />}
                                            label="Content Update"
                                            style={{ marginRight: 8 }}
                                        />
                                    </div>
                                    <Button size="small" onClick={() => {
                                        this.setState({ 
                                            fileCollapsed: !this.state.fileCollapsed
                                        }, () => {
                                            if (this.state.fileCollapsed) {
                                                this.setState({ 
                                                    cachedMinRows: 1,
                                                    cachedMaxRows: 1
                                                })
                                            }
                                            else {
                                                this.setState({ 
                                                    cachedMinRows: 8,
                                                    cachedMaxRows: 32
                                                })
                                            }
                                        });
                                    }} startIcon={this.state.fileCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon /> }>
                                        {this.state.fileCollapsed ? 'Expand' : 'Collapse'}
                                    </Button>
                                </div>
                                <TextField
                                    value={this.state.fileContent || ''}
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    minRows={this.state.cachedMinRows}
                                    maxRows={this.state.cachedMaxRows}
                                    onChange={(e) => this.setState({ fileContent: e.target.value })}
                                    disabled={this.state.fileEditMode !== 'content' || !this.state.contentEditable}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                                    <FormControlLabel
                                        control={<Radio checked={this.state.fileEditMode === 'file'} onChange={() => this.setState({ fileEditMode: 'file' })} />}
                                        label="File Update"
                                        style={{ marginRight: 8 }}
                                    />
                                </div>
                                <input
                                    id="file-upload-input"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files && e.target.files[0];
                                        if (!file) {
                                            this.setState({ selectedFile: null, selectedFileName: '' });
                                            return;
                                        }
                                        const expected = this.state.fileName || '';
                                        if (file.name !== expected) {
                                            window.alert(`Please select the correct file: ${expected}`);
                                            this.setState({ selectedFile: null, selectedFileName: '' });
                                            e.target.value = '';
                                            return;
                                        }
                                        this.setState({ selectedFile: file, selectedFileName: file.name });
                                    }}
                                    disabled={this.state.fileEditMode !== 'file'}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: '100%' }}>
                                    <label htmlFor="file-upload-input">
                                        <Button variant="outlined" color="primary" component="span" size="small" disabled={this.state.fileEditMode !== 'file'}>Choose File</Button>
                                    </label>
                                    <Tooltip title={this.state.selectedFileName || ''} placement="top" arrow>
                                        <Typography
                                            variant="body2"
                                            style={{ color: 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                                        >
                                            {this.state.selectedFileName ? `Selected: ${this.state.selectedFileName}` : 'No file selected'}
                                        </Typography>
                                    </Tooltip>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={async () => await this.handleUpdateFile()} color="primary" variant="contained" disabled={this.state.fileLoading || !this.state.fileName || (this.state.fileEditMode === 'file' && !this.state.selectedFile)}>
                            Update
                        </Button>
                        <Button onClick={() => this.setState({ fileDialogOpen: false, fileError: null })}>Close</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.addStaticApiDialogOpen}
                    onClose={() => this.setState({ addStaticApiDialogOpen: false, fileError: null })}
                    maxWidth="sm"
                    fullWidth={true}
                    PaperProps={{ style: { borderRadius: 8, minWidth: 1000, background: '#fff' } }}
                >
                    <DialogTitle>API Static File</DialogTitle>
                    
                        {this.state.staticFileLoading ? (
                            <Typography style={{ marginLeft: 20 }} >Loading...</Typography>
                        ) : this.state.staticFileError ? (
                            <Typography color="error">{this.state.staticFileError}</Typography>
                        ) : (
                            <DialogContent dividers>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <TextField
                                        label="Static File Name"
                                        value={this.state.selectedStaticFileName || ''}
                                        onChange={(e) => this.setState({ selectedStaticFileName: e.target.value })}
                                        variant="outlined"
                                        fullWidth
                                        style={{ marginBottom: 12 }}
                                    />
                                    <input
                                        id="file-upload-input"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files && e.target.files[0];
                                            if (!file) {
                                                this.setState({ selectedStaticFile: null, selectedStaticFileName: '' });
                                                return;
                                            }
                                            var selectedStaticFileName;
                                            if (this.state.selectedStaticFileName) {
                                                selectedStaticFileName = this.state.selectedStaticFileName;
                                            }
                                            else {
                                                selectedStaticFileName = file.name;
                                            }
                                            this.setState({ selectedStaticFile: file, selectedStaticFileName: selectedStaticFileName, staticFileLoading: false });
                                        }}
                                        disabled={false}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: '100%' }}>
                                        <label htmlFor="file-upload-input">
                                            <Button variant="outlined" color="primary" component="span" size="small" disabled={false}>Choose File</Button>
                                        </label>
                                        <Tooltip title={this.state.selectedStaticFileName || ''} placement="top" arrow>
                                            <Typography
                                                variant="body2"
                                                style={{ color: 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                                            >
                                                {this.state.selectedStaticFileName ? `Selected: ${this.state.selectedStaticFileName}` : 'No file selected'}
                                            </Typography>
                                        </Tooltip>
                                    </div>
                                </div>
                                <TableContainer component={Paper} style={{ marginBottom: 30, marginTop: 30 }}>
                                    <Typography style={{ color: "grey" }} >Show latest 50 files here:</Typography>
                                    <Table style={{ tableLayout: 'fixed' }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow style={{backgroundColor: "rgba(211, 211, 211, 0.42)", borderBottom: "1px solid rgb(204, 204, 204)"}}>
                                                <TableCell style={{ width: "40px", maxWidth: "40px", minWidth: "40px" }} >ID</TableCell>
                                                <TableCell align="left">File Name</TableCell>
                                                <TableCell align="left">File Path</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {this.state.staticFileList.slice(0, 50).map((row) => (
                                            <TableRow
                                            key={row.id}
                                            >
                                                <TableCell style={{ width: "40px", maxWidth: "40px", minWidth: "40px" }} >
                                                    {row.id}
                                                </TableCell>
                                                <Tooltip title={row.fileName}>
                                                    <TableCell align="left" className="fileListCell" >{row.fileName}</TableCell>
                                                </Tooltip>
                                                <Tooltip title={row.fileLink}>
                                                    <TableCell align="left" className="fileListCell" >{row.fileLink}</TableCell>
                                                </Tooltip>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </DialogContent>
                        )}
                    <DialogActions>
                        <Button onClick={async () => await this.handleAddStaticFile()} color="primary" variant="contained" disabled={!this.state.selectedStaticFile}>
                            Add
                        </Button>
                        <Button onClick={() => this.setState({ addStaticApiDialogOpen: false })}>Close</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.addNewCertFileDialogOpen} onClose={() => this.setState({ addNewCertFileDialogOpen: false, newCertFileName: "" })} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add New Domain Certification</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Fill the domain name, and click "Generate" button, then you will get downloading certification crt file.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="domainName"
                        label="Valid Domain Name"
                        type="text"
                        value={this.state.newCertFileName}
                        onChange={(e) => this.setState({ newCertFileName: e.target.value })}
                        fullWidth
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => this.setState({ addNewCertFileDialogOpen: false, newCertFileName: "" })} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={async () => await this.handleAddNewCertFile()} color="primary">
                        Generate
                    </Button>
                    </DialogActions>
                </Dialog>
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

    openFileInfo = async (client_ip, api, method, parms, body) => {
        this.setState({
            fileDialogOpen: true,
            fileLoading: true,
            fileError: null,
            currentFileInfo: { client_ip, api, method, parms, body, filePath: '', fileName: '' },
            fileName: '',
            fileContent: ''
        });
        try {
            const url = `${this.state.host}:${this.state.port}/update_api_config?client_ip=${encodeURIComponent(client_ip)}&path=${encodeURIComponent(api)}&method=${encodeURIComponent(method)}&parms=${encodeURIComponent(parms)}&body=${encodeURIComponent(body)}`;
            const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Request failed');
            }
            const data = await response.json();

            let payload = data && data.content !== undefined ? data.content : data;
            try {
                if (typeof payload === 'string') payload = JSON.parse(payload);
            } catch (e) {
                // ignore parse failure, will fallback to empty object
            }

            const name = payload && payload.origin ? payload.origin : '';
            let contentText = JSON.stringify(payload || {}, null, 2);
            if (name) {
                try {
                    const rawApi = api || '';
                    var fileUrl = `${this.state.host}:${this.state.port}${rawApi}`;
                    const contentType = (payload && payload.content_type) ? payload.content_type : 'application/json';
                    var fileResp = '';
                    if (parms) {
                        fileUrl = fileUrl + "?" + parms
                    }
                    if (method === "GET") {
                        fileResp = await fetch(fileUrl, { method: method, headers: { 'Content-Type': contentType } });    
                    }
                    else if (method === "POST") {
                        fileResp = await fetch(fileUrl, { method: method, headers: { 'Content-Type': contentType }, body: body });    
                    }
                    
                    if (fileResp && fileResp.ok) {
                        const fileData = await fileResp.text();
                        contentText = fileData;
                    }
                } catch (err) {
                    // ignore and keep fallback contentText
                }
            }
            const contentTypeFinal = payload && payload.content_type ? payload.content_type : 'application/json';
            const lowerName = (name || '').toLowerCase();
            const isEditable = (!!contentTypeFinal && (contentTypeFinal.startsWith('text/') || contentTypeFinal === 'application/json' || contentTypeFinal === 'text/css' || contentTypeFinal === 'application/javascript')) || lowerName.endsWith('.ps1');
            this.setState({
                fileLoading: false,
                fileName: name,
                fileContent: contentText,
                fileContentType: contentTypeFinal,
                contentEditable: isEditable,
                fileEditMode: isEditable ? 'content' : 'file',
                cachedMinRows: 1,
                cachedMaxRows: 1,
                fileCollapsed: true
            });
        } catch (e) {
            this.setState({ fileLoading: false, fileError: e.message || String(e) });
        }
    }

    handleAddStaticFile = async () => {
        try {
            const { selectedStaticFileName, selectedStaticFile } = this.state;
            if (!selectedStaticFileName) {
                window.alert('File Name is empty');
                return;
            }

            if (this.state.staticFileList.some(subArray => subArray.fileName === selectedStaticFileName)) {
                window.alert('File Name already exists, please rename name.');
                return;
            }

            let file = selectedStaticFile;
            
            const formData = new FormData();
            formData.append('file', file, selectedStaticFileName || file.name);
            const resp = await fetch(`${this.state.host}:${this.state.port}/update_api_assets_file`, {
                method: 'POST',
                body: formData
            });
            if (!resp.ok) {
                const errText = await resp.text();
                window.alert('Update static file failed: ' + (errText || resp.statusText));
                return;
            }
            this.setState({ addStaticApiDialogOpen: false, selectedStaticFile: null, selectedStaticFileName: '' });
            window.alert('Update static file success');
        } catch (e) {
            window.alert('Update static file failed: ' + (e?.message || String(e)));
        }
    }

    handleAddNewCertFile = async () => {
        const domain = this.state.newCertFileName;
        if (domain === "") {
            return;
        }

        try {
            const response = await fetch(`${this.state.host}:${this.state.port}/update_api_file?domain=${domain}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                var data = await response.text();

                const contentDisposition = response.headers.get('Content-Disposition');
                let filename = 'certification_file.crt';
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename=([^;]+)/);
                    if (filenameMatch.length > 1) {
                        filename = filenameMatch[1];
                    }
                }
                
                const blob = new Blob([data], { type: 'application/octet-stream' });

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                this.setState({
                    newCertFileName: "",
                    addNewCertFileDialogOpen: false
                });
            } else {
                const errText = await response.text();
                window.alert('Get certification file failed: ' + errText);
            }
        } catch (err) {
            window.alert('Get new certification file error: ' + err.message);
        }
    }

    handleUpdateFile = async () => {
        try {
            const { fileName, fileContent, fileContentType, selectedFile, fileEditMode, currentFileInfo } = this.state;
            if (!fileName) {
                window.alert('File Name is empty');
                return;
            }
            let file;
            if (fileEditMode === 'file') {
                if (!selectedFile) {
                    window.alert('Please choose a file to upload');
                    return;
                }
                file = selectedFile;
            } else {
                const blob = new Blob([fileContent ?? ''], { type: fileContentType || 'text/plain' });
                file = new File([blob], fileName, { type: fileContentType || 'text/plain' });
            }
            const formData = new FormData();
            formData.append('file', file, file.name || fileName);
            const resp = await fetch(`${this.state.host}:${this.state.port}/update_api_file?client_ip=${currentFileInfo["client_ip"]}`, {
                method: 'POST',
                body: formData
            });
            if (!resp.ok) {
                const errText = await resp.text();
                window.alert('Update failed: ' + (errText || resp.statusText));
                return;
            }
            this.setState({ fileDialogOpen: false, selectedFile: null, selectedFileName: '' });
            window.alert('Update success');
        } catch (e) {
            window.alert('Update failed: ' + (e?.message || String(e)));
        }
    }

    logout() {
        this.props.sendLogout();
        this.setState({
            redirect: true
        })
    }

    setFilterApis(value) {
        const updatedSelected = this.state.selected.filter(item => value.includes(item));
        
        this.setState({ filterApis: value, selected: updatedSelected }, () => {
            localStorage.setItem('filterApis', JSON.stringify(this.state.filterApis));
        });
    }

    checkApiAllEnabled() {
        let count = 0;
        for (var j=0; j<this.state.filterApis.length; j++) {
            const api_method = this.state.filterApis[j].split(" ");
            if (this.state[api_method[0]][api_method[1]][api_method[2]][api_method[3]][api_method[4]].enabled === true) {
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

    async callGetApis()  {
        const self = this;
        self.setState({ apisLoading: true });
        if (!self.state.debug) {
            try {
                const response = await fetch(`${this.state.host}:${this.state.port}/update_api_config`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                var jsonData = await response.json();
                jsonData = JSON.parse(jsonData["content"])
                let api_method_parms_bodys = []
                Object.entries(jsonData).forEach(([client_ip, cvalue]) => {
                    Object.entries(cvalue).forEach(([api, avalue]) => {
                        Object.entries(avalue).forEach(([method, mvalue]) => {
                            Object.entries(mvalue).forEach(([parms, pvalue]) => {
                                if (parms !== "api_mock_solution_filter_out_rule"){
                                    Object.keys(pvalue).forEach(body => {
                                        if (body !== "api_mock_solution_body_filter_out_rule"){
                                            api_method_parms_bodys.push([client_ip, api, method, parms, body])
                                        }
                                    });
                                }
                            });
                        });
                    });
                });
                self.setState({
                    apis: jsonData,
                    api_method_parms_bodys: api_method_parms_bodys,
                    apisLoading: false
                });
            } catch (err) {
                console.error(err.message);
                self.setState({ apis: {}, apisLoading: false, error: err.message });
            }
        }
        else {
            jsonData = {
                "1.0.0.127": {
                    "/xxx/yyy/v2/download": {
                        "GET": {
                            "deviceId=zzzz": {
                                "default": {
                                    "parms": "deviceId=zzzz",
                                    "body": "default",
                                    "origin": "download.json",
                                    "content_type": "application/json",
                                    "speed": 20,
                                    "enabled": 1,
                                    "code": 404
                                }
                            }
                        }
                    }
                }
            }
            let api_method_parms_bodys = []
            Object.entries(jsonData).forEach(([client_ip, cvalue]) => {
                Object.entries(cvalue).forEach(([api, avalue]) => {
                    Object.entries(avalue).forEach(([method, mvalue]) => {
                        Object.entries(mvalue).forEach(([parms, pvalue]) => {
                            if (parms !== "api_mock_solution_filter_out_rule"){
                                Object.keys(pvalue).forEach(body => {
                                    if (body !== "api_mock_solution_body_filter_out_rule"){
                                        api_method_parms_bodys.push([client_ip, api, method, parms, body])
                                    }
                                });
                            }
                        });
                    });
                });
            });
            self.setState({
                apis: jsonData,
                api_method_parms_bodys: api_method_parms_bodys,
                apisLoading: false
            });
        }
    }

    handleApiConfigSave = (client_ip, api, method, parms, body, config) => {
        this.setState(prevState => {
            const apis = { ...prevState.apis };
            if (apis[client_ip] && apis[client_ip][api] && apis[client_ip][api][method] && apis[client_ip][api][method][parms] && apis[client_ip][api][method][parms][body]) {
                apis[client_ip][api][method][parms][body] = {
                    ...apis[client_ip][api][method][parms][body],
                    ...config
                };
            }
            return { apis };
        });
    };

    handleAddApiSubmit = async () => {
        const { newApiClientIp, newApiUrl, newApiMethod, newApiMockEnabled, newApiParms, newApiBody, newApiOrigin, newApiContentType, newApiSpeed, newApiCode } = this.state;
        const apiConfig = {
            enabled: newApiMockEnabled,
            parms: newApiParms,
            body: newApiBody,
            origin: newApiOrigin,
            content_type: newApiContentType,
            speed: newApiSpeed,
            code: newApiCode
        };
        if (newApiClientIp === '') {
            window.alert('Add failed: Invalid Client IP.');
            return;
        }
        try {
            const response = await fetch(`${this.state.host}:${this.state.port}/update_api_config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_ip: newApiClientIp,
                    path: newApiUrl,
                    method: newApiMethod,
                    parms: newApiParms,
                    body: newApiBody,
                    origin: newApiOrigin,
                    content_type: newApiContentType,
                    enabled: +newApiMockEnabled,
                    speed: newApiSpeed,
                    code: newApiCode
                }),
            });
            if (response.ok) {
                this.setState(prevState => {
                    const newApis = { ...prevState.apis };
                    if (newApis[newApiClientIp] == null) newApis[newApiClientIp] = {};
                    if (newApis[newApiClientIp][newApiUrl] == null) newApis[newApiClientIp][newApiUrl] = {};
                    if (newApis[newApiClientIp][newApiUrl][newApiMethod] == null) newApis[newApiClientIp][newApiUrl][newApiMethod] = {};
                    if (newApis[newApiClientIp][newApiUrl][newApiMethod][newApiParms] == null) newApis[newApiClientIp][newApiUrl][newApiMethod][newApiParms] = {};
                    if (newApis[newApiClientIp][newApiUrl][newApiMethod][newApiParms][newApiBody] == null) newApis[newApiClientIp][newApiUrl][newApiMethod][newApiParms][newApiBody] = {};
                    newApis[newApiClientIp][newApiUrl][newApiMethod][newApiParms][newApiBody] = apiConfig;
                    const newFilterApis = Array.isArray(prevState.filterApis) ? [...prevState.filterApis] : [];
                    const api_method_parms_bodys = this.state.api_method_parms_bodys;
                    const newApiMethodItem = api_method_parms_bodys.find(
                        item => item[0] === newApiClientIp && item[1] === newApiUrl && item[2] === newApiMethod && item[3] === newApiParms && item[4] === newApiBody
                    );
                    if (newApiMethodItem && !newFilterApis.some(item => item[0] === newApiClientIp && item[1] === newApiUrl && item[2] === newApiMethod && item[3] === newApiParms && item[4] === newApiBody)) {
                        newFilterApis.push(newApiMethodItem);
                    }
                    localStorage.setItem('filterApis', JSON.stringify(newFilterApis));
                    return {
                        apis: newApis,
                        filterApis: newFilterApis,
                        addApiDialogOpen: false,
                        newApiClientIp: '',
                        newApiUrl: '',
                        newApiMethod: 'GET',
                        newApiMockEnabled: true,
                        newApiParms: '',
                        newApiBody: '',
                        newOrigin: '',
                        newApiContentType: '',
                        newApiSpeed: 60,
                        newApiCode: 200
                    };
                });
                window.alert('API added successfully!');
            } else {
                const errText = await response.text();
                window.alert('Add failed: ' + errText);
            }
        } catch (err) {
            window.alert('Add failed: ' + err.message);
        }
    };
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
