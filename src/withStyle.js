// 函数返回一个高阶组件
// 具备公共特性

import React, { Component } from 'react'

export default (DecoratedComponent, styles) => {
  return class newComponent extends Component {

    render () {
      return <DecoratedComponent { ...this.props }/>
    }

    componentWillMount () {
      //  服务器端渲染时
      this.props.staticContext && (this.props.staticContext.css.push(styles._getCss()));
    }
  }
}
