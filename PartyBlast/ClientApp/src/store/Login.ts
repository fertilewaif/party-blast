// ------------------
// STATE - defines login info of user

import {AppThunkAction} from "./index";

export interface LoginInfo {
    login?: string;
    jwtToken?: string;
    loggedIn: boolean;
}


// -------------------
// ACTIONS - defines actions of logging in/out

interface LogInAction {
    type: 'LOG_IN';
    login: string;
    token: string;
}

interface LogOutAction {
    type: 'LOG_OUT';
}

type KnownAction = LogInAction | LogOutAction;


// ----------------------
// ACTION CREATORS

export const actionCreators = {
    requestLogIn: (login: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // log in only if we are not logged in
        const appState = getState();
        if (appState && appState.loginInfo && !appState.loginInfo.loggedIn) {
            
        }
    }
}
