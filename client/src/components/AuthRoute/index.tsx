import React, { useContext } from "react";
import { Redirect } from "react-router";
import logging from "../../config/logging";
import UserContext from "../../contexts/user";

export interface IAuthRouteProps {
    children?: any;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = props => {
    const { children } = props;

    const { user } = useContext(UserContext).userState;

    if (user._id === '')
    {
        logging.info('Unauthorized, redirecting...');
        return <Redirect from="" to="/login"/>
    } else {
        return <>{children}</>
    }
}

export default AuthRoute;