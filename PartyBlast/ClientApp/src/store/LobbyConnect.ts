// ------------------
// STATE - defines login info of user

import {AppThunkAction} from "./index";
import {Action, Reducer} from "redux";

export interface ConnectState {
    login?: string;
    lobbyCode?: string;
    connected: boolean;
    gameName?: string;
    isLoading: boolean;
    connectError: boolean;
}

// ------------------
// ACTIONS - defines actions of logging in/out

interface LogInRequestAction {
    type: 'CONNECT_REQUEST';
    lobbyCode: string;
}

interface LogInSuccessAction {
    type: 'CONNECT_SUCCESS';
    login: string;
    gameName: string;
}

interface LogInErrorAction {
    type: 'CONNECT_ERROR';
}

//interface LogOutAction {
//    type: 'LOG_OUT';
//}

type KnownAction = LogInSuccessAction | LogInErrorAction | LogInRequestAction;

// ------------------
// REQUESTS/RESPONSES - this are temporary interfaces for parsing api responses
export interface ConnectRequest {
    login: string;
    lobbyCode: string;
}

interface ConnectResponse {
    login: string;
    gameName: string;
}

// TEMPORARY INTERFACES FOR CREATING QUIZ LOBBY
// REMOVE AFTER ADDING FUNCTIONALITY OF CREATING LOBBY IN GAME
export interface CreateLobbyState {
    lobbyCode?: string;
    isLoading: boolean;
}

interface CreateLobbyRequest {
    gameName: string;
}

interface CreateLobbyResponse {
    lobbyCode: string;
}

interface CreateLobbyRequestAction {
    type: 'CREATE_REQUEST';
}
interface CreateLobbyResponseAction {
    type: 'CREATE_RESPONSE';
    lobbyCode: string;
}

type CreateAction = CreateLobbyRequestAction | CreateLobbyResponseAction;

// ------------------
// ACTION CREATORS

export const actionCreators = {
    requestCreate: (gameName: CreateLobbyRequest): AppThunkAction<CreateAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.createInfo && !appState.createInfo.lobbyCode) {
            fetch('/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(gameName)
            }).then(response => response.json() as Promise<CreateLobbyResponse>).then(json => {
                dispatch({type: 'CREATE_RESPONSE', lobbyCode: json.lobbyCode})
            })
        }
    },

    requestConnect: (login: ConnectRequest): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // connect only if we are not logged in
        const appState = getState();
        if (appState && appState.loginInfo && !appState.loginInfo.connected) {
            fetch('/api/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(login)
            }).then(response => {
                if (response.ok) {
                    (response.json() as Promise<ConnectResponse>).then(json =>
                        dispatch({type: 'CONNECT_SUCCESS', login: json.login, gameName: json.gameName})
                    )
                } else if (response.status === 401) {
                    dispatch({type: 'CONNECT_ERROR'})
                }
            })
            dispatch({type: 'CONNECT_REQUEST', lobbyCode: login.lobbyCode});
        }
    }
}
const defaultCreateState: CreateLobbyState = {
    isLoading: false, 
    lobbyCode: undefined
}

export const createReducer: Reducer<CreateLobbyState> = (state: CreateLobbyState | undefined, incomingAction: Action): CreateLobbyState => {
    if (state === undefined) {
        return defaultCreateState;
    }
    const action = incomingAction as CreateAction;
    switch (action.type) {
        case "CREATE_REQUEST":
            return {
                ...state,
                isLoading: true,
            };
        case "CREATE_RESPONSE":
            return {
                isLoading: false,
                lobbyCode: action.lobbyCode,
            };
    }
    return state;
}


// ------------------
// REDUCER

const unloadedState: ConnectState = {
    login: undefined,
    lobbyCode: undefined,
    connected: false,
    gameName: undefined,
    isLoading: false,
    connectError: false,
}

export const connectReducer: Reducer<ConnectState> = (state: ConnectState | undefined, incomingAction: Action): ConnectState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'CONNECT_REQUEST':
            return {
                ...state,
                isLoading: true,
                lobbyCode: action.lobbyCode
            };
        case "CONNECT_SUCCESS":
            // TODO: maybe add saving lobby code+login to local storage here
            return {
                ...state,
                login: action.login,
                isLoading: false,
                connected: true,
                gameName: action.gameName,
                connectError: false,
            };
        case "CONNECT_ERROR":
            return {
                ...state,
                isLoading: false,
                connectError: true,
            };
    }
    return state;
}
