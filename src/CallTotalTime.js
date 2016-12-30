/**
 * Created by tsengkasing on 12/17/2016.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {BarChart, Bar, Brush, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import DatePicker from 'material-ui/DatePicker';
import $ from 'jquery';
import WarningDialog from './WarningDialog';

const styles = {
    Center : {
        textAlign:'center',
    },
};

const data = [
    {time: '2016-11-01', totalTime: 300},
    {time: '2016-11-02', totalTime: 145},
    {time: '2016-11-04', totalTime: 100},
    {time: '2016-11-05', totalTime: 8},
    {time: '2016-11-06', totalTime: 100},
    {time: '2016-11-07', totalTime: 9},
    {time: '2016-11-08', totalTime: 53},
    {time: '2016-11-09', totalTime: 252},
    {time: '2016-11-10', totalTime: 79},
    {time: '2016-11-11', totalTime: 294},
    {time: '2016-11-12', totalTime: 43},
    {time: '2016-11-13', totalTime: 74},
    {time: '2016-11-14', totalTime: 89},
    {time: '2016-11-15', totalTime: 117},
    {time: '2016-11-16', totalTime: 186},
    {time: '2016-11-17', totalTime: 16},
    {time: '2016-11-18', totalTime: 125},
    {time: '2016-11-19', totalTime: 222},
    {time: '2016-11-20', totalTime: 372},
    {time: '2016-11-21', totalTime: 182},
    {time: '2016-11-22', totalTime: 164},
    {time: '2016-11-23', totalTime: 316},
    {time: '2016-11-24', totalTime: 131},
    {time: '2016-11-25', totalTime: 291},
    {time: '2016-11-26', totalTime: 47},
    {time: '2016-11-27', totalTime: 415},
    {time: '2016-11-28', totalTime: 182},
    {time: '2016-11-29', totalTime: 93},
    {time: '2016-11-30', totalTime: 99},
    {time: '2016-12-01', totalTime: 52},
    {time: '2016-12-02', totalTime: 154},
    {time: '2016-12-03', totalTime: 205},
    {time: '2016-12-04', totalTime: 70},
    {time: '2016-12-05', totalTime: 25},
    {time: '2016-12-06', totalTime: 59},
];

class CalltotalTime extends React.Component {

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
            data : data,
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
        if((from === '') || (to === ''))
            this.refs.warning.handleOpen('提示', '请选择开始日期和结束日期。');
        else if(from === to)
            this.refs.warning.handleOpen('提示', '请至少查询两天。');
        else
            console.log('from :' + from + '\nto :' + to);
    };

    render() {
        return(
            <div>
                <h3 style={styles.Center}>通话总量</h3>
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
                <BarChart width={1024}
                          height={512}
                          style={styles.Center}
                          data={this.state.data}
                          margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <XAxis label="时间/月" dataKey="time"/>
                    <YAxis label="通话总时长/分钟"/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend verticalAlign="top" wrapperStyle={{lineHeight: '40px'}}/>
                    <ReferenceLine y={0} stroke='#000'/>
                    <Brush dataKey='time' height={30} stroke="#82ca9d"/>
                    <Bar dataKey="totalTime" fill="#82ca9d" />
                </BarChart>
                <WarningDialog ref="warning"/>
            </div>
        );
    }
}

export default CalltotalTime;