import * as constants from './constants'

const getChangeListAction = list => ({
  type: constants.GET_ANIMATE_LIST,
  list
});

export const getAnimateList = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/animate').then(({data: { data }}) => {
      dispatch(getChangeListAction(data));
    });
  }
};
