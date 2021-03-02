import * as React from "react";
import {connect} from 'react-redux';
import * as LobbyConnect from '../store/LobbyConnect';
import {Button, Form, FormGroup, Input, Label} from 'reactstrap';
import {useState} from "react";
import {ApplicationState} from "../store";

type LobbyConnectProps =
    LobbyConnect.CreateLobbyState &
    LobbyConnect.ConnectState &
    typeof LobbyConnect.actionCreators;

function LobbyConnector(props: LobbyConnectProps) {
    const [login, setLogin] = useState<string>('');
    const [lobbyCode, setLobbyCode] = useState<string>('');

    const createLobby = (event: MouseEvent) => {
        event.preventDefault();
        props.requestCreate({gameName: "quiz"});
    };

    const connectToLobby = (event: MouseEvent) => {
        event.preventDefault();
        props.requestConnect({login: login, lobbyCode: lobbyCode});
    };

    return (
        <>
            <Form>
                <FormGroup>
                    <Label>Username</Label>
                    <Input type="text"
                           onChange={(ev): void => {
                               setLogin(ev.target.value);
                           }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Lobby code</Label>
                    <Input type="text"
                           onChange={(ev): void => {
                               setLobbyCode(ev.target.value);
                           }}
                    />
                </FormGroup>
                <Button color="primary" size="lg" block onClick={() => connectToLobby}>Join lobby</Button>
                <Button color="primary" size="lg" block onClick={() => createLobby}>Create lobby</Button>
                {props.connectError &&
                <h1>Wrong lobby code</h1>
                }
                {props.lobbyCode &&
                <h1>Your lobby code: {props.lobbyCode}</h1>
                }

            </Form>
        </>
    );
}

export default connect(
    (state: ApplicationState) => {
        return {
            ...state.loginInfo,
            ...state.createInfo
        }
    },
    LobbyConnect.actionCreators
)(LobbyConnector as any);
