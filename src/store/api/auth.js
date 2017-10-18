import { apiPost, apiGet } from "~/store/api/common";

import i18n from "~/i18n";

export default {
  /**
  * Logs a user in, returning a promise with `true` when done
  * @param  {string} token The token of the user  
  */
  loginFacebook(accessToken) {
    // Post request to server
    return apiPost(`/oauth/facebook/token?access_token=${accessToken}`);
  },

  loginGoogle(accessToken) {
    // Post request to server
    return apiPost(`/oauth/google/token?access_token=${accessToken}`);
  },

  login(email, password) {
    return apiPost("/customer/login", {
      email,
      password,
      lang: i18n.language
    });
  },

  signup(email, password, name, address_name, address) {
    return apiPost("/customer/signup", {
      email,
      password,
      name,
      address_name,
      address,
      lang: i18n.language
    });
  },

  refreshAccessToken(refreshToken) {
    return apiPost(`/auth/token`, { refreshToken });
  },

  updateAccount(token, data) {
    return apiPost(token, `/auth/update`, data);
  },

  /**
  * Logs the current user out
  */
  logout() {
    return apiPost("/auth/logout");
  },

  updateCustomer(token, customer_uuid, name, phone) {
    return apiPost('/customer', {
      token,
      customer_uuid,
      name,
      phone,
      lang: i18n.language
    }, 'PUT');
  },

  addAddress(token, customer_uuid, name, address) {
    return apiPost('/customer/address', {
      token,
      customer_uuid,
      name,
      address,
      lang: i18n.language
    });
  },

  updateAddress(token, cus_address_uuid, name, address){
    return apiPost('/customer/address', {
      token,
      cus_address_uuid,
      name,
      address,
      lang: i18n.language
    }, 'PUT');
  },
};