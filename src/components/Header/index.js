import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actions } from './store'

class Header extends Component {

  render() {
    const { login, handleLogin, handleLogout } = this.props;
    return (
      <div>
        <Link to='/'>Home </Link>
        {
          login ?
            <Fragment>
              — <Link to='/animate'>列表</Link>
              <div onClick={ handleLogout }>退出登录</div>
            </Fragment> :
            <div onClick={ handleLogin }>登录</div>
        }
        <hr/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header)
