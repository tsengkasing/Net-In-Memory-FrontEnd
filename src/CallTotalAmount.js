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
    Title : {
        textAlign:'center',
    },
    Graph : {
        textAlign:'center',
    },
    Container : {
    },
};

const data = [
    {time: '2016-11-01', amount: 300},
    {time: '2016-11-02', amount: 145},
    {time: '2016-11-04', amount: 100},
    {time: '2016-11-05', amount: 8},
    {time: '2016-11-06', amount: 100},
    {time: '2016-11-07', amount: 9},
    {time: '2016-11-08', amount: 53},
    {time: '2016-11-09', amount: 252},
    {time: '2016-11-10', amount: 79},
    {time: '2016-11-11', amount: 294},
    {time: '2016-11-12', amount: 43},
    {time: '2016-11-13', amount: 74},
    {time: '2016-11-14', amount: 89},
    {time: '2016-11-15', amount: 117},
    {time: '2016-11-16', amount: 186},
    {time: '2016-11-17', amount: 16},
    {time: '2016-11-18', amount: 125},
    {time: '2016-11-19', amount: 222},
    {time: '2016-11-20', amount: 372},
    {time: '2016-11-21', amount: 182},
    {time: '2016-11-22', amount: 164},
    {time: '2016-11-23', amount: 316},
    {time: '2016-11-24', amount: 131},
    {time: '2016-11-25', amount: 291},
    {time: '2016-11-26', amount: 47},
    {time: '2016-11-27', amount: 415},
    {time: '2016-11-28', amount: 182},
    {time: '2016-11-29', amount: 93},
    {time: '2016-11-30', amount: 99},
    {time: '2016-12-01', amount: 52},
    {time: '2016-12-02', amount: 154},
    {time: '2016-12-03', amount: 205},
    {time: '2016-12-04', amount: 70},
    {time: '2016-12-05', amount: 25},
    {time: '2016-12-06', amount: 59},
];

class CallTotalamount extends React.Component {

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
        return (
            <div style={styles.Container}>
                <h3 style={styles.Title}>通话总额</h3>
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
                          style={styles.Graph}
                          data={this.state.data}
                          margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <XAxis label="时间/月" dataKey="time"/>
                    <YAxis label="通话总额/千万元"/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend verticalAlign="top" wrapperStyle={{lineHeight: '40px'}}/>
                    <ReferenceLine y={0} stroke='#000'/>
                    <Brush dataKey='time' height={30} stroke="#8884d8"/>
                    <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
                <WarningDialog ref="warning"/>
            </div>
        );
    }
}


export default CallTotalamount;

