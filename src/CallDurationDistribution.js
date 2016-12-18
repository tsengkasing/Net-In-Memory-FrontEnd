/**
 * Created by tsengkasing on 12/17/2016.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

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

const data = [
    {duration: 1, quantity: 1000},
    {duration: 2, quantity: 100},
    {duration: 3, quantity: 40},
    {duration: 4, quantity: 600},
    {duration: 5, quantity: 300},
    {duration: 10, quantity: 300},
    {duration: 20, quantity: 700},
    {duration: 25, quantity: 230},
    {duration: 30, quantity: 250},
    {duration: 35, quantity: 560},
    {duration: 40, quantity: 250},
    {duration: 45, quantity: 400},
    {duration: 60, quantity: 280},
    ];

class CallDurationDistribution extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data : [],
            from : 1,
            to : 2
        };
    }

    componentWillMount() {
        this.setState({
            data : data,
        });
    }

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
        console.log('from :' + this.state.from + '\nto :' + this.state.to);
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
            </div>
        );
    }
}

export default CallDurationDistribution;