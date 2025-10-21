import {Navigate} from "react-router-dom";
import { getToken } from '../helper/SessionHelper';

const PrivateRoute = ({children}: {children: React.ReactNode}) => {
    if(getToken()){
        return children;
    }else{
        return <Navigate to="/auth/signin" replace/>
    }
};

export default PrivateRoute;