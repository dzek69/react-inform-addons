import React, { Component } from "react";
import { form } from "react-inform";
import mapObject from "bottom-line-utils/mapValues";

const withInform = (formData) => { // eslint-disable-line max-lines-per-function
    return (ComponentToWrap, { onSubmit } = {}) => { // eslint-disable-line max-lines-per-function
        class Wrapped extends Component {
            constructor(props, context) {
                super(props, context);

                this.saveRef = this.saveRef.bind(this);

                this.state = {
                    submitted: false,
                };

                this.form = {
                    isSubmitted: () => {
                        return this.state.submitted;
                    },
                    submit: () => {
                        if (this.state.submitted) {
                            return;
                        }
                        this.setState({
                            submitted: true,
                        });
                    },
                    resetSubmit: () => {
                        if (!this.state.submitted) {
                            return;
                        }
                        this.setState({
                            submitted: false,
                        });
                    },
                    props: {
                        onSubmit: (event) => {
                            this.form.submit();

                            const ref = this.ref;
                            ref && ref[onSubmit] && ref[onSubmit](event);
                        },
                    },
                };
            }

            getChildContext() {
                return {
                    form: {
                        ...this.context.form,
                        ...this.form,
                        reset: () => {
                            this.context.form.onValues({});
                            this.context.form.resetTouched();
                            this.form.resetSubmit();
                        },
                    },
                    fields: mapObject(this.context.fields, (fieldProps) => ({
                        ...fieldProps,
                        props: {
                            ...fieldProps.props,
                            readOnly: fieldProps.props.readOnly || this.state.submitted,
                        },
                    })),
                };
            }

            saveRef(ref) {
                this.ref = ref;
            }

            render() {
                return <ComponentToWrap {...this.props} {...this.getChildContext()} ref={this.saveRef} />;
            }
        }

        Wrapped.displayName = "WithInform(" + (ComponentToWrap.displayName || ComponentToWrap.name) + ")";

        return form(formData)(Wrapped);
    };
};

export default withInform;
