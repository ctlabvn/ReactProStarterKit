import React from "react";
import PropTypes from "prop-types";
import InputMask from "inputmask-core";

import { isUndo, isRedo, getSelection, setSelection } from "~/ui/utils";

export default class extends React.Component {
  static propTypes = {
    mask: PropTypes.string.isRequired,

    formatCharacters: PropTypes.object,
    placeholderChar: PropTypes.string
  };

  static defaultProps = {
    value: ""
  };

  componentWillMount() {
    const options = {
      pattern: this.props.mask,
      value: this.props.value,
      formatCharacters: this.props.formatCharacters
    };
    if (this.props.placeholderChar) {
      options.placeholderChar = this.props.placeholderChar;
    }
    this.mask = new InputMask(options);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.mask !== nextProps.mask &&
      this.props.value !== nextProps.mask
    ) {
      // if we get a new value and a new mask at the same time
      // check if the mask.value is still the initial value
      // - if so use the nextProps value
      // - otherwise the `this.mask` has a value for us (most likely from paste action)
      if (this.mask.getValue() === this.mask.emptyValue) {
        this.mask.setPattern(nextProps.mask, { value: nextProps.value });
      } else {
        this.mask.setPattern(nextProps.mask, {
          value: this.mask.getRawValue()
        });
      }
    } else if (this.props.mask !== nextProps.mask) {
      this.mask.setPattern(nextProps.mask, { value: this.mask.getRawValue() });
    } else if (this.props.value !== nextProps.value) {
      this.mask.setValue(nextProps.value);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.mask !== this.props.mask) {
      this.updatePattern(nextProps);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mask !== this.props.mask && this.mask.selection.start) {
      this._updateInputSelection();
    }
  }

  updatePattern(props) {
    this.mask.setPattern(props.mask, {
      value: this.mask.getRawValue(),
      selection: getSelection(this.input)
    });
  }

  _updateMaskSelection=()=> {
    this.mask.selection = getSelection(this.input);
  };

  _updateInputSelection=()=> {
    setSelection(this.input, this.mask.selection);
  };

  _onChange=(e)=> {
    // console.log('onChange', JSON.stringify(getSelection(this.input)), e.target.value)

    const maskValue = this.mask.getValue();
    if (e.target.value !== maskValue) {
      // Cut or delete operations will have shortened the value
      if (e.target.value.length < maskValue.length) {
        const sizeDiff = maskValue.length - e.target.value.length;
        this._updateMaskSelection();
        this.mask.selection.end = this.mask.selection.start + sizeDiff;
        this.mask.backspace();
      }
      const value = this._getDisplayValue();
      e.target.value = value;
      if (value) {
        this._updateInputSelection();
      }
    }
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  _onKeyDown=(e)=> {
    // console.log('onKeyDown', JSON.stringify(getSelection(this.input)), e.key, e.target.value)

    if (isUndo(e)) {
      e.preventDefault();
      if (this.mask.undo()) {
        e.target.value = this._getDisplayValue();
        this._updateInputSelection();
        if (this.props.onChange) {
          this.props.onChange(e);
        }
      }
      return;
    } else if (isRedo(e)) {
      e.preventDefault();
      if (this.mask.redo()) {
        e.target.value = this._getDisplayValue();
        this._updateInputSelection();
        if (this.props.onChange) {
          this.props.onChange(e);
        }
      }
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      this._updateMaskSelection();
      if (this.mask.backspace()) {
        const value = this._getDisplayValue();
        e.target.value = value;
        if (value) {
          this._updateInputSelection();
        }
        if (this.props.onChange) {
          this.props.onChange(e);
        }
      }
    }
  };

  _onKeyPress=(e)=> {
    // console.log('onKeyPress', JSON.stringify(getSelection(this.input)), e.key, e.target.value)

    // Ignore modified key presses
    // Ignore enter key to allow form submission
    if (e.metaKey || e.altKey || e.ctrlKey || e.key === "Enter") {
      return;
    }

    e.preventDefault();
    this._updateMaskSelection();
    if (this.mask.input(e.key || e.data)) {
      e.target.value = this.mask.getValue();
      this._updateInputSelection();
      if (this.props.onChange) {
        this.props.onChange(e);
      }
    }
  };

  _onPaste=(e)=> {
    // console.log('onPaste', JSON.stringify(getSelection(this.input)), e.clipboardData.getData('Text'), e.target.value)

    e.preventDefault();
    this._updateMaskSelection();
    // getData value needed for IE also works in FF & Chrome
    if (this.mask.paste(e.clipboardData.getData("Text"))) {
      e.target.value = this.mask.getValue();
      // Timeout needed for IE
      setTimeout(this._updateInputSelection, 0);
      if (this.props.onChange) {
        this.props.onChange(e);
      }
    }
  };

  _getDisplayValue() {
    const value = this.mask.getValue();
    return value === this.mask.emptyValue ? "" : value;
  }

  _keyPressPropName() {
    if (typeof navigator !== "undefined") {
      return navigator.userAgent.match(/Android/i)
        ? "onBeforeInput"
        : "onKeyPress";
    }
    return "onKeyPress";
  }

  _getEventHandlers() {
    return {
      onChange: this._onChange,
      onKeyDown: this._onKeyDown,
      onPaste: this._onPaste,
      [this._keyPressPropName()]: this._onKeyPress
    };
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  render() {
    const ref = r => {
      this.input = r;
    };
    const maxLength = this.mask.pattern.length;
    const value = this._getDisplayValue();
    const eventHandlers = this._getEventHandlers();
    const { size = maxLength, placeholder = this.mask.emptyValue } = this.props;

    const { placeholderChar, formatCharacters, ...cleanedProps } = this.props; // eslint-disable-line
    const inputProps = {
      ...cleanedProps,
      ...eventHandlers,
      ref,
      maxLength,
      value,
      size,
      placeholder
    };
    return <input {...inputProps} />;
  }
}