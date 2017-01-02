/**
 * Created by tsengkasing on 12/17/2016.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {BarChart, Bar, Brush, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import DatePicker from 'material-ui/DatePicker';
import $ from 'jquery';
import WarningDialog from './WarningDialog';
import StoreModelCompare from './StoreModelCompare';
import API from './API';

const styles = {
    Center : {
        textAlign:'center',
    },
};

class CalltotalTime extends React.Component {

    constructor(props) {
        super(props);
        const today = new Date();
        this.state = {
            data : [],
            today : today,
            from : null,
            to : today,
            loaded : false,
        };
    }

    loadData = (from, to) => {
        const data = {
            from : from,
            to : to,
        };

        const TT_URL = API.TimesTen + API.CallTotalTime;
        $.ajax({
            url : TT_URL,
            type : 'POST',
            data : JSON.stringify(data),
            contentType : 'application/json',
            success : function(data, textStatus, jqXHR) {
                console.log(data);
                this.refs.CompareExecutionTimeGraph.displayTimesTen(data.queryTime);
                if(this.state.loaded) return;
                let list = data.result;
                list.sort(API.sort_date);
                for(let i = 0; i < list.length; i++) {
                    list[i].totalTime = parseInt(list[i].totalTime / 60);
                }
                this.setState({
                    data : list,
                    loaded : true,
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });

        const Oracle_URL = API.Oracle + API.CallTotalTime;
        $.ajax({
            url : Oracle_URL,
            type : 'POST',
            data : JSON.stringify(data),
            contentType : 'application/json',
            success : function(data, textStatus, jqXHR) {
                console.log(data);
                this.refs.CompareExecutionTimeGraph.displayOracle(data.queryTime);
                if(this.state.loaded) return;
                let list = data.result;
                list.sort(API.sort_date);
                for(let i = 0; i < list.length; i++) {
                    list[i].totalTime = parseInt(list[i].totalTime / 60);
                }
                this.setState({
                    data : list,
                    loaded : true,
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    handleInputFrom = (event, date) => {
        this.setState({from : date});
    };

    handleInputTo = (event, date) => {
        this.setState({to : date});
    };

    handleSearch = () => {
        this.refs.CompareExecutionTimeGraph.reset();
        this.setState({loaded : false});
        let from = $('#from').val();
        let to = $('#to').val();
        if((from === '') || (to === ''))
            this.refs.warning.handleOpen('提示', '请选择开始日期和结束日期。');
        else if(from === to)
            this.refs.warning.handleOpen('提示', '请至少查询两天。');
        else {
            console.log('from :' + from + '\nto :' + to);
            this.loadData(from ,to);
        }
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
                                  maxDate={this.state.to}
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
                <StoreModelCompare ref="CompareExecutionTimeGraph" />
            </div>
        );
    }
}

export default CalltotalTime;