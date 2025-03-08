import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ROUTES } from "@constants/route";
import PrivateRoute from "./Auth/PrivateProute";
import PersistToken from "./Auth/PersistToken";
import PerfumeLogin from "@pages/Auth/LoginPage";
import HomePage from "@pages/HomePage";
import DetailProductPage from "@pages/DetailProductPage";
import CategoryPage from "@pages/Category";
import RegisterPage from "@pages/Auth/RegisterPage";
import NotFoundPage from "@pages/NotFound";
import MainLayout from "@layouts/Main";
import ProfilePage from "@pages/ProfilePage";
import AdminPerfumePage from "@pages/Admin/Perfumes";
import AdminBrandPage from "@pages/Admin/Brands";
import AdminMemberPage from "@pages/Admin/Members";

const RouterComponent = () => {
    const router = createBrowserRouter([
        //#region All routes
        { path: ROUTES.PUBLIC.NOT_FOUND, element: <NotFoundPage /> },
        //#endregion

        //#region Auth routes
        { path: ROUTES.AUTH.LOGIN, element: <PerfumeLogin /> },
        { path: ROUTES.AUTH.REGISTER, element: <RegisterPage /> },
        // { path: ROUTES.AUTH, element: <Logout /> },
        // { path: ROUTES.AUTH, element: <ValidateEmail /> },
        // { path: ROUTES.AUTH, element: <ForgetPassword /> },
        // { path: ROUTES.AUTH, element: <UnauthorizedPage /> },
        //#endregion

        //#region Public routes
        {
            path: ROUTES.PUBLIC.HOME,
            element: <MainLayout />,
            children: [
                { index: true, path: ROUTES.PUBLIC.HOME, element: <HomePage /> },
                { path: ROUTES.PUBLIC.DETAILPRODUCT, element: <DetailProductPage /> },
                { path: ROUTES.PUBLIC.PROFILE, element: <ProfilePage /> },
            ],
        },
        { path: ROUTES.PUBLIC.CATEGORY, element: <CategoryPage /> },
        //#endregion

        //#region Private routes
        {
            element: <PersistToken />,
            children: [
                //#region Admin routes
                {
                    element: <PrivateRoute />,
                    children: [
                        { path: ROUTES.ADMIN.PERFUMES, element: <AdminPerfumePage /> },
                        { path: ROUTES.ADMIN.BRANDS, element: <AdminBrandPage /> },
                        { path: ROUTES.ADMIN.COLLECTORS, element: <AdminMemberPage /> }
                    ],
                },
                //#endregion

                //#region Member routes
                {
                    element: <PrivateRoute />,
                    children: [
                    ],
                },
                //#endregion
            ],
        }
        //#endregion
    ]);

    return <RouterProvider router={router} />;
}

export default RouterComponent;