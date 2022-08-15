import React from 'react';
import {Layout, Tabs} from "antd";
import { Redirect} from "react-router-dom";
import Logo from "../../assets/img/png/logo-white.png";
import RegisterForm from '../../components/RegisterForm';
import LoginForm from '../../components/LoginForm';
import { getAccessTokenApi} from "../../api/auth"


import "./SignIn.scss";

export default function SignIn() {
  const { Content } = Layout;
  const { TabPane} = Tabs;

  if(getAccessTokenApi()){
    return <Redirect to={"/admin"}/>
  }

  return (
    
    <Layout className="sign-in" >
      <Content className="sign-in-content">
        <h1 className="sign-in-content-logo">
          <img src={Logo} alt="SergioMorel"/>
        </h1>

        <div className="sign-in-content-tabs">
          <Tabs type="card">

            <TabPane tab={<span>Entrar</span>} key="1">
              <LoginForm/>
            </TabPane>

            <TabPane tab={<span>Nuevo Usuaro</span>} key="2">
              <RegisterForm/>
            </TabPane>

            <TabPane tab={<span>Registrar Datos</span>} key="3">
              <h1>Proximamente</h1>
            </TabPane>

          </Tabs>
        </div>
      </Content>
    </Layout>
  )
}
