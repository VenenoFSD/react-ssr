# React 服务器端渲染项目小记

## 目录结构设计

- `/build`：服务器端打包文件出口
- `/public`：客户端打包文件出口，`favicon.ico`
- `/src/client`：客户端根组件
- `/src/server`：服务器端请求处理
- `/src/containers`：页面组件
- `/src/components`：通用组件
- `/src/store`：全局 `redux` 配置
- `/src/Routes.js`：路由配置
- `webpack.base.js`：`webpack` 通用配置
- `webpack.client.js`：客户端 `webpack` 配置
- `webpack.server.js`：服务器端 `webpack` 配置

## 搭建 Webpack 环境

### 基本流程

1. 打包服务器端代码到 `/build/bundle.js` （实时监听文件变化）
2. 打包客户端代码到 `/public/index.js` （实时监听文件变化）
3. 服务器端执行 `/build/bundle.js`。用户访问时，服务器端返回一个 `html` ，`html` 的 `script` 标签引入了 `/public/index.js` ，因此在浏览器会执行 `index.js`。

### 同构

如果页面只在服务器端渲染，由于服务器返回的是 **字符串** ,因此DOM元素绑定的事件不会生效，需要在客户端再执行一次代码。

同构指的是把页面的展示内容和交互写在一起，让代码执行两次。在服务器端执行一次，用于实现服务器端渲染，在客户端再执行一次，用于接管页面交互。

**SSR** 渲染如下图所示：

![avatar](https://www.veneno.ink/wp-content/uploads/2019/03/1.png)
 
### webpack.server.js 核心代码

```javascript
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const config = require('./webpack.base');

const serverConfig = {
  target: 'node', // 构建目标为 node，在服务器端不需要将 require 的包打包
  externals: [nodeExternals()] // webpack-node-externals 作用：遇到 require node 包时，不会打包该 node 包，依旧保留 require 语句
};

// 合并配置
module.exports = merge(config, serverConfig);
```

### package.json 核心代码

```javascript
{
  "scripts": {
    "dev": "npm-run-all -p dev-**", // 并行执行以 dev- 开头的指令
    "dev-start": "nodemon --watch build --exec node \"./build/bundle.js\"",
    "dev-build-server": "webpack --config webpack.server.js --watch",
    "dev-build-client": "webpack --config webpack.client.js --watch"
  },
  "devDependencies": {
    "@babel/core": "^7.3.4",
    "@babel/preset-env": "^7.3.4",
    "@babel/preset-react": "^7.0.0",
    "babel-loader": "^8.0.5",
    "npm-run-all": "^4.1.5", // 并行执行多条 webpack 命令
    "webpack": "^4.29.5",
    "webpack-cli": "^3.2.3",
    "webpack-merge": "^4.2.1", // 合并 webpack 配置
    "webpack-node-externals": "^1.7.2" // 安装外部扩展
  }
}
```

## 同构的简单实现

**简述**：服务器端和客户端都分别将 `Home` 组件渲染到页面上

### 服务器端

```jsx harmony
// /server/index.js

import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import Home from '/containers/Home'

const app = express();

// 使用 express 中间件 static
// 当页面请求静态文件时，会到 public 目录下寻找
app.use(express.static('public'));

// 不同于客户端使用 ReactDom.render() 来渲染组件
// 服务器端需要通过 ReactDOMServer.renderToString() 来渲染组件
// ReactDOMServer.renderToString 会将组件（虚拟DOM）渲染成为字符串
const content = renderToString(<Home/>);

app.get('/', (req, res) => res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>ssr</title>
    </head>
    <body>
      <div id="root">${content}</div>
    </body>
    <script src="/index.js"></script>
  </html>
`));

app.listen(3000, () => console.log('app listening on port 3000...'));
```

### 客户端

```jsx harmony
// /client/index.js

import React from 'react'
import ReactDom from 'react-dom'
import Home from '/containers/Home'

// 如果是 CSR 客户端渲染使用 render
// 但如果是 SSR 客户端渲染必须使用 hydrate，从 React17 开始，将废弃 render 在 SSR 中使用
// 使用此方法时要注意避免服务器端和客户端上渲染内容不一致
ReactDom.hydrate(<Home/>, document.getElementById('root'));
```

## 同构：引入路由

### 路由配置

```jsx harmony
// /Routes.js

