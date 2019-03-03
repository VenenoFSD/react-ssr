import React, { Component } from 'react'
import { connect } from 'react-redux'
import { actions } from './store'
import styles from '../common.css'
import withStyle from '../../withStyle'

class Home extends Component {

  render () {
    return (
      <div className={ styles.page }>
        {/* css 模块化，可按此形式引入 */}
        <h2 className={ styles.title }>动画视频排行</h2>
        <ul>{ this.getList() }</ul>
      </div>
    )
  }

  componentDidMount () {
    if (!this.props.list.length) { // 服务端已渲染则不必再请求
      this.props.getHomeList();
    }
  }

  getList () {
    const { list } = this.props;
    return list.map(item => <li key={ item.id } className={ styles.item }>{ item.content }</li>);
  }

}

const mapStateToProps = state => ({
  list: state.home.singerList
});
const mapDispatchToProps = dispatch => ({
  getHomeList () {
    dispatch(actions.getHomeList());
  }
});

const ExportHome = connect(mapStateToProps, mapDispatchToProps)(withStyle(Home, styles));

// 通过 Router 配置，服务端渲染前会先调用此方法
// 可通过此方法异步获取数据
// 由于 Home 组件会传入 connect 方法返回新组件，为安全起见，将 loadData 挂载到新生成的组件
ExportHome.loadData = store => {
  return store.dispatch(actions.getHomeList());
};

export default ExportHome
