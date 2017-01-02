/**
 * Created by tsengkasing on 12/17/2016.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import $ from 'jquery';
import WarningDialog from './WarningDialog';
import StoreModelCompare from './StoreModelCompare';
import API from './API';

const styles = {
    Title : {
        textAlign : 'center',
    },
    Container : {
        overflowX: 'visible',
    },
};

class NewUsersQuantity extends React.Component {

    constructor(props) {
        super(props);
        // const today = new Date();
        this.state = {
            data : [],
            today : "",
            from : "",
            to : "",
            loaded : false,
        };
    }

    loadData = (from, to) => {
        const data = {
            from : from,
            to : to,
        };

        const TT_URL = API.TimesTen + API.NewUser;
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
                list.sort(API.sort_month);
                this.setState({
                    data : list,
                    loaded : true,
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });

        const Oracle_URL = API.Oracle + API.NewUser;
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
                list.sort(API.sort_month);
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
        //this.setState({from : date});
        this.setState({from : event.target.value});
        //
    };

    handleInputTo = (event, date) => {
        // this.setState({to : date});
        this.setState({to : event.target.value});
    };

    handleSearch = () => {
        this.refs.CompareExecutionTimeGraph.reset();
        this.setState({loaded : false});
        //let from = $('#from').val();
        let from = this.state.from;
        //let to = $('#to').val();
        let to = this.state.to;
        if((from === '') || (to === ''))
            this.refs.warning.handleOpen('提示', '请选择开始月份和结束月份。');
        else if(from === to)
            this.refs.warning.handleOpen('提示', '请至少查询两个月。');
        else {
            console.log('from :' + from + '\nto :' + to);
            this.loadData(from + '-01', to + '-01');
        }
    };

    render() {
        return (
            <div style={styles.Container}>
                <h3 style={styles.Title}>新增用户量</h3>
                <div>
                    <h4>选择查询时间段</h4>
                    {/*<DatePicker hintText="开始日期"*/}
                                {/*okLabel="确定"*/}
                                {/*cancelLabel="取消"*/}
                                  {/*mode="landscape"*/}
                                {/*value={this.state.from}*/}
                                {/*onChange={this.handleInputFrom}*/}
                                {/*maxDate={this.state.today}*/}
                                {/*id="from"/>*/}
                    {/*<DatePicker hintText="结束日期"*/}
                                  {/*okLabel="确定"*/}
                                  {/*cancelLabel="取消"*/}
                                  {/*mode="landscape"*/}
                                  {/*value={this.state.to}*/}
                                  {/*onChange={this.handleInputTo}*/}
                                  {/*minDate={this.state.from}*/}
                                  {/*maxDate={this.state.today}*/}
                                  {/*id="to"/>*/}
                    从：<input type="month" style={{marginRight:20}} value={this.state.from} onChange={this.handleInputFrom}/>
                    到：<input type="month" style={{marginRight:20}} value={this.state.to} onChange={this.handleInputTo}/>
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
                <WarningDialog ref="warning" />
                <StoreModelCompare ref="CompareExecutionTimeGraph" />
            </div>
        );
    }
}

export default NewUsersQuantity;