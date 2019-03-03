import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actions } from './store'
import styles from './style.css'
import withStyle from '../../withStyle'

class Header extends Component {
  render () {
    const { login, handleLogin, handleLogout } = this.props;
    return (
      <div className={ styles.header }>
        <div>
          <Link to='/' className={ styles.nav }>首页</Link>
          { login ? <Link to='/animate' className={ styles.nav }>番剧</Link> : null }
        </div>
        {
          login ?
          <div onClick={ handleLogout } className={ styles.btn }>退出</div> :
          <div onClick={ handleLogin } className={ styles.btn }>登录</div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  login: state.header.login
});
const mapDispatchToProps = dispatch => ({
  handleLogin () { // onClick 绑定的函数，因此只在客户端执行
    dispatch(actions.login());
  },
  handleLogout () { // onClick 绑定的函数，因此只在客户端执行
    dispatch(actions.logout());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyle(Header, styles))
