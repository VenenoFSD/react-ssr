import * as constants from './constants'

const defaultState = {
  login: false
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.CHANGE_LOGIN_STATUS:
      return {
        ...state,
        login: action.status
      };
    default:
      return state;
  }
}
