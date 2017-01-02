/**
 * Created by kevin on 12/11/2016.
 */
import React from 'react';
import {Card, CardHeader} from 'material-ui/Card';
import {hashHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import $ from 'jquery';
import API from './API';
import Auth from './Auth';
import StoreModelCompare from './StoreModelCompare';

const styles = {
    button : {
        margin : 12,
    },
    radioButton: {
        marginTop: 16,
    },
};

const radios = [
    {
        key: '1',
        value: '10',
        label: '10元',
    },
    {
        key: '2',
        value: '20',
        label: '20元',
    },
    {
        key: '3',
        value: '30',
        label: '30元',
    },
    {
        key: '4',
        value: '50',
        label: '50元',
    },
    {
        key: '5',
        value: '100',
        label: '100元',
    },
    {
        key: '6',
        value: '200',
        label: '200元',
    },
    {
        key: '7',
        value: '300',
        label: '300元',
    },
    {
        key: '8',
        value: '500',
        label: '500元',
    },
    // {
    //     key: '9',
    //     value: '1000000',
    //     label: '1,000,000元 [测试用]',
    // },
];

class Home extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            open: false,
            balance : 0,
            plan : '',
            recharge : '10',

            disableRechargeButton : false,
            disableCallingButton : false,

            loaded : false,
        };
    };

    getBalance = () => {
        this.refs.CompareExecutionTimeGraph.reset();
        this.setState({loaded : false});

        const data = {
            phone_number : Auth.phone_number
        };

        const TT_URL = API.TimesTen + API.Balance;
        $.ajax({
            url : TT_URL,
            type : 'POST',
            contentType : 'application/json',
            data : JSON.stringify(data),
            success : function(data, textStatus, jqXHR) {
                console.log(data);
                this.refs.CompareExecutionTimeGraph.displayTimesTen(data.queryTime);
                if(this.state.loaded) return;
                let obj = data.result;
                this.setState({
                    balance : obj.balance,
                    plan : obj.plan.description,
                    loaded : true,
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });

        const Oracle_URL = API.Oracle + API.Balance;
        $.ajax({
            url : Oracle_URL,
            type : 'POST',
            contentType : 'application/json',
            data : JSON.stringify(data),
            success : function(data, textStatus, jqXHR) {
                console.log(data);
                this.refs.CompareExecutionTimeGraph.displayOracle(data.queryTime);
                if(this.state.loaded) return;
                let obj = data.result;
                this.setState({
                    balance : obj.balance,
                    plan : obj.plan.description,
                    loaded : true,
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    componentDidMount() {
        this.getBalance();
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleRecharge = () => {
        const data = {
            phone_number : Auth.phone_number,
            amount : this.state.recharge
        };
        const TT_URL = API.TimesTen + API.Recharge;
        $.ajax({
            url : TT_URL,
            type : 'POST',
            data : JSON.stringify(data),
            contentType : 'application/json',
            success : function(data, textStatus, jqXHR) {
                console.log(data);
                this.setState({
                    // balance : (parseFloat(this.state.balance) + parseFloat(this.state.recharge)).toFixed(2),
                    open: false,
                    disableRechargeButton : false,
                    disableCallingButton  : false
                });
                hashHistory.push('/Home');
                this.getBalance();
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    handleClose = () => {
        this.setState({
            open: false
        });
    };

    handleChange = (event) => {
        this.setState({recharge:event.target.value});
    };

    handleSearchRecharge = (event) => {
        this.refs.CompareExecutionTimeGraph.reset();
        this.setState({
            disableRechargeButton : true,
            disableCallingButton  : false
        });
        hashHistory.push('/Home/Recharge');
    };

    handleSearchCalling = (event) => {
        this.refs.CompareExecutionTimeGraph.reset();
        this.setState({
            disableCallingButton  : true,
            disableRechargeButton :false
        });
        hashHistory.push('/Home/Record');
    };

    render() {
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="充值"
                primary={true}
                onTouchTap={this.handleRecharge}
            />
        ];



        return (
            <div style={{maxWidth: '1024px', margin:'0 auto'}}>
                <Card containerStyle={{margin: 16}} style={{background : 'transparent'}}>
                    <CardHeader
                        title={Auth.phone_number}
                        avatar="dynamic/img/avator.jpg"
                        actAsExpander={true}
                    />
                    <List>
                        <ListItem primaryText={'余额 : ' + parseInt(this.state.balance, 10).toFixed(2) + ' 元'} rightIcon={<RaisedButton label="充值" primary={true} style={styles.button} onTouchTap={this.handleOpen} />} />
                        <ListItem primaryText={'套餐 : ' + this.state.plan} />
                    </List>
                    <RaisedButton label="查询充值记录" primary={true} style={styles.button} onTouchTap={this.handleSearchRecharge} disabled={this.state.disableRechargeButton} />
                    <RaisedButton label="查询流水" primary={true} style={styles.button} onTouchTap={this.handleSearchCalling} disabled={this.state.disableCallingButton} />
                </Card>
                <Dialog
                    title="选择充值金额"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                >
                    <RadioButtonGroup name="feeRecharge" defaultSelected="1" valueSelected={this.state.recharge} onChange={this.handleChange}>
                        {radios.map((radio)=> (
                            <RadioButton
                                key={radio.key}
                                value={radio.value}
                                label={radio.label}
                                style={styles.radioButton}
                            />
                        ))}
                    </RadioButtonGroup>
                </Dialog>
                {this.props.children}
                <StoreModelCompare ref="CompareExecutionTimeGraph" />
            </div>
        );
    }
}

export default Home;