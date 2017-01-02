/**
 * Created by tsengkasing on 12/21/2016.
 */
import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class StoreModelCompare extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            display : false,

            TimesTen : false,
            Oracle : false,

            data : [
                {type : 'Execution Time', TimesTen : 0, Oracle : 0},
            ],
        };
    }

    displayTimesTen = (queryTime) => {
        let data = this.state.data;
        data[0].TimesTen = parseInt(queryTime, 10);
        this.setState({
            data : data,
            TimesTen : true,
            display: true
        });
    };

    displayOracle = (queryTime) => {
        let data = this.state.data;
        data[0].Oracle = parseInt(queryTime, 10);
        this.setState({
            ata : data,
            Oracle : true,
            display: true
        });
    };

    reset = () => {
        this.setState({
            data : [{type : 'Execution Time', TimesTen : 0, Oracle : 0}],
            TimesTen : false,
            Oracle : false,
            display : false,
        });
    };

    render() {

        return (
            <div style={{display : this.state.display ? 'block' : 'none', margin : '0 auto', textAlign : 'center'}}>
                <BarChart layout="vertical" width={1024} height={128} data={this.state.data}
                          margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <XAxis type="number" label="毫秒" />
                    <YAxis dataKey="type" type="category" label="数据库"/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend verticalAlign="top" wrapperStyle={{lineHeight: '40px'}}/>
                    {this.state.Oracle ? <Bar dataKey="Oracle" fill="#ff7300" /> : null}
                    {this.state.TimesTen ? <Bar dataKey="TimesTen" fill="#8884d8" /> : null}
                </BarChart>
            </div>
        );
    }
}

export default StoreModelCompare;