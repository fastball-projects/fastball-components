import React, { Component } from 'react';
import { Input } from '@alifd/next';

class ReadOnlySetter extends Component<any, any> {
  render() {
    const { placeholder, value } = this.props;
    return <Input
      disabled
      size="small"
      value={value}
      placeholder={placeholder || ''}
      onChange={(val: any) => onChange(val)}
      style={{ width: '100%' }}
    />;

  }
}

export default ReadOnlySetter;
