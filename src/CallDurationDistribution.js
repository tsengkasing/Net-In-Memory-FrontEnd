/**
 * Created by tsengkasing on 12/17/2016.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import API from './API';
import $ from 'jquery';
import StoreModelCompare from './StoreModelCompare';

const styles = {
    Title : {
        textAlign:'center',
    },
    Graph : {
        left : '-50%',
    },
    Container : {
        textAlign:'center',
        // overflowX: 'scroll',
    },
};

class CallDurationDistribution extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data : [],
            from : 1,
            to : 2,
            loaded : false,
        };
    }

    loadData = (from, to) => {
        const data = {
            from : from,
            to : to,
        };

        const TT_URL = API.TimesTen + API.CallDuration;
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
                this.setState({
                    data : list,
                    loaded : true,
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });

        const Oracle_URL = API.Oracle + API.CallDuration;
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

    handleInput = (event) => {
        let value = event.target.value;
        if(value <= 0) value = 1;
        if(event.target.id === 'from')
            this.setState({from : value});
        else {
            if(value <= this.state.from)
                value = this.state.from + 1;
            this.setState({to: value});
        }
    };

    handleSearch = () => {
        this.refs.CompareExecutionTimeGraph.reset();
        this.setState({loaded : false});
        console.log('from :' + this.state.from + '\nto :' + this.state.to);
        this.loadData(this.state.from, this.state.to);
    };

    render() {
        return (
            <div style={styles.Container}>
                <h3 style={styles.Title}>通话时长分布</h3>
                <div>
                    <TextField
                        id="from"
                        hintText="通话时长最小值"
                        floatingLabelText="通话时长最小值"
                        floatingLabelFixed={false}
                        type="number"
                        value={this.state.from}
                        onChange={this.handleInput}
                    />分钟<br/>
                    <TextField
                        id="to"
                        hintText="通话时长最大值"
                        floatingLabelText="通话时长最大值"
                        floatingLabelFixed={false}
                        type="number"
                        value={this.state.to}
                        onChange={this.handleInput}
                    />分钟<br/>
                    <RaisedButton label="查询" secondary={true} style={{margin:12}} onTouchTap={this.handleSearch} />
                </div>
                <ScatterChart
                    style={styles.Graph}
                    width={1024}
                    height={512}
                    margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                    <XAxis label="通话时长/分钟" dataKey={'duration'} name='通话时长' unit='分钟'/>
                    <YAxis label="通话数量/通" dataKey={'quantity'} name='通话数量' unit='通'/>
                    <Scatter name='通话时长分布' data={this.state.data} fill='#8884d8'/>
                    <CartesianGrid />
                    <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                </ScatterChart>
                <StoreModelCompare ref="CompareExecutionTimeGraph" />
            </div>
        );
    }
}

export default CallDurationDistribution;