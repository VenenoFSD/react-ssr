import * as constants from './constants'

const getChangeListAction = list => ({
  type: constants.CHANGE_HOME_LIST,
  list
});

export const getHomeList = () => {

  // axios 请求 /api/hot
  // 在浏览器端相当于请求 localhost:3000/api/host
  // 在服务器端相当于请求 服务器根目录/api/hot
  // 通过在创建 store 时传递不同的 axiosInstance 来实现

  return (dispatch, getState, axiosInstance) => {
    // 请求本地服务器
    return axiosInstance.get('/list').then(({ data: { list } }) => {
      dispatch(getChangeListAction(list));
    });
  }
};
