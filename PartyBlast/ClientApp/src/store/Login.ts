// ------------------
// STATE - defines login info of user

import {AppThunkAction} from "./index";

export interface LoginInfo {
    login?: string;
    jwtToken?: string;
    loggedIn: boolean;
    authError: boolean;
}


// ------------------
// ACTIONS - defines actions of logging in/out

interface LogInRequestAction {
    type: 'LOG_IN_REQUEST';
}

interface LogInSuccessAction {
    type: 'LOG_IN_SUCCESS';
    login: string;
    token: string;
}

interface LogInErrorAction {
    type: 'LOG_IN_ERROR';
}

interface LogOutAction {
    type: 'LOG_OUT';
}

type KnownAction = LogInSuccessAction | LogOutAction | LogInErrorAction | LogInRequestAction;

// ------------------
// REQUESTS/RESPONSES - this are temporary interfaces for parsing api responses
export interface LogInRequest {
    login: string;
    password: string;
}

interface LogInResponse {
    login: string;
    token: string;
}

// ------------------
// ACTION CREATORS

export const actionCreators = {
    requestLogIn: (login: LogInRequest): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // log in only if we are not logged in
        const appState = getState();
        if (appState && appState.loginInfo && !appState.loginInfo.loggedIn) {
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(login)
            }).then(response => {
                if (response.ok) {
                    (response.json() as Promise<LogInResponse>).then(json =>
                        dispatch({type:'LOG_IN_SUCCESS', login:json.login, token:json.token})
                    )
                }
                else if (response.status === 401) {
                    dispatch({type: 'LOG_IN_ERROR'})
                }
            })
            dispatch({type: 'LOG_IN_REQUEST'})
        }
    }
}
