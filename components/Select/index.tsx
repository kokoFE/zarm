import React, { Component } from 'react';
import classnames from 'classnames';
import { BaseSelectProps } from './PropsType';
import Picker from '../Picker';

function getValue(props, defaultValue?: any) {
  if (props.value) {
    return [].concat(props.value);
  }

  if (props.defaultValue) {
    return [].concat(props.defaultValue);
  }

  return defaultValue;
}

export interface SelectProps extends BaseSelectProps {
  prefixCls?: string;
  className?: string;
}

export default class Select extends Component<SelectProps, any> {

  static defaultProps = {
    prefixCls: 'za-select',
    valueMember: 'value',
    placeholder: '请选择',
    itemRender: data => data.label,
    displayRender: selected => selected.map(item => item.label),
    onClick: () => {},
  };

  private tempObjValue;

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible || false,
      value: getValue(props, []),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: getValue(nextProps, []),
    });

    if ('visible' in nextProps && nextProps.visible !== this.state.visible) {
      this.setState({
        visible: nextProps.visible,
      });
    }
  }

  toggle = () => {
    if (this.props.disabled) {
      return;
    }
    this.setState({ visible: !this.state.visible });
  }

  onInit = (selected) => {
    this.tempObjValue = selected;
  }

  handleClick = () => {
    this.props.onClick();
    this.toggle();
  }

  onOk = (selected) => {
    this.toggle();
    const { onChange, valueMember } = this.props;
    this.setState({
      value: selected.map(item => item[valueMember!]),
      objValue: selected,
    });
    if (typeof onChange === 'function') {
      onChange(selected);
    }
  }

  // 点击取消
  onCancel = () => {
    const { onCancel } = this.props;
    this.toggle();
    if (typeof onCancel === 'function') {
      onCancel();
    }
  }

  render() {
    const { prefixCls, placeholder, className, disabled, onChange, displayRender, ...others } = this.props;
    const { visible, value, objValue } = this.state;

    const cls = classnames(`${prefixCls}`, className);

    const inputCls = classnames(`${prefixCls}-input`, {
      [`${prefixCls}-placeholder`]: value.length === 0,
      [`${prefixCls}-disabled`]: !!disabled,
    });

    return (
      <div className={cls} onClick={this.handleClick}>
        <div className={inputCls}>
          {value.length > 0 && displayRender!(objValue || this.tempObjValue || []) || placeholder}
        </div>
        <Picker
          {...others}
          visible={visible}
          value={value}
          onInit={this.onInit}
          onOk={this.onOk}
          onCancel={this.onCancel}
        />
      </div>
    );
  }
}