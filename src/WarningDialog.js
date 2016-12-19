/**
 * Created by tsengkasing on 12/19/2016.
 */
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class WarningDialog extends React.Component {
    state = {
        open: false,
        title : '',
        content: ''
    };

    handleOpen = (title, content) => {
        this.setState({
            open: true,
            title : title,
            content : content
        });
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const actions = [
            <FlatButton
                label="确定"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleClose}
            />,
        ];

        return (
            <div>
                <Dialog
                    title={this.state.title}
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    {this.state.content}
                </Dialog>
            </div>
        );
    }

}

export default WarningDialog;