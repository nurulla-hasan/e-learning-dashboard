import {Navigate} from "react-router-dom";
import { getToken } from '../helper/SessionHelper';
import React from "react";

const PublicRoute = ({children}: {children: React.ReactNode}) => {

    if(getToken() ){
        return <Navigate to="/" replace/>;
    }else{
        return children;
    }

};

export default PublicRoute;