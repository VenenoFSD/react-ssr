import React, { Component } from 'react'
import styles from './style.css'
import withStyles from '../../withStyle'

class NotFound extends Component {

  render () {
    return (
      <div className={ styles.page }>
        <h2>404</h2>
        <p className={ styles.text }>page not found !!!</p>
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

export default withStyles(NotFound, styles)