import React from 'react'
import { Route } from 'react-router-dom'
import Home from '/containers/Home'
import Login from '/containers/Login'

export default (
  <div>
    <Route path='/' exact component={ Home }/>
    <Route path='/login' exact component={ Login }/>
  </div>
)
```

### 服务端改写：引入路由

- `/server` 目录结构改动：拆分出 `util.js` ，负责渲染服务器端要返回的字符串

```jsx harmony
// /server/util.js

import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import routes from '/Routes'

// 服务器端渲染中，需要使用 StaticRouter 来代替 BrowserRouter
// StaticRouter 属性 location：服务器收到的 URL 请求
// StaticRouter 属性 context：记录渲染结果的纯JavaScript对象

export const render = req => {
  const content = renderToString((
    <StaticRouter context={{}} location={ req.path }>
      { routes }
    </StaticRouter>
  ));
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>ssr</title>
      </head>
      <body>
        <div id="root">${content}</div>
      </body>
      <script src="/index.js"></script>
    </html>
  `;
};
```

- `/server/index.js` 负责处理用户请求：

```javascript
// /server/index.js
   // 省略未改动部分代码...
   
   import { render } from '/server/util'
   
   // 无论请求什么路径都走这里
   // 由 react-router-dom 负责处理不同路由
   app.get('*', (req, res) => {
     res.send(render(req));
   });
```

### 客户端改写：引入路由

```jsx harmony
// /client/index.js
// 省略未改动部分代码...

import { BrowserRouter } from 'react-router-dom'
import routes from '/Routes'

const App = () => (
  <BrowserRouter>
    { routes }
  </BrowserRouter>
);

ReactDom.hydrate(<App/>, document.getElementById('root'));
```

- 页面可引入 `<Link>` 测试路由，不具体演示

## 同构：引入 redux

需求：首页（`Home` 组件）渲染时异步请求数据并存入 `store` ，再根据 `store` 内容渲染出来

### 配置全局 store

```javascript
// /store/index.js

import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { reducer as homeReducer } from '/containers/Home/store'

// 合并局部 reducer 到全局 reducer
const reducer = combineReducers({
  home: homeReducer
});

// 导出创建 store 的方法而不是直接导出 store
// 这样保证每次打开页面都会创建一个新的 store
export const getStore = () => createStore(reducer, applyMiddleware(thunk));

// 此处导出一个客户端专用的初始化 store 的方法
// 为了避免服务器端请求数据并填充 store 后客户端又执行一次
// 此处客户端创建 store 时以 window.context.state 作为默认值
// 若其中有值则说明服务器端已请求完数据，将其作为默认值
export const getClientStore = () => {
  const defaultState = window.context.state;
  return createStore(reducer, defaultState, applyMiddleware(thunk));
};
```

### 配置 Home 组件（局部）store

#### 目录结构设计

1. `/Home/store/actions.js`：创建 action
2. `/Home/store/constants.js`：定义 actionTypes 常量
3. `/Home/store/reducer.js`：定义 reducer
4. `/Home/store/index.js`：局部 store 出口

#### Home 组件 actions.js 代码

```javascript
// /containers/Home/store/actions.js

import axios from 'axios'
import * as constants from './constants'

const getChangeListAction = list => ({
  type: constants.CHANGE_HOME_LIST,
  list
});

export const getHomeList = () => {
  return dispatch => {
    // 此处返回 Promise
    return axios.get('http://localhost:1201/search/hot').then(({ data: { data: { hotkey } } }) => {
      dispatch(getChangeListAction(hotkey));
    });
  }
};
```

### React Router - Server Rendering

由于在服务器端渲染的时候，不会执行 `ComponentDidMount` ，因此在做 SSR 时，需要通过 `react-router` 提供的 `Server Rendering` 方案来解决

- 使用该方案，首先需要改写全局路由配置：
```javascript
// /Routes.js

// 不再引入 Route 导出 jsx，而是导出一个数组个，数组每一项就是不同的路由
// 关键点在于每一项路由的 loadData 属性，配置该项并指向一个函数，则服务器端渲染前会先调用该函数
// 此处配置 loadData: Home.loadData，相当于在 Home 组件渲染前，会先执行 Home.loadData
// 可以通过这个方法来代替无法被调用的 ComponentDidMount 来异步获取数据
// 由于数组每一项需要循环展示，因此要加上 key 值
export default [
  {
    path: '/',
    component: Home,
    exact: true,
    key: 'Home',
    loadData: Home.loadData
  },
  {
    path: '/login',
    component: Login,
    exact: true,
    key: 'login'
  }
]
```

- 其次，Home 组件编写 `loadData` 和 `ComponentDidMount` 分别对应 **服务器端** 和 **客户端** 在 `action` 异步请求数据的操作

```jsx harmony
// /containers/Home/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { actions } from '/store'

class Home extends Component {

  getList () {
    const { list } = this.props;
    return list.map(item => <li key={ item.n }>{ item.k }</li>);
  }

  render () {
    return (
      <div>
        <ul>{ this.getList() }</ul>
      </div>
    )
  }

  // 客户端渲染时通过生命周期函数异步获取数据
  componentDidMount () {
     // 服务端已渲染则不必再请求
    if (!this.props.list.length) {
      this.props.getHomeList();
    }
  }

}

// 通过 Router 配置，服务端渲染前会先调用此方法
// 服务端通过此方法异步获取数据
Home.loadData = store => {
  // 取到 action 返回的 Promise 并返回
  return store.dispatch(actions.getHomeList());
};

const mapStateToProps = state => ({
  list: state.home.singerList
});
const mapDispatchToProps = dispatch => ({
  getHomeList () {
    dispatch(actions.getHomeList());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home)
```

- 由于全局路由配置已经修改，则在服务器端和客户端的根组件导入路由处需要做相应修改。此处官方建议通过 `React Router Config` 实现更高级内容（例如支持多级路由）

服务器端修改如下：

```jsx harmony
// /server/index.js
// 省略未改动部分代码...

import { matchRoutes } from 'react-router-config'
import { getStore } from '/store'
import routes from '/Routes'

app.get('*', (req, res) => {

  const store = getStore();
  
  // matchedRoutes 是一个数组，匹配到路由就存放进来
  const matchedRoutes = matchRoutes(routes, req.path);
  
  // 存放所有 Promise
  const promises = [];

  // matchedRoutes 中的组件的 loadData 都要执行一次
  matchedRoutes.forEach(item => {
    if (item.route.loadData) {
      // 调用 Home 组件中的 loadData 方法取到返回的 Promise
      // 将每一个 Promise 存入数组
      promises.push(item.route.loadData(store));
    }
  });
  
  // 等待所有异步操作完成后再渲染
  Promise.all(promises).then(() => {
    res.send(render(req, store, routes));
  });

});
```

```jsx harmony
// /server/util.js
// 省略未改动部分代码...

import { StaticRouter } from 'react-router-dom'
import routes from '/Routes'

export const render = (req, store, routes) => {
  
  // 由于导出的 route 是一个数组，需要将其展开，将每一项的属性作为 <Route /> 的属性
  const content = renderToString((
    <Provider store={ store }>
      <StaticRouter context={{}} location={ req.path }>
        <div>
          {
            routes.map(route => (
              <Route {...route} />
            ))
          }
        </div>
      </StaticRouter>
    </Provider>
  ));

  // 服务端渲染时已请求完数据并存入 store 时
  // 客户端就没有必要再初始化 store 再请求数据
  // 因此此处服务端渲染时已填充数据的 store 放到 window.context
  // 客户端渲染时将 window.context 作为初始化 store 的默认值，若 store 已经有值，则不再请求

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>ssr</title>
      </head>
      <body>
        <div id="root">${content}</div>
      </body>
      <script>
        window.context = {
          state: ${JSON.stringify(store.getState())}
        }
      </script>
      <script src="/index.js"></script>
    </html>      
  `;
};
```

客户端修改如下：

```jsx harmony
// /client/index.js
// 省略未改动部分代码...

