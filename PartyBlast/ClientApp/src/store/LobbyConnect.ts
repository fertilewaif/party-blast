// ------------------
// STATE - defines login info of user

import {AppThunkAction} from "./index";
import {Action, Reducer} from "redux";

export interface ConnectState {
    login?: string;
    lobbyCode?: string;
    connected: boolean;
    gameName?: string;
    isLoadingConnect: boolean;
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
    Login: string;
    LobbyCode: string;
}

interface ConnectResponse {
    Login: string;
    GameName: string;
}

// TEMPORARY INTERFACES FOR CREATING QUIZ LOBBY
// REMOVE AFTER ADDING FUNCTIONALITY OF CREATING LOBBY IN GAME
export interface CreateLobbyState {
    lobbyCode?: string;
    isLoadingCreate: boolean;
}

interface CreateLobbyRequest {
    GameName: string;
}

interface CreateLobbyResponse {
    roomCode: string;
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
        if (appState && appState.create && !appState.create.lobbyCode) {
            fetch('/api/lobby/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(gameName)
            }).then(response => response.json() as Promise<CreateLobbyResponse>).then(json => {
                dispatch({type: 'CREATE_RESPONSE', lobbyCode: json.roomCode})
            })
        }
    },

    requestConnect: (login: ConnectRequest): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // connect only if we are not logged in
        const appState = getState();
        if (appState && appState.connect && !appState.connect.connected) {
            fetch('/api/lobby/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(login)
            }).then(response => {
                if (response.ok) {
                    (response.json() as Promise<ConnectResponse>).then(json =>
                        dispatch({type: 'CONNECT_SUCCESS', login: json.Login, gameName: json.GameName})
                    )
                } else if (response.status === 401) {
                    dispatch({type: 'CONNECT_ERROR'})
                }
            })
            dispatch({type: 'CONNECT_REQUEST', lobbyCode: login.LobbyCode});
        }
    }
}
const defaultCreateState: CreateLobbyState = {
    isLoadingCreate: false, 
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
                isLoadingCreate: true,
            };
        case "CREATE_RESPONSE":
            return {
                isLoadingCreate: false,
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
    isLoadingConnect: false,
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
                isLoadingConnect: true,
                lobbyCode: action.lobbyCode
            };
        case "CONNECT_SUCCESS":
            // TODO: maybe add saving lobby code+login to local storage here
            return {
                ...state,
                login: action.login,
                isLoadingConnect: false,
                connected: true,
                gameName: action.gameName,
                connectError: false,
            };
        case "CONNECT_ERROR":
            return {
                ...state,
                isLoadingConnect: false,
                connectError: true,
            };
    }
    return state;
}
