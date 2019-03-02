// 公用组件提取到这里
import React from 'react'
import Header from './components/Header'
import { renderRoutes } from 'react-router-config'
import { actions } from './components/Header/store'

// routes 通过 props.route 传递
const App = props => {
  return (
    <div>
      <Header/>
      { renderRoutes(props.route.routes) }
    </div>
  )
};

// 获取登录状态只需要在服务器端完成
App.loadData = store => {
  return store.dispatch(actions.getLoginStatus());
};

export default App
