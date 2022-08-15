import React, { useState} from 'react';
import { Form, Input, Button, notification} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons"
import { sigInApi } from "../../api/user";
import { ACCESS_TOKEN, REFRESH_TOKEN} from "../../utils/constant";

import "./LoginForm.scss";

export default function LoginForm() {
    const [inputs, setInputs] = useState({
        user: "",
        password: ""
    });

    const ChangeForm = e => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    };

    
    const login = async e => {
        
        const result = await sigInApi(inputs);
        if(result.message){
            notification["error"]({
                message: result.message
            });
        }else {
            const {accessToken, refreshToken} = result;
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            localStorage.setItem(REFRESH_TOKEN,refreshToken);
            notification["success"]({
                message: "Login correcto."
            });

            window.location.href ="/admin";
        }
        
    };
    


  return (
    <Form className="login-form" onChange={ChangeForm} onFinish={login}>
        <Form.Item>
            <Input
            prefix={<UserOutlined style={{color: "rgba(0,0,0,.25)"}}/>}
            type="text"
            name="user"
            placeholder="Correo electronico/ Usuario"
            className="login-form-input"
            />
        </Form.Item>
        <Form.Item>
        <Input
            prefix={<LockOutlined style={{color: "rgba(0,0,0, .25)"}}/>}
            type="password"
            name="password"
            placeholder="Escriba su clave"
            className="login-form-input"
            />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" className="login-form-button">Entrar</Button>
        </Form.Item>
    </Form>
  );
}
