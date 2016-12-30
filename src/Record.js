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

const tableData_1 = [
    {
        caller: '18221087115',
        called: '18201987108',
        call_time:'2016/12/5 12:56:00',
        dur_time : 4535,
        cost : '0.47',
    },
    {
        caller: '18221087115',
        called: '18201987108',
        call_time:'2016/12/5 12:56:00',
        dur_time : 3600,
        cost : '0.19',
    },
    {
        caller: '18221087115',
        called: '18201987108',
        call_time:'2016/12/5 12:56:00',
        dur_time : 60,
        cost : '0.19',
    },
    {
        caller: '18221087115',
        called: '18201987108',
        call_time:'2016/12/5 12:56:00',
        dur_time : '120',
        cost : '0.38',
    },
    {
        caller: '18221087115',
        called: '18201987108',
        call_time:'2016/12/5 12:56:00',
        dur_time : 60 * 60 * 23 + 61,
        cost : '0.19',
    },
    {
        caller: '18221087115',
        called: '18201987108',
        call_time:'2016/12/5 12:56:00',
        dur_time : 60 * 60 * 72,
        cost : '0.19',
    },
    {
        caller: '18221087115',
        called: '18201987108',
        call_time:'2016/12/5 12:56:00',
        dur_time : 60 * 60 * 24 + 61 + 60 * 62,
        cost : '0.19',
    },
];

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
        };
    }

    getCallRecord = () => {
        const URL = API.TimesTen + API.Record;
        const data = {
            phone_number : Auth.phone_number,
            begin : 0
        };
        $.ajax({
            url : URL,
            type : 'POST',
            data : JSON.stringify(data),
            contentType : 'application/json',
            success : function(data, textStatus, jqXHR) {
                console.log(data);
                let current_list = data.slice(0, 10);
                let pages_num = parseInt((data.length / 10), 10) + ((data.length % 10 > 0) ? 1 : 0);
                this.setState({
                    record: data,
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

    componentWillMount() {
        this.getCallRecord();
        // this.setState({
        //     current_page: 1,
        //     current_list: tableData_1,
        // });
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
                                <TableRowColumn>{row.cost}元</TableRowColumn>
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
            </div>
        );
    }
}