import { BrowserRouter, Route } from 'react-router-dom'
import routes from '/Routes'
import { Provider } from 'react-redux'
import { getClientStore } from '/store'

const App = () => (
  <Provider store={ getClientStore() }>
    <BrowserRouter>
      <div>
        {
          routes.map(route => (
            <Route {...route} />
          ))
        }
      </div>
    </BrowserRouter>
  </Provider>
);
```

## node 当担中间层：代理转发客户端请求

**React SSR** 整体结构如下图所示：

![avatar](https://www.veneno.ink/wp-content/uploads/2019/03/1.jpg)

**node** 在其中担任**中间层**的角色，如果客户端要向远程服务器发送请求，需要通过中间层进行代理转发

### Node Server 代理转发

在项目中使用了 `express-http-proxy` 来实现 **Node Server** 的代理转发。后端代码作如下修改：

```javascript
// /server/index.js
// 省略未改动部分代码...

import proxy from 'express-http-proxy'

// 请求代理转发
// 客户端请求本地服务器，即请求 localhost:3000/api/* 时
// 代理转发到  localhost:1201/*
app.use('/api', proxy('localhost:1201', {
  proxyReqPathResolver: req => {
    return req.url;
  }
}));

// app.get('*', ...)
```

由于代理转发针对的只是客户端渲染，服务器端渲染依然请求远程服务器，所以要对客户端和服务器端分别进行 `axios` 配置

服务器端：

```javascript
// /server/request.js

