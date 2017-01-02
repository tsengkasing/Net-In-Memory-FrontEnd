/**
 * Created by kevin on 12/11/2016.
 */
import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
    from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import $ from 'jquery';
import Auth from './Auth';
import API from './API';
import StoreModelCompare from './StoreModelCompare';

const styles = {
    table : {
        minWidth: '835px',
        overflowX : 'scroll',
        overflowY : 'hidden',
        background : 'transparent',
    },
    tableBody : {
        minWidth: '835px',
        overflowX : 'auto',
        overflowY : 'hidden',
    }
};

export default class Record extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pages_num : 1,
            current_list : [],
            current_page : 1,
            record : [],
            disablePreviousButton : true,
            disableNextButton : true,
            loaded : false,
        };
    }

    getCallRecord = () => {
        this.refs.CompareExecutionTimeGraph.reset();
        this.setState({loaded : false});
        const data = {
            phone_number : Auth.phone_number,
            begin : 0
        };

        const TT_URL = API.TimesTen + API.Record;
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
                let current_list = list.slice(0, 10);
                let pages_num = parseInt((list.length / 10), 10) + ((list.length % 10 > 0) ? 1 : 0);
                this.setState({
                    record: list,
                    pages_num: pages_num,
                    current_page: 1,
                    current_list: current_list,
                    disableNextButton: pages_num <= 1,
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });

        const Oracle_URL = API.Oracle+ API.Record;
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
                let current_list = list.slice(0, 10);
                let pages_num = parseInt((list.length / 10), 10) + ((list.length % 10 > 0) ? 1 : 0);
                this.setState({
                    record: list,
                    pages_num: pages_num,
                    current_page: 1,
                    current_list: current_list,
                    disableNextButton: pages_num <= 1,
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    componentDidMount() {
        this.getCallRecord();
    };

    parseDuration = (seconds) => {
        let day = parseInt(seconds / 3600 / 24, 10);
        let hour = parseInt(seconds / 3600 % 24, 10);
        let minute = parseInt(((seconds / 60) % 60), 10);
        let second = (seconds % 60);

        if(seconds >= 60) {
            if((seconds / 60) >= 60) {
                if((seconds / 3600) >= 24)
                    return day + ' 天 ' + (hour === 0 ? '' : hour + ' 小时 ') + (minute === 0 ? '' : minute + ' 分钟 ') + (second === 0 ? '' : second  + ' 秒');
                else
                    return hour + ' 小时 ' + (minute === 0 ? '' : minute + ' 分钟 ') + (second === 0 ? '' : second  + ' 秒');
            }else
                return minute + ' 分钟 ' + (second === 0 ? '' : second + ' 秒');
        }else
            return seconds + ' 秒';
    };

    previousPage= () => {

        let current_page = parseInt(this.state.current_page, 10) - 1;
        let current_list = this.state.record.slice((current_page - 1) * 10, (current_page - 1) * 10 + 10);
        this.setState({
            current_page : current_page,
            current_list : current_list,
            disableNextButton: false,
            disablePreviousButton: ((parseInt(this.state.current_page, 10) - 1) === 1),
        });

    };

    nextPage = () => {

        let current_page = (parseInt(this.state.current_page, 10) + 1);
        let current_list = this.state.record.slice((current_page - 1) * 10, (current_page - 1) * 10 + 10);
        this.setState({
            current_page : current_page,
            current_list : current_list,
            disableNextButton: ((parseInt(this.state.current_page, 10) + 1) === parseInt(this.state.pages_num, 10)),
            disablePreviousButton: false,
        });

    };

    render() {
        return (
            <div>
                <Table
                    selectable={false}
                    style={styles.table}
                    bodyStyle={styles.tableBody}
                >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                    >
                        <TableRow>
                            <TableHeaderColumn colSpan="5" tooltip="通话记录" style={{textAlign: 'center'}}>
                                通话记录
                            </TableHeaderColumn>
                        </TableRow>
                        <TableRow>
                            <TableHeaderColumn tooltip="主叫">主叫</TableHeaderColumn>
                            <TableHeaderColumn tooltip="被叫">被叫</TableHeaderColumn>
                            <TableHeaderColumn tooltip="呼叫时间">呼叫时间</TableHeaderColumn>
                            <TableHeaderColumn tooltip="通话时长">通话时长</TableHeaderColumn>
                            <TableHeaderColumn tooltip="消费金额">消费金额</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        showRowHover={true}
                        displayRowCheckbox={false}>
                        {this.state.current_list.map((row, index) => (
                            <TableRow key={index}>
                                <TableRowColumn>{row.caller}</TableRowColumn>
                                <TableRowColumn>{row.called}</TableRowColumn>
                                <TableRowColumn>{row.call_time}</TableRowColumn>
                                <TableRowColumn>{this.parseDuration(row.dur_time)}</TableRowColumn>
                                <TableRowColumn>{row.cost.toFixed(2)}元</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter
                        adjustForCheckbox={false}
                    >
                        <TableRow>
                            <TableRowColumn colSpan="5" style={{textAlign: 'center'}}>
                                <FlatButton primary={true} label="上一页" onTouchTap={this.previousPage} disabled={this.state.disablePreviousButton} />
                                {this.state.current_page}/{this.state.pages_num}
                                <FlatButton primary={true} label="下一页" onTouchTap={this.nextPage} disabled={this.state.disableNextButton} />
                            </TableRowColumn>
                        </TableRow>
                    </TableFooter>
                </Table>
                <StoreModelCompare ref="CompareExecutionTimeGraph" />
            </div>
        );
    }
}