import * as constants from './constants'

const getChangeLoginAction = status => ({
  type: constants.CHANGE_LOGIN_STATUS,
  status
});

export const getLoginStatus = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/islogin').then(res => {
      dispatch(getChangeLoginAction(res.data.data.status));
    });
  }
};

export const login = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/login').then(({ data: { success } }) => {
      success && dispatch(getChangeLoginAction(true));
    });
  }
};

export const logout = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/logout').then(({ data: { success } }) => {
      success && dispatch(getChangeLoginAction(false));
    });
  }
};
