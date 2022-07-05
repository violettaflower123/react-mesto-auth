export const BASE_URL = "https://auth.nomoreparties.co";

const checkRes = (response) => {
  return response.ok
    ? response.json()
    : Promise.reject(`Произошла ошибка: ${response.status}`);
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(checkRes);
};

export const login = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    }).then(checkRes);
};
