import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../contexts/user';
import IPageProps from '../interfaces/page';
import firebase from 'firebase/compat';
import { Authenticate, SignInWithSocialMedia as SocialMediaPopup } from '../modules/auth';
import logging from '../config/logging';
import CenterPiece from '../components/CenterPiece';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import ErrorText from '../components/ErrorText';
import { Providers } from '../config/firebase';
import LoadingComponent from '../components/LoadingComponent';

const LoginPage: React.FunctionComponent<IPageProps> = (props) => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const userContext = useContext(UserContext);
    const history = useHistory();
    const isLogin = window.location.pathname.includes('login');

    const SignInWithSocialMedia = (provider: firebase.auth.AuthProvider) => {
        if (error !== '') setError('');
        setAuthenticating(true);

        SocialMediaPopup(provider)
        .then(async (result) => {
            logging.info(result);

            let user = result.user;

            if (user) {
                let uid = user.uid;
                let name = user.displayName;

                if (name) {
                    try {
                        let fire_token = await user.getIdToken();

                        Authenticate(uid, name, fire_token, (error, _user) => {
                            if (error)
                            {
                                setError(error);
                                setAuthenticating(false);
                            } else if (_user)
                            {
                                userContext.userDispatch({ type: 'login', payload: {user: _user, fire_token}})
                                history.push('/');
                            }
                        })

                    /** If we get a token, auth with the backend */
                    } catch (error) {
                        setError('Invalid token.');
                        logging.error(error);
                        setAuthenticating(false);
                    }
                } else {
                    /**
                     * If no name is returned, we could have a custom form
                     * herer getting the user's name, dependiong on the provider
                     * you are using. Google generally returns ones, let's
                     * just use that for now.
                     */
                    setError("The identity provider doesn't have a name.");
                    setAuthenticating(false);
                }
            } else {
                setError('The identity provider is missing a lot of the neccessary information.');
                setAuthenticating(false);
            }
        })
        .catch(error => {
            setError(error.message);
            setAuthenticating(false);
        })
    };

    return (
        <CenterPiece>
            <Card>
                <CardHeader>
                    {isLogin ? 'Login' : 'Sign Up'}
                </CardHeader>
                <CardBody>
                    <ErrorText error={error}/>
                    <Button 
                        block
                        disabled={authenticating}
                        onClick={() => SignInWithSocialMedia(Providers.google)}
                        style={{
                            backgroundColor: '#ea4335',
                            borderColor: '#ea4335'
                        }}
                    >
                        <i className="fa-brands fa-google mr-2"></i>
                        Sign {isLogin ? 'in' : 'up'} with Google
                    </Button>
                    {authenticating && <LoadingComponent card={false}/>}
                </CardBody>
            </Card>
        </CenterPiece>
    )
};

export default LoginPage;
