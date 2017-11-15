import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames";

import {FormGroup, Label, Input} from "reactstrap";

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
			options: props.item.item_options,
		};
	}

	static propTypes = {
		item: PropTypes.object,
		onAddOrderItem: PropTypes.func.isRequired,
		inline: PropTypes.bool,
		autoClear: PropTypes.bool,
		checkAll: PropTypes.bool,
	};

	static defaultProps = {
	  inline: true,
	  autoClear: true,
	  checkAll: true,
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

	getOptions(){
		return Object.values(this.state.form).map(set=>Object.values(set).filter(value=>value))
			.reduce((a, b) => a.concat(b), []);
	}

	getTotalPrice(){
		return this.getOptions().reduce((a, b)=>a+b.price,0);	
	}

	validateMandatory(showError = true) {
		const { form, options} = this.state;		
		const { checkAll, t } = this.props;
		let check = true;
		for (let parent of options) {
			if (parent.optionSet && parent.mandatory) {
				// check state and show alert message
				if (this.checkObjectFalse(form[parent.opt_set_uuid])) {										
					check = false;
					if (showError) {
						document.querySelector("#error-" + parent.opt_set_uuid).innerText =
							t("LABEL.OPTION_IS_MANDATORY");
						// just show one
						if(!checkAll){
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

	resetFormTree(){
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
		const {item} = this.props;
		const needReload = item.item_options.some(itemOption => !itemOption.optionSet);
		if(needReload){
			// no need to show waiting, just update more
			const ret = await api.item.getDetail(item.item_uuid);
			this.setState({options: ret.data.item_options});
		}
		this.resetFormTree();
	}

	handleChange = (parentUuid, child, multiChoice) => {		
		const { disableAddToCart, form } = this.state;
		if (disableAddToCart) {
			this.setState({
				disableAddToCart: this.validateMandatory(false)
			});
		}

		if (!multiChoice) {
			for (let childUuid of Object.keys(form[parentUuid])) {
				form[parentUuid][childUuid] = false;
			}
		}
		form[parentUuid][child.option_uuid] = form[parentUuid][child.option_uuid]
			? false
			: child;
		this.setState({
			form: form
		}, ()=>{
			this.props.onChangeOption && this.props.onChangeOption(this.getTotalPrice(), this);
		});
	};

	renderOption(symbol, parent, t) {
		const {inline} = this.props;
		const inputType = parent.multiple_choice ? "checkbox" : "radio";
		const parentFormState = this.state.form[parent.opt_set_uuid];
		return (
			<div className={classNames(inline ? "col-md-flex flex-md-wrap col-md-10 mt-md-0 mt-2 no-gutters": "col-12 mt-4")}>
				{parent.optionSet.map((child, index) => {
					const inputName = parent.multiple_choice
						? `data[${parent.id}][${child.id}]`
						: `data[${parent.id}]`;
					return (
								<FormGroup className={classNames(inline?"col-md-3 float-left": "col-12")} key={index} check>
            <Label className="font-weight-bold text-uppercase color-black-300" check>
              <Input name={inputName}
									checked={parentFormState ? !!parentFormState[child.option_uuid] : false}
									onChange={() =>
										this.handleChange(
											parent.opt_set_uuid,
											child,
											parent.multiple_choice
										)}
									type={inputType}
									/>{' '}
              {child.name}
              <br/>
								{child.price > 0 && (
									<small className="badge badge-danger">
										{t("format.currency", {
											price: child.price,
											symbol: symbol
										})}
									</small>
								)}
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
			<div className={classNames(className, {"shift-to-menu":  shiftToMenu && canAddOrder})}>
				{options.map((parent, index) => (
					<div className={classNames("my-3 row no-gutters", {"border-bottom":index < options.length -1})} key={parent.opt_set_uuid}>
						<div className={classNames(inline?"col-md-2": "col-12")}>
							<strong className={classNames("group-label text-uppercase border-bottom", parent.mandatory ? "border-red color-red" : "border-gray-300 color-gray-300")}>
								{parent.name}{parent.mandatory ? '*' : ''}
							</strong>
						</div>
						{!!parent.optionSet &&
							this.renderOption(item.currency.symbol, parent, t)}
						<div className="col-12">
							<span
								className="text-danger text-error-msg"
								id={`error-${parent.opt_set_uuid}`}
							/>
						</div>
					</div>
				))}
				{!inline && 
					<div className="float-right mb-3">
						<strong>Total</strong>
						<span className="ml-2 color-red">
							{t("format.currency", {
											price: this.getTotalPrice(),
											symbol: item.currency.symbol
										})}
							</span>
					</div>
				}
				<div className="form-group text-right">					
						{canAddOrder && <button
							className={classNames("btn btn-danger btn-sm", {"btn-block":!inline})} 
							disabled={disableAddToCart}
							onClick={() => this.handleSubmit()}
						>
							{t("BUTTON.ADD_TO_CART")}
						</button>}					
				</div>
			</div>
		);
	}
}