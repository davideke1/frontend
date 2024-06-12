// actions.js
export const SET_IS_LOGGED_IN = 'SET_IS_LOGGED_IN';

export const setIsLoggedIn = (isLoggedIn) => ({
  type: SET_IS_LOGGED_IN,
  payload: isLoggedIn,
});
