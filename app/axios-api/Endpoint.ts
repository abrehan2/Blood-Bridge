export const BASE = "http://localhost:5000/api/";

export const registerUserUrl = () => {
  return encodeURI(`auth/user/register`);
};

export const loginUserUrl = () => {
  return encodeURI(`auth/user/login`);
};

export const logOutUserUrl = () => {
  return encodeURI(`auth/user/logout`);
};

export const getUserDetailsUrl = () => {
  return encodeURI(`user/me`);
};

export const userForgotPasswordUrl = () => {
  return encodeURI(`auth/user/forgot`);
};

export const userUpdateDetailsUrl = () => {
  return encodeURI(`user/me/update`);
};

export const userUpdatePasswordUrl = () => {
  return encodeURI(`user/password/update`);
};

export const registerBloodBankUrl = () => {
  return encodeURI(`auth/bloodBank/register`);
};

export const loginBloodBankUrl = () => {
  return encodeURI(`auth/bloodBank/login`);
};

export const bloodBankForgotPasswordUrl = () => {
  return encodeURI(`auth/bloodBank/forgot`);
};

export const getBloodBankDetailsUrl = () => {
  return encodeURI(`bloodBank/me`);
};

export const bloodBankUpdateDetailsUrl = () => {
  return encodeURI(`bloodBank/me/update`);
};

export const bloodBankUpdatePasswordUrl = () => {
  return encodeURI(`bloodBank/password/update`);
};

export const BBProfileCompleteUrl = () => {
  return encodeURI(`bloodBank/profileCompletion`);
};

export const deactivateBloodBankUrl = () => {
  return encodeURI(`bloodBank/deactivate`);
};