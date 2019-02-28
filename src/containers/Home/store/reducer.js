import * as constants from './constants'

const defaultState = {
  singerList: []
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.CHANGE_HOME_LIST:
      return {
        ...state,
        singerList: action.list
      };
    default:
      return state;
  }
}
