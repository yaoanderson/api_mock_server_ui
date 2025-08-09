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

import './home.css'
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
import Slider from '@material-ui/core/Slider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Tooltip from '@material-ui/core/Tooltip';
import Radio from '@material-ui/core/Radio';

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
      id: 'api',
      numeric: false,
      disablePadding: true,
      label: 'API',
    },
    {
      id: 'method',
      numeric: false,
      disablePadding: false,
      label: 'METHOD',
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
              align={headCell.id === 'api'? 'left': 'center'}
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
        // 优先从localStorage恢复token
        const token = props.token || localStorage.getItem('token') || '';
        this.state = {
            debug: this.props.debug ?? false,
            redirect: props.isLogin ? false : true,
            progress: 0,
            progressIsDisplay: 'none',
            backdrop: false,
            apis: {},
            api_methods: [],
            filterApis: [],
            tab: 0,
            api_all_enabled: false,
            token,
            refresh_token: props.refresh_token,
            host: localStorage.getItem('host') || 'http://127.0.0.1',
            port: localStorage.getItem('port') || '8083',
            order: 'asc',
            orderBy: 'api',
            selected: [],
            page: 0,
            rowsPerPage: 5,
            apisLoading: false,
            error: null,
            addApiDialogOpen: false,
            newApiUrl: '',
            newApiMethod: 'GET',
            newApiMockEnabled: true,
            newApiParms: '',
            newApiContentType: '',
            newApiSpeed: 60, // 新增Transfer Rate字段，默认60
            deleteConfirmDialogOpen: false,
            fileDialogOpen: false,
            fileLoading: false,
            fileError: null,
            currentFileInfo: { api: '', method: '', filePath: '', fileName: '' },
            fileName: '',
            fileContent: '',
            fileContentType: 'application/json',
            fileCollapsed: true,
            selectedFile: null,
            selectedFileName: '',
            fileEditMode: 'content',
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
        this.setState({ page: newPage });
      };
    
      handleChangeRowsPerPage = (event) => {
        this.setState({
          rowsPerPage: parseInt(event.target.value, 10),
          page: 0
        });
      };

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
        if (this.props.isLogin && (this.state.debug || this.state.token)) {
            this.updateProgress(100);
            this.callGetApis();
        }
    }

    render() {
        if (!this.props.isLogin) {
            return <Redirect to="/login" />;
        }
        const { order, orderBy, selected, page, rowsPerPage } = this.state;
        var rows = this.state.filterApis || [];

        const visibleRows = [...rows]
            .sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage);

        const emptyRows = Math.max(0, rowsPerPage - visibleRows.length);

        if (this.state.apisLoading) {
          return <div>Loading...</div>;
        }
        if (this.state.error) {
          return <div>加载失败: {this.state.error}</div>;
        }

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
                        <div style={{ display: 'flex', alignItems: 'center', width: 1000, margin: '0 auto' }}>
                            <Autocomplete
                                multiple
                                id="apis_selector"
                                options={this.state.api_methods}
                                getOptionLabel={(option) => `${option[0]} ${option[1]}`}
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
                                                const newApiList = apiList.map(function (api_method) {
                                                    return api_method.trim()
                                                })
                                                let filterApis = []
                                                while (newApiList.length > 0) {
                                                    const api_item = newApiList.pop();
                                                    const api_method = api_item.split(" ");
                                                    const new_api = api_method[0];
                                                    const new_method = api_method[1];
                                                    filterApis = filterApis.concat(this.state.api_methods.filter((api, method) => api === new_api && method === new_method))
                                                }
                                                this.setFilterApis(filterApis)
                                            }
                                        }}
                                    />
                                )}
                                onChange={(event, value) => this.setFilterApis(value)}
                                value={this.state.filterApis}
                                style={{ margin: 10, width: 980 }}
                                getOptionSelected={(option, value) =>
                                    option[0] === value[0] && option[1] === value[1]
                                }
                            />
                            {this.state.selected.length > 0 && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{ marginLeft: 16, height: 40, textTransform: 'none' }}
                                    onClick={() => this.setState({ deleteConfirmDialogOpen: true })}
                                >
                                    Delete
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginLeft: 16, height: 40, textTransform: 'none' }}
                                onClick={() => this.setState({ addApiDialogOpen: true })}
                            >
                                Add
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
                                    const api = row[0];
                                    const method = row[1];
                                    const apiObj = this.state.apis[api];
                                    const methodObj = apiObj ? apiObj[method] : undefined;
                                    if (!apiObj || !methodObj) return null;

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
                                        >
                                            {api}
                                        </TableCell>
                                        <TableCell align="center">{method}</TableCell>
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
                                                                path: api,
                                                                method: method,
                                                                enabled: +checked
                                                            })
                                                        });
                                                        if (!response.ok) {
                                                            const errText = await response.text();
                                                            window.alert('update failed: ' + errText);
                                                        }
                                                        else {
                                                            self.setState(prevState => {
                                                                const newApis = { ...prevState.apis };
                                                                if (newApis[api] && newApis[api][method]) {
                                                                    newApis[api][method].enabled = +checked;
                                                                }
                                                                return { apis: newApis };
                                                            });
                                                        }
                                                    } catch (err) {
                                                        window.alert('update failed: ' + err.message);
                                                    }
                                                }}
                                                checked={!!this.state.apis[api][method].enabled}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <SettingsIcon 
                                                style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.54)' }} 
                                                onClick={(e) => { e.stopPropagation(); this.openConfig(`${api} ${method}`); }} 
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <DescriptionIcon
                                                style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.54)' }}
                                                onClick={(e) => { e.stopPropagation(); this.openFileInfo(api, method); }}
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
                                    <TableCell colSpan={6} />
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
                        page={page}
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
                                    const [path, method] = this.state.selected[i];
                                    try {
                                        const response = await fetch(`${this.state.host}:${this.state.port}/update_api_config`, {
                                            method: 'DELETE',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ path, method }),
                                        });
                                        if (!response.ok) {
                                            const errText = await response.text();
                                            window.alert('delete failed: ' + errText);
                                            failed = true;
                                            continue;
                                        }
                                        selected = selected.filter(item => !(item[0] === path && item[1] === method));
                                        filterApis = filterApis.filter(item => !(item[0] === path && item[1] === method));
                                        if (apis[path] && apis[path][method]) {
                                            delete apis[path][method];
                                            if (Object.keys(apis[path]).length === 0) {
                                                delete apis[path];
                                            }
                                        }
                                    } catch (err) {
                                        window.alert('delete failed: ' + err.message);
                                        failed = true;
                                    }
                                }
                                let api_methods = [];
                                Object.entries(apis).forEach(([api, value]) => {
                                    Object.keys(value).forEach(method => {
                                        api_methods.push([api, method]);
                                    });
                                });
                                const validApiMethodsSet = new Set(api_methods.map(item => JSON.stringify(item)));
                                filterApis = filterApis.filter(item => validApiMethodsSet.has(JSON.stringify(item)));

                                localStorage.setItem('filterApis', JSON.stringify(filterApis));
                                localStorage.setItem('selected', JSON.stringify(selected));
                                this.setState({
                                    apis,
                                    api_methods,
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
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                    style={{ marginBottom: 12 }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <FormControlLabel
                                            control={<Radio checked={this.state.fileEditMode === 'content'} onChange={() => this.setState({ fileEditMode: 'content' })} />}
                                            label="Content Update"
                                            style={{ marginRight: 8 }}
                                        />
                                    </div>
                                    <Button size="small" onClick={() => this.setState({ fileCollapsed: !this.state.fileCollapsed })} startIcon={this.state.fileCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon /> }>
                                        {this.state.fileCollapsed ? 'Expand' : 'Collapse'}
                                    </Button>
                                </div>
                                <TextField
                                    value={this.state.fileContent || ''}
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    minRows={this.state.fileCollapsed ? 1 : 8}
                                    maxRows={this.state.fileCollapsed ? 1 : 32}
                                    onChange={(e) => this.setState({ fileContent: e.target.value })}
                                    disabled={this.state.fileEditMode !== 'content'}
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

    openFileInfo = async (api, method) => {
        this.setState({
            fileDialogOpen: true,
            fileLoading: true,
            fileError: null,
            currentFileInfo: { api, method, filePath: '', fileName: '' },
            fileName: '',
            fileContent: ''
        });
        try {
            const url = `${this.state.host}:${this.state.port}/update_api_config?path=${encodeURIComponent(api)}&method=${encodeURIComponent(method)}`;
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
            const methodKey = (method || '').toUpperCase();
            const methodObj = payload && payload[methodKey] ? payload[methodKey] : {};
            const name = methodObj && methodObj.origin ? methodObj.origin : '';
            let contentText = JSON.stringify(methodObj || {}, null, 2);
            if (name) {
                try {
                    const rawApi = api || '';
                    const fileUrl = `${this.state.host}:${this.state.port}${rawApi}`;
                    const contentType = (methodObj && methodObj.content_type) ? methodObj.content_type : 'application/json';
                    const fileResp = await fetch(fileUrl, { method: 'GET', headers: { 'Content-Type': contentType } });
                    if (fileResp.ok) {
                        const fileData = await fileResp.text();
                        contentText = fileData;
                    }
                } catch (err) {
                    // ignore and keep fallback contentText
                }
            }
            this.setState({
                fileLoading: false,
                fileName: name,
                fileContent: contentText,
                fileContentType: methodObj && methodObj.content_type ? methodObj.content_type : 'application/json'
            });
        } catch (e) {
            this.setState({ fileLoading: false, fileError: e.message || String(e) });
        }
    }

    handleUpdateFile = async () => {
        try {
            const { fileName, fileContent, fileContentType, selectedFile, fileEditMode } = this.state;
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
            const resp = await fetch(`${this.state.host}:${this.state.port}/update_api_file`, {
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

    async setStatus(index, status) {
        const self = this;
        for (var i=0; i<self.state.filterApis.length; i++) {
            if (index !== null && index !== i) {
                continue;
            }
            let id = self.state.filterApis[i];
            const api = id[0];
            const method = id[1];
            if (!!self.state.apis[api][method].enabled !== status) {
                self.callUpdateApi(api, method, status);
            }
        }
    }

    setFilterApis(value) {
        this.setState({ filterApis: value }, () => {
            localStorage.setItem('filterApis', JSON.stringify(this.state.filterApis));
        });
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
        self.setState({ apisLoading: true });
        if (self.state.debug) {
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
                let api_methods = []
                Object.entries(jsonData).forEach(([api, value]) => {
                    Object.keys(value).forEach(method => {
                        api_methods.push([api, method])
                    });
                });
                self.setState({
                    apis: jsonData,
                    api_methods: api_methods,
                    apisLoading: false
                });
            } catch (err) {
                console.error(err.message);
                self.setState({ apis: {}, apisLoading: false, error: err.message });
            }
        }
        else {
            self.setState({
                apis: {},
                api_methods: [],
                apisLoading: false
            });
        }
    }

    handleApiConfigSave = (api, method, config) => {
        this.setState(prevState => {
            const apis = { ...prevState.apis };
            if (apis[api] && apis[api][method]) {
                apis[api][method] = {
                    ...apis[api][method],
                    ...config
                };
            }
            return { apis };
        });
    };

    handleAddApiSubmit = async () => {
        const { newApiUrl, newApiMethod, newApiMockEnabled, newApiParms, newApiContentType, newApiSpeed } = this.state;
        const apiConfig = {
            enabled: newApiMockEnabled,
            parms: newApiParms,
            content_type: newApiContentType,
            speed: newApiSpeed,
            origin: newApiUrl
        };
        try {
            const response = await fetch(`${this.state.host}:${this.state.port}/update_api_config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: newApiUrl,
                    method: newApiMethod,
                    parms: newApiParms,
                    content_type: newApiContentType,
                    enabled: +newApiMockEnabled,
                    speed: newApiSpeed
                }),
            });
            if (response.ok) {
                this.setState(prevState => {
                    const newApis = { ...prevState.apis };
                    if (!newApis[newApiUrl]) newApis[newApiUrl] = {};
                    newApis[newApiUrl][newApiMethod] = apiConfig;
                    const newFilterApis = Array.isArray(prevState.filterApis) ? [...prevState.filterApis] : [];
                    const api_methods = this.state.api_methods;
                    const newApiMethodItem = api_methods.find(
                        item => item[0] === newApiUrl && item[1] === newApiMethod
                    );
                    if (newApiMethodItem && !newFilterApis.some(item => item[0] === newApiUrl && item[1] === newApiMethod)) {
                        newFilterApis.push(newApiMethodItem);
                    }
                    localStorage.setItem('filterApis', JSON.stringify(newFilterApis));
                    return {
                        apis: newApis,
                        filterApis: newFilterApis,
                        addApiDialogOpen: false,
                        newApiUrl: '',
                        newApiMethod: 'GET',
                        newApiMockEnabled: true,
                        newApiParms: '',
                        newApiContentType: '',
                        newApiSpeed: 60,
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
