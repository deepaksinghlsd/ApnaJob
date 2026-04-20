import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = true }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate("/");
        } else if (adminOnly && user.role !== 'recruiter') {
            navigate("/");
        }
    }, [user, navigate, adminOnly]);

    return (
        <>
            {children}
        </>
    )
};
export default ProtectedRoute;