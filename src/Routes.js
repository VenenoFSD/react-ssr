import React from 'react'
import App from './App'
import Home from './containers/Home'
import Animate from './containers/Animate'
import NotFound from './containers/NotFound'

export default [
  {
    path: '/',
    component: App,
    key: 'app',
    loadData: App.loadData,
    routes: [
      {
        path: '/',
        component: Home,
        exact: true,
        key: 'home',
        loadData: Home.loadData
      },
      {
        path: '/animate',
        component: Animate,
        exact: true,
        key: 'animate',
        loadData: Animate.loadData
      },
      {
        component: NotFound,
        key: 'notFound'
      }
    ]
  }
]
