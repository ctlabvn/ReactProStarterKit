import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames";

import { FormGroup, Label } from "reactstrap";
import Checkbox from "~/ui/components/Checkbox";

import api from "~/store/api";
import * as orderActions from "~/store/actions/order";

import "./index.css";

@translate("translations")
@connect(null, orderActions)
export default class ProductOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: {},
			disableAddToCart: false,
			options: props.item.item_options
		};
	}

	static propTypes = {
		item: PropTypes.object,
		onAddOrderItem: PropTypes.func.isRequired,
		inline: PropTypes.bool,
		autoClear: PropTypes.bool,
		checkAll: PropTypes.bool
	};

	static defaultProps = {
		inline: true,
		autoClear: false,
		checkAll: true
	};

	handleSubmit = () => {
		// clean error
		for (let spanTag of document.querySelectorAll(".text-error-msg")) {
			spanTag.innerText = "";
		}
		// validate mandatory
		const validateResult = this.validateMandatory();
		if (validateResult) {
			// save into order
			this.props.onAddOrderItem(this.props.item, this.getOptions());
			// clear checked
			this.props.autoClear && this.resetFormTree();
		} else {
			this.setState({
				disableAddToCart: true
			});
		}
	};

	getOptions() {
		return Object.values(this.state.form)
			.map(set => Object.values(set).filter(value => value))
			.reduce((a, b) => a.concat(b), []);
	}

	getTotalPrice() {
		return this.getOptions().reduce((a, b) => a + b.price, 0);
	}

	validateMandatory(showError = true) {
		const { form, options } = this.state;
		const { checkAll, t } = this.props;
		let check = true;
		for (let parent of options) {
			if (parent.optionSet && parent.mandatory) {
				// check state and show alert message
				if (this.checkObjectFalse(form[parent.opt_set_uuid])) {
					check = false;
					if (showError) {
						document.querySelector(
							"#error-" + parent.opt_set_uuid
						).innerText = t("LABEL.OPTION_IS_MANDATORY");
						// just show one
						if (!checkAll) {
							break;
						}
					}
				}
			}
		}
		return check;
	}

	checkObjectFalse(obj) {
		for (let objValue of Object.keys(obj)) {
			if (obj[objValue]) {
				return false;
			}
		}
		return true;
	}

	resetFormTree() {
		const { options } = this.state;
		let formTree = {};

		for (let parent of options) {
			if (parent.optionSet) {
				formTree[parent.opt_set_uuid] = {};
				for (let child of parent.optionSet) {
					formTree[parent.opt_set_uuid][child.option_uuid] = false;
				}
			}
		}
		this.setState({ form: formTree });
	}

	async componentDidMount() {
		const { item } = this.props;
		const needReload = item.item_options.some(
			itemOption => !itemOption.optionSet
		);
		if (needReload) {
			// no need to show waiting, just update more
			const ret = await api.item.getDetail(item.item_uuid);
			this.setState({ options: ret.data.item_options }, () =>
				this.resetFormTree()
			);
		} else {
			this.resetFormTree();
		}
	}

	componentWillReceiveProps({ item }) {
		if (item !== this.props.item) {
			this.setState({ options: item.item_options }, () => this.resetFormTree());
		}
	}

	handleChange = (parentUuid, child, multiChoice) => {
		const { disableAddToCart, form } = this.state;
		const newState = { form: { ...form } };
		if (disableAddToCart) {
			newState.disableAddToCart = this.validateMandatory(false);
		}

		if (!multiChoice) {
			for (let childUuid of Object.keys(newState.form[parentUuid])) {
				newState.form[parentUuid][childUuid] = false;
			}
		}

		newState.form[parentUuid][child.option_uuid] = newState.form[parentUuid][
			child.option_uuid
		]
			? false
			: child;

		this.setState(newState, () => {
			this.props.onChangeOption &&
				this.props.onChangeOption(this.getTotalPrice(), this);
		});
	};

	renderOption(symbol, parent, t) {
		//const { inline } = this.props;

    console.log("-------------- parent ", parent);

		const inputType = parent.multiple_option ? "checkbox" : "radio";
		const parentFormState = this.state.form[parent.opt_set_uuid];
		// console.log(parentFormState);
		return (
			<div className="d-md-flex flex-md-wrap w-100">
				{parent.optionSet.map((child, index) => {
					const inputName = parent.multiple_choice
						? `data[${parent.id}][${child.id}]`
						: `data[${parent.id}]`;
					return (
						<FormGroup
							className="col-md-4"
							key={index}
							check
						>
							<Label
								className="font-fr-120 color-cg-074"
								check
							>
								<Checkbox
									name={inputName}
									checked={
										parentFormState
											? !!parentFormState[child.option_uuid]
											: false
									}
									onChange={() =>
										this.handleChange(
											parent.opt_set_uuid,
											child,
											parent.multiple_option
										)}
									type={inputType}
                  content={`${child.name} - ${t("format.currency", {
                  price: child.price,
                  symbol: symbol
                })}`}
								/>
							</Label>
						</FormGroup>
					);
				})}
			</div>
		);
	}

	// this component is not element component so should not pass all props
	render() {
		const { t, item, canAddOrder, inline, shiftToMenu, className } = this.props;
		const { disableAddToCart, options } = this.state;

		return (
			<div
				className={classNames(className, {
					"shift-to-menu": shiftToMenu && canAddOrder
				})}
			>
				{options.map((parent, index) => (
					<div
						className={classNames("px-4 py-2 row no-gutters border-top", {
							//"border-bottom": index < options.length - 1
						})}
						key={parent.opt_set_uuid}
					>
						<div className="w-100">
							<div
								className={classNames(
									"group-label text-uppercase font-fb-140",
									parent.mandatory
										? "color-red"
										: "color-cg-040"
								)}
							>
								{parent.name}
								{parent.mandatory ? " * :" : " :"}
							</div>
              {!!parent.optionSet &&
              this.renderOption(item.currency.symbol, parent, t)}
						</div>

						<div className="col-12">
							<span
								className="text-danger text-error-msg"
								id={`error-${parent.opt_set_uuid}`}
							/>
						</div>
					</div>
				))}
				{!inline && (
					<div className="float-right mb-3">
						<strong>Total</strong>
						<span className="ml-2 color-red">
							{t("format.currency", {
								price: this.getTotalPrice(),
								symbol: item.currency.symbol
							})}
						</span>
					</div>
				)}
				<div className="text-right">
					{canAddOrder && (
            <div className="pr-2">
              <button
                className="mr-4 item-header-btn-add-to-cart btn"
                disabled={disableAddToCart}
                onClick={() => this.handleSubmit()}
              >
                <span role="button">+</span>
              </button>
              <div className="mr-1">ADD TO CART</div>
            </div>
					)}
				</div>
			</div>
		);
	}
}
