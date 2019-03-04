import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { actions } from './store'
import { Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styles from '../common.css'
import withStyle from '../../withStyle'

class Animate extends Component {

  render () {
    return this.props.login ? (
      <Fragment>
        <Helmet>
          <title>SSR番剧 - 热门番剧列表</title>
          <meta name="description" content="SSR番剧 - 热门番剧列表"/>
        </Helmet>
        <div className={ styles.page }>
          <h2 className={ styles.title }>番剧列表</h2>
          <ul>{ this.getList() }</ul>
        </div>
      </Fragment>
    ) : (
      <Redirect to='/'/>
    );
  }

  componentDidMount () {
    if (!this.props.list.length) { // 服务端已渲染则不必再请求
      this.props.getAnimateList();
    }
  }

  getList () {
    const { list } = this.props;
    return list.map(item => <li key={ item.id } className={ styles.item }>{ item.title }</li>);
  }

}

const mapStateToProps = state => ({
  list: state.animate.animateList,
  login: state.header.login
});
const mapDispatchToProps = dispatch => ({
  getAnimateList () {
    dispatch(actions.getAnimateList());
  }
});

const ExportAnimate = connect(mapStateToProps, mapDispatchToProps)(withStyle(Animate, styles));

ExportAnimate.loadData = store => {
  return store.dispatch(actions.getAnimateList());
};

export default ExportAnimate
