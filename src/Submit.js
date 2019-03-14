import React, { Component } from "react";
import PropTypes from "prop-types";

class Submit extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClick = this.handleClick.bind(this);

        if (process.env.NODE_ENV !== "production" && !context.form) {
            console.warn("Submit button used out of form context.");
        }

        this.state = {
            touched: false,
        };
    }

    handleClick(event) {
        this.setState({ touched: true });
        if (!this.context.form.isValid()) {
            this.context.form.forceValidate();
        }
        this.props.onClick && this.props.onClick(event);
    }

    render() {
        if (!this.context.form) {
            return null;
        }

        const { form } = this.context;

        const touched = !this.props.enabledUntilTouched || this.state.touched;

        const props = {
            ...this.props,
            disabled: touched && (form.isSubmitted() || !form.isValid()),
        };

        if (this.props.enabledUntilTouched) {
            props.onClick = this.handleClick;
        }

        return (
            <button {...props}>{this.props.children}</button>
        );
    }
}

Submit.contextTypes = {
    form: PropTypes.object.isRequired,
};

Submit.defaultProps = {
    enabledUntilTouched: true,
};

Submit.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    enabledUntilTouched: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
};

export default Submit;
