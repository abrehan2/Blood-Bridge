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

export const getUserLocationUrl = () => {
  return encodeURI(`user/location`);
};

export const getAllBloodBanksUrl = () => {
  return encodeURI(`user/bloodBanks/all`);
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

export const viewSpecificBloodBank = () => {
  return encodeURI(`user/bloodBank/`);
};

export const requestBloodUrl = () => {
  return encodeURI(`bloodBank/blood/request`);
};

export const donateBloodUrl = () => {
  return encodeURI(`bloodBank/blood/donation`);
};

export const addBloodGroup = () => {
  return encodeURI(`bloodBank/bloodType/new`);
};

export const BBgetAllBloodRequestes = () => {
  return encodeURI(`bloodBank/blood/request/all`);
};

export const BBUpdateRequestStatus = () => {
  return encodeURI(`bloodBank/blood/request/`);
};

export const BBgetAllBloodDonations = () => {
  return encodeURI(`bloodBank/blood/donation/all`);
};

export const BBUpdateDonationStatus = () => {
  return encodeURI(`bloodBank/blood/donation/`);
};
