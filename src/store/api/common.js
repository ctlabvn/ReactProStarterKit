import "isomorphic-fetch";

// default api_base for all request
import { API_BASE, API_SECRET_KEY } from "~/store/constants/api";

import i18n from "~/i18n";

export const rejectErrors = res => {
  const { status } = res;
  if (status >= 200 && status < 300) {
    return res;
  }
  // we can get message from Promise but no need, just use statusText instead of
  // server return errors
  return Promise.reject({ message: res.statusText, status });
};

// try invoke callback for refresh token here
export const fetchJson = (url, options = {}, base = API_BASE) => {
  // in the same server, API_BASE is emtpy
  // check convenient way of passing base directly
  // without Accept and Content-Type it will not call options
  return (
    fetch(/^(?:https?)?:\/\//.test(url) ? url : base + url, options)
      .then(rejectErrors)
      // default return empty json when no content
      .then(res => res.text())
      .then(text => {
        try {
          return JSON.parse(text);
        } catch (e) {
          return text;
        }
      })
  );
};

export const fetchJsonWithToken = (token, url, options = {}, ...args) => {
  return fetchJson(
    url,
    {
      ...options,
      headers: {
        ...options.header,
        Authorization: `Bearer ${token.accessToken || token}`
      }
    },
    ...args
  );
};

// const getExtendData = data => ({ ...data, lang: i18n.language });

// default is get method, we can override header with method:PUT for sample
export const apiCall = (url, options, token = null) =>
  token ? fetchJsonWithToken(token, url, options) : fetchJson(url, options);

// must have data to post, put should not return data
export const apiPost = (url, data, token, method = "POST", options) => {
  // const dataPost = getExtendData(data);
  return apiCall(
    url + "?secret_key=" + API_SECRET_KEY,
    {
      ...options,
      method,
      body: JSON.stringify(data),
      headers: {
        ...options.headers,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    },
    token
  );
};

// should have data to get, delete should not return
export const apiGet = (url, data, token, method = "GET", options) => {
  // const dataGet = getExtendData(data);
  return apiCall(
    `${url}?secret_key=${API_SECRET_KEY}` +
      (data
        ? "&" +
          Object.keys(data)
            .map(key => `${key}=${encodeURIComponent(data[key])}`)
            .join("&")
        : ""),
    { method, ...options },
    token
  );
};