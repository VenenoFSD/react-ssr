import React, { Component } from 'react'
import Header from '../../components/Header'
import { connect } from 'react-redux'
import { actions } from './store'

class Home extends Component {

  getList () {
    const { list } = this.props;
    return list.map(item => <li key={ item.n }>{ item.k }</li>);
  }

  render () {
    return (
      <div>
        <Header/>
        <h2>Home</h2>
        <button onClick={ () => { alert('hello') } }>Click</button>
        <ul>{ this.getList() }</ul>
      </div>
    )
  }

  componentDidMount () {
    if (!this.props.list.length) { // 服务端已渲染则不必再请求
      this.props.getHomeList();
    }
  }

}

// 通过 Router 配置，服务端渲染前会先调用此方法
// 可通过此方法异步获取数据
Home.loadData = store => {
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
