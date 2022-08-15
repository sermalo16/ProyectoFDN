import React, { useState } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { Layout } from 'antd';

import useAuth from '../hooks/useAuth';
import MenuTop from '../components/MenuTop';
import MenuSider from '../components/MenuSider';
import AdminSignIn from "../pages/SignIn/SignIn";
import { getAccesToken, getRefreshToken } from "../api/auth";

import "./LayoutAdmin.scss";

export default function LayoutAdmin(props) {
  const {routes} = props;
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const { Header, Content, Footer} = Layout;
  const { user,isLoading } = useAuth();

  if(!user && !isLoading){
    return (
      <>
        <Route path="/admin/login" component={AdminSignIn} />
        <Redirect to="/admin/login"/>
      </>
      
    );

  }

  if(user && !isLoading){
    return (
      <Layout>
        <MenuSider menuCollapsed={menuCollapsed}/>
          {/* TO DO: Menu Sider*/}
          <Layout 
          className="layout-admin"
          //style={{marginLeft: menuCollapsed ? "80px" : "200px" }}
          >
  
              <Header className="layout-admin-header">
                {/* TO DO: Menu Top */}
                <MenuTop 
                menuCollapsed={menuCollapsed} 
                setMenuCollapsed={setMenuCollapsed}
                user={user.user}
                />
              </Header>
  
              <Content className="layout-admin-content">
                <LoadRoutes routes={routes}/>
              </Content>
  
              <Footer className="layout-admin">
                Footer: Sergio Morel 2022
              </Footer>
          </Layout>
          
      </Layout>
    );
  }

  return null;
  
  }
  


function LoadRoutes({routes}){
  return (
    <Switch>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} exact={route.exact} component={route.component} />
      ))}
    </Switch>
  );
}