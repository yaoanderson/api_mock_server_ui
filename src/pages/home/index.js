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
import PropTypes from 'prop-types';
import { alpha } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { visuallyHidden } from '@material-ui/utils';

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
            api_methods: [],
            filterApis: [],
            tab: 0,
            api_all_enabled: false,
            token: props.token,
            refresh_token: props.refresh_token,
            order: 'asc',
            orderBy: 'api',
            selected: [],
            page: 0,
            rowsPerPage: 5
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
          this.setState({ selected: this.state.rows.map((row) => row.id) });
        } else {
          this.setState({ selected: [] });
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
        if (this.state.debug || this.state.token) {
            this.updateProgress(100);
            this.callGetApis();
        }
    }

    render() {
        const { order, orderBy, selected, page, rowsPerPage } = this.state;
        var rows = this.state.filterApis || [];

        const visibleRows = [...rows]
            .sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage);

        const emptyRows = Math.max(0, rowsPerPage - visibleRows.length);

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
                        />

                        

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
                                    const isItemSelected = selected.includes(row);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    const api = row[0];
                                    const method = row[1];

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
                                                onChange={(event) =>
                                                    this.setStatus(index, event.target.checked)
                                                }
                                                checked={this.state.apis[api][method].enabled}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <SettingsIcon 
                                                style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.54)' }} 
                                                onClick={(e) => { e.stopPropagation(); this.openConfig(`${api} ${method}`); }} 
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
                let api_methods = []
                Object.entries(jsonData).forEach(([api, value]) => {
                    Object.keys(value).forEach(method => {
                        api_methods.push([api, method])
                    });
                });
                self.setState({
                    apis: jsonData,
                    api_methods: api_methods
                });
            } catch (err) {
                console.error(err.message);
            }
        }
        else {
            self.setState({
                apis: {},
                api_methods: []
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
