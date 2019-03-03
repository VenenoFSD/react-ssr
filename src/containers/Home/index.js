import React, { Component } from 'react'
import { connect } from 'react-redux'
import { actions } from './store'
import styles from './style.css'

class Home extends Component {

  render () {
    return (
      <div>
        {/* css 模块化，可按此形式引入 */}
        <h2 className={ styles.test }>Home</h2>
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

  componentWillMount () {
    //  服务器端渲染时
    this.props.staticContext && (this.props.staticContext.css = styles._getCss());
  }

  getList () {
    const { list } = this.props;
    return list.map(item => <li key={ item.id }>{ item.content }</li>);
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
