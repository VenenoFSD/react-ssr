import * as constants from './constants'

const defaultState = {
  animateList: []
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.GET_ANIMATE_LIST:
      return {
        ...state,
        animateList: action.list
      };
    default:
      return state;
  }
}
