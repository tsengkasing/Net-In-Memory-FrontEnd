/**
 * Created by kevin on 12/10/2016.
 */
import React from 'react';
import SimpleDialog from './Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {hashHistory } from 'react-router'
import $ from 'jquery';
import Auth from './Auth'
import API from './API'


const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    slide: {
        marginTop : '8%',
        padding: 10,
        verticalAlign: 'middle',
    },
};

class Sign extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            phone_number : '',
            password : '',

            error_phone_number : null,
            error_password : null
        };
    }


    inputUsername = (event) => {
        this.setState({
            phone_number : event.target.value,
            error_phone_number : null
        });
    };

    inputPassword = (event) => {
        this.setState({
            password : event.target.value,
            error_password : null
        });
    };

    redirect(type) {
        if(type === 'admin')
            hashHistory.push('/Admin');
        else
            hashHistory.push('/Home');
    };

    // 登录
    onSignIn = () => {

        /*
         * 为了测试而存在
         */
        if(this.state.phone_number === '10086'){

            if(this.state.password !== '10086') {
                this.setState({error_password : '密码错误！'});
                return;
            }

            this.refs.dialog.setContent('登录成功!', '此账号登录仅供内部浏览界面测试。', 'user');
            this.refs.dialog.handleOpen();
            Auth.phone_number = this.state.phone_number;
            Auth.admin = null;
            return;
        }else if(this.state.phone_number === 'admin') {
            if(this.state.password !== 'admin') {
                this.setState({error_password : '密码错误！'});
                return;
            }

            this.refs.dialog.setContent('登录成功!', '点击确定后跳转到主页。', 'admin');
            this.refs.dialog.handleOpen();
            Auth.admin = '管理员';
            Auth.phone_number = null;
            return;
        }
        // eslint-disable-next-line
        if(this.state.phone_number == '') {
            this.setState({
                error_phone_number : '电话号码不能为空'
            });
        // eslint-disable-next-line
        }else if (this.state.password == '') {
            this.setState({
                error_password : '密码不能为空'
            });
        }


        const URL = API.TimesTen + API.SignIn;
        const data = {
            phone_number : this.state.phone_number,
            password : this.state.password
        };
        $.ajax({
            url : URL,
            type : 'POST',
            contentType : 'application/json',
            data : JSON.stringify(data),
            success : function(data, textStatus, jqXHR) {
                console.log(data);
                if(data.result){
                    this.refs.dialog.setContent('登录成功!', '点击确定后跳转到主页。');
                    this.refs.dialog.handleOpen();

                    Auth.phone_number = this.state.phone_number;
                }
                else this.setState({error_password: 'password not matched'});
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    render() {
        return (
            <div style={styles.slide} className="alignCenter">
                    <h1>模拟电信</h1>
                    <p>查询你的电话信息</p>
                    <TextField hintText="电话号码"
                               floatingLabelText="电话号码"
                               type="text"
                               errorText={this.state.error_phone_number}
                               value={this.state.phone_number}
                               onChange={this.inputUsername}/>
                    <br/>
                    <TextField hintText="密码"
                               floatingLabelText="密码"
                               type="password"
                               errorText={this.state.error_password}
                               value={this.state.password}
                               onChange={this.inputPassword}/>
                    <br/><br/>
                    <RaisedButton label="登录"
                                  primary={true}
                                  className="inputForm"
                                  onClick={this.onSignIn}/>
                    <SimpleDialog ref="dialog" onPress={this.redirect}/>
        </div>);
    }
}

export default Sign;