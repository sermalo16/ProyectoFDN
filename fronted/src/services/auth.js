// src/api/auth.js
import { ACCESS_TOKEN, REFRESH_TOKEN, basePath, apiVersion } from "../utils/constant";
import { jwtDecode } from "jwt-decode"; // ✅ correcto para v4



export function getAccessTokenApi(){
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if(!accessToken  || accessToken === "null"){
        return null;
    }

    return willExpireToken(accessToken) ? null : accessToken;
}

export function getRefreshTokenApi(){
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    
    if(!refreshToken  || refreshToken === "null"){
        return null;
    }

    return willExpireToken(refreshToken) ? null: refreshToken;

}


export function refreshAccessTokenApi(refreshToken){
    const url = `${basePath}/${apiVersion}/refresh-access-token`;

    const bodyObj = {
        refreshToken: refreshToken,
    };

    const params = {
        method: "POST",
        body: JSON.stringify(bodyObj),
        headers: {
            "Content-Type": "application/json"
        }
    };

    fetch(url, params).then(response => {
        if(response.status !== 200){
            return null;
        }

        return response.json();
    }).then(result => {
        if(!result){
            // TO DO: Delogear usuario
            logout();
        }else {
            const { accessToken, refreshToken} = result;
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            localStorage.setItem(REFRESH_TOKEN, refreshToken);
        }
    }).catch(err => {
        return err.message;
    })
}

export function autoLogout() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
}

export const saveToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

function willExpireToken(token){
    const seconds = 60;
    const metaToken = jwtDecode(token);
    const { exp } = metaToken;
    const now = (Date.now() + seconds) / 1000;
    return now > exp;
}