/**
 * Created by tsengkasing on 12/17/2016.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import $ from 'jquery';

const styles = {
    Title : {
        textAlign : 'center',
    },
    Container : {
        overflowX: 'visible',
    },
};

const data = [
    {time: '2016-01', quantity: 1398},
    {time: '2016-02', quantity: 2400},
    {time: '2016-03', quantity: 3908},
    {time: '2016-04', quantity: 4256},
    {time: '2016-05', quantity: 4800},
    {time: '2016-06', quantity: 5890},
    {time: '2016-07', quantity: 6793},
    {time: '2016-08', quantity: 8453},
    {time: '2016-09', quantity: 8890},
    {time: '2016-10', quantity: 9210},
    {time: '2016-11', quantity: 10041},
    {time: '2016-12', quantity: 11211},
];


class NewUsersQuantity extends React.Component {

    constructor(props) {
        super(props);
        const today = new Date();
        this.state = {
            data : [],
            today : today,
            from : today,
            to : null
        };
    }



    componentWillMount() {
        this.setState({
            data : data
        });
    }

    handleInputFrom = (event, date) => {
        this.setState({from : date});
    };

    handleInputTo = (event, date) => {
        this.setState({to : date});
    };

    handleSearch = () => {
        let from = $('#from').val();
        let to = $('#to').val();
        if((from === '') || (to === '') || (from === to))
            alert('时间范围选择不正确!');
        else
            console.log('from :' + from + '\nto :' + to);
    };

    render() {
        return (
            <div style={styles.Container}>
                <h3 style={styles.Title}>新增用户量</h3>
                <div>
                    <h4>选择查询时间段</h4>
                    <DatePicker hintText="开始日期"
                                okLabel="确定"
                                cancelLabel="取消"
                                  mode="landscape"
                                value={this.state.from}
                                onChange={this.handleInputFrom}
                                maxDate={this.state.today}
                                id="from"/>
                    <DatePicker hintText="结束日期"
                                  okLabel="确定"
                                  cancelLabel="取消"
                                  mode="landscape"
                                  value={this.state.to}
                                  onChange={this.handleInputTo}
                                  minDate={this.state.from}
                                  maxDate={this.state.today}
                                  id="to"/>
                    {/*从：<input type="month" style={{marginRight:20}} value={this.state.from} id="from" onChange={this.handleInput}/>*/}
                    {/*到：<input type="month" style={{marginRight:20}} value={this.state.to} id="to" onChange={this.handleInput}/>*/}
                    <RaisedButton label="查询" secondary={true} style={{margin:12}} onTouchTap={this.handleSearch} />
                </div>
                <LineChart width={1024} height={512} data={this.state.data}
                           margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <XAxis label="时间/月" dataKey="time"/>
                    <YAxis label="用户数量/个"/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend />
                    <Line type="monotone" dataKey="quantity" stroke="#8884d8" activeDot={{r: 8}}/>
                    {/*<Line type="monotone" dataKey="uv" stroke="#82ca9d" />*/}
                </LineChart>
            </div>
        );
    }
}

export default NewUsersQuantity;