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

export default class RechargeRecord extends React.Component {

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

    getRechargeRecord = () => {
        this.refs.CompareExecutionTimeGraph.reset();
        this.setState({loaded : false});
        const data = {
            phone_number : Auth.phone_number,
            begin : 0
        };

        const TT_URL = API.TimesTen + API.RechargeRecord;
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
                    loaded : true,
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });

        const Oracle_URL = API.Oracle + API.RechargeRecord;
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
                    loaded : true,
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    componentDidMount() {
        this.getRechargeRecord();
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
                    style={{background : 'transparent'}}
                    selectable={false}
                >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                    >
                        <TableRow>
                            <TableHeaderColumn colSpan="2" tooltip="充值记录" style={{textAlign: 'center'}}>
                                充值记录
                            </TableHeaderColumn>
                        </TableRow>
                        <TableRow>
                            <TableHeaderColumn tooltip="充值时间">充值时间</TableHeaderColumn>
                            <TableHeaderColumn tooltip="充值金额" style={{textAlign: 'right'}}>充值金额</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        showRowHover={true}
                        displayRowCheckbox={false}
                    >
                        {this.state.current_list.map((row, index) => (
                            <TableRow key={index}>
                                <TableRowColumn>{row.time}</TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}} >{row.amount}元</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter
                        adjustForCheckbox={false}>
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