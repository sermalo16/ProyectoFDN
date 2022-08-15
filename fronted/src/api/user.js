import { basePath, apiVersion} from "./config";

export function SignUpApi(data){
    const url = `${basePath}/${apiVersion}/sign-up`;
    const params = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    };

return fetch(url, params).then(response => {
        return response.json();
    }).then(result => {
        if(result.user){
            return {
                ok: true,
                message: "Usuario creado correctamente"
            };
        } else {
            return {
                ok: false,
                message: result.message
            };
        }
        
    }).catch(err => {
        return {
            ok: false,
            message: err.message + "catch"
        };
    })
}

export function sigInApi(data){
    const url = `${basePath}/${apiVersion}/users/sign-in`;
    const params = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }

    return fetch(url, params).then(response => {
        return response.json();
    }).then(result => {
        return result;
    }).catch(err => {
        return err.message;
    })
}

export function getUserApi(token){
    const url = `${basePath}/${apiVersion}/users`;
    const params = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        }
    };

    return fetch(url, params).then(response => {
        return response.json();
    }).then(result => {
        return result;
    }).catch(err => {
        return err.message;
    })
}