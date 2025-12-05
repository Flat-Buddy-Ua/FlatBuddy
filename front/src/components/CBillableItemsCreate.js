import React, { PureComponent } from 'react';
import { getComponentFromId } from '../Components';

export class CBillableItemsCreate extends PureComponent {
  state = {};

  render() {
    const Component = getComponentFromId(this.props.nodeId);
    return <Component {...this.props} {...this.state} />;
  }
}
