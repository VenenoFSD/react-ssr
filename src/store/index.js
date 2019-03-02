import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { reducer as homeReducer } from '../containers/Home/store'
import { reducer as headerReducer } from '../components/Header/store'
import { reducer as animateReducer } from '../containers/Animate/store'
import clientAxios from '../client/request'
import serverAxios from '../server/request'

const reducer = combineReducers({
  home: homeReducer,
  header: headerReducer,
  animate: animateReducer
});

// 通过 thunk.withExtraArgument 传递 axios 配置
export const getStore = () => createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios)));

export const getClientStore = () => {
  const defaultState = window.context.state;
  return createStore(reducer, defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)));
};