import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:1201'
});

export default instance
```

客户端：

```javascript
// /client/request.js

import axios from 'axios'

const instance = axios.create({
  baseURL: '/'
});

export default instance
```

配置好 `axios instance` 后通过 `redux-thunk` 的 `withExtraArgument` 传递给 `actions.js` ：

```javascript
// /store/index.js
// 省略未改动部分代码...

import clientAxios from '/client/request'
import serverAxios from '/server/request'

// 通过 thunk.withExtraArgument 传递 axios 配置
export const getStore = () => createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios)));

export const getClientStore = () => {
  const defaultState = window.context.state;
  return createStore(reducer, defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)));
};
```

`action` 会在第三个参数拿到 `axiosInstance`：

```javascript
// /containers/Home/store/actions.js
// 省略未改动部分代码...

export const getHomeList = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/list').then(({ data: { list } }) => {
      dispatch(getChangeListAction(list));
    });
  }
};
```

### renderRoutes 实现多级路由

`react-router-config` 提供了 `renderRoutes` api 来实现多级路由

- 项目结构调整：根目录 `App.js` 作为根组件，配置 `routes` ：

```javascript
// /Routes.js

export default [
  {
    // App 组件一定会渲染
    path: '/',
    loadData: App.loadData,
    routes: [
      {
        path: '/',
        component: Home,
        exact: true,
        key: 'Home',
        loadData: Home.loadData
      },
      {
        path: '/animate',
        component: Animate,
        exact: true,
        key: 'animate',
        loadData: Animate.loadData
      }
    ]
  }
]
```

- `App.js` 使用 `renderRoutes` 渲染**二级路由**

```jsx harmony
// /App.js

import React from 'react'
import Header from '/components/Header'
import { renderRoutes } from 'react-router-config'
import { actions } from '/components/Header/store'

// route 会通过 props 传递
// props.route.routes：此处要渲染的是二级路由
const App = props => {
  return (
    <div>
      <Header/>
      { renderRoutes(props.route.routes) }
    </div>
  )
};

export default App
```

- 由于 `routes` 不再是一个简单的数组，在服务器端和客户端不能简单的通过 `map` 来循环，而是使用 `renderRoutes`

服务器端：（客户端改动与服务器端一致）

```jsx harmony
// /server/util.js
// 省略未改动部分代码...

import { renderRoutes } from 'react-router-config'

export const render = (req, store, routes) => {
  const content = renderToString((
    <Provider store={ store }>
      <StaticRouter context={{}} location={ req.path }>
        <div>{ renderRoutes(routes) }</div>
      </StaticRouter>
    </Provider>
  ));
};
```

### 引入登录模块

- 打开网页时网页就自动发送请求检查登录状态，这步操作需要在服务器端渲染时完成；而登录，退出登录则由客户端来完成。

```javascript
// /App.js
// 省略未改动部分代码...

// 获取登录状态只需要在服务器端完成
App.loadData = store => {
  return store.dispatch(actions.getLoginStatus());
};
```

- 客户端执行登录，退出登录操作较为简单，此处不再赘述
