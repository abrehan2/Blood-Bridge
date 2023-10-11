export const BASE = "http://localhost:5000/api/";

export const registerUserUrl = () => {
  return encodeURI(`auth/user/register`);
};

export const registerBloodBankUrl = () => {
  return encodeURI(`auth/bloodBank/register`);
};