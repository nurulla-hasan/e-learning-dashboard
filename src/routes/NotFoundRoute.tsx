import {Navigate} from "react-router-dom";
import { getToken } from '../helper/SessionHelper';

const NotFoundRoute = () => {
    if(getToken() ){
        return <Navigate to="/" replace />;
    }else{
        return <Navigate to="/auth/signin" replace />;
    }
};

export default NotFoundRoute;