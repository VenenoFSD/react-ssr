import React, { Component } from 'react'
import { connect } from 'react-redux'
import { actions } from './store'
import { Redirect } from 'react-router-dom'

class Animate extends Component {

  render () {
    return this.props.login ? (
      <div>
        <h2>Animate</h2>
        { this.getList() }
      </div>
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
    return list.map(item => <li key={ item.id }>{ item.title }</li>);
  }

}

Animate.loadData = store => {
  return store.dispatch(actions.getAnimateList());
};

const mapStateToProps = state => ({
  list: state.animate.animateList,
  login: state.header.login
});
const mapDispatchToProps = dispatch => ({
  getAnimateList () {
    dispatch(actions.getAnimateList());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Animate)
