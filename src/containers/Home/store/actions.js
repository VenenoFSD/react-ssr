import axios from 'axios'
import * as constants from './constants'

const getChangeListAction = list => ({
  type: constants.CHANGE_HOME_LIST,
  list
});

export const getHomeList = () => {
  return dispatch => {
    return axios.get('http://localhost:1201/search/hot').then(({ data: { data: { hotkey } } }) => {
      dispatch(getChangeListAction(hotkey));
    });
  }
};
