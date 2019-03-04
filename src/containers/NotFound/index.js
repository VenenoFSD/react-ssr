import React, { Component, Fragment } from 'react'
import { Helmet } from 'react-helmet'
import styles from './style.css'
import withStyles from '../../withStyle'

class NotFound extends Component {

  render () {
    return (
      <Fragment>
        <Helmet>
          <title>出错啦 - 您要找的页面不存在！</title>
          <meta name="description" content="出错啦 - 您要找的页面不存在！"/>
        </Helmet>
        <div className={ styles.page }>
          <h2>404</h2>
          <p className={ styles.text }>page not found !!!</p>
        </div>
      </Fragment>
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
