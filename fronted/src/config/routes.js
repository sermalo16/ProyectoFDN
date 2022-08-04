// Layouts
import LayoutAdmin from "../layouts/LayoutAdmin";

// Admin Pages
import AdminHome from "../pages/Admin";
import AdminSignIn from "../pages/SignIn";
//import Error404 from "../pages/Error404";

const routes = [
    {
        path: "/",
        component: LayoutAdmin,
        exact: false,
        routes: [
            {
                path: "/",
                component: AdminHome,
                exact: true
            },
            {
                path: "/login",
                component: AdminSignIn,
                exact: true
            }
        ]
    }
];

export default routes;