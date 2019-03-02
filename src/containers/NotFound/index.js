import React, { Component } from 'react'

class NotFound extends Component {

  render () {
    return (
      <div>
        <h2>404</h2>
        <p>page not found</p>
      </div>
    );
  }

  componentWillMount () {
    // 只有服务器端会传递 context
    // 所以只在服务器端渲染时修改 context
    let { staticContext } = this.props;
    staticContext && (staticContext.notFound = true);
  }

}

export default NotFound
