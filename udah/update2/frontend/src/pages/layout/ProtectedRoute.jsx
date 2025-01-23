import { Navigate, useLoaderData } from "react-router-dom";
import ErrorPage from "../ErrorPage";

const ProtectedRoute = ({ element, requiredRole }) => {
    const loaderData = useLoaderData();

    if (!loaderData || !loaderData.user) {
        // User data is missing
        return <ErrorPage errorCode={401} message="kon belum login cuk!" />;
    }

    const { username, role } = loaderData.user;

    if (!username || ![1, 2].includes(role)) {
        // Invalid or missing user data
        return <ErrorPage errorCode={401} message="kon belum login cuk!" />;
    }

    if (role !== requiredRole) {
        // User role does not match
        return <ErrorPage errorCode={403} message="Anda siapa?" />;
    }

    return element;
};

export default ProtectedRoute;