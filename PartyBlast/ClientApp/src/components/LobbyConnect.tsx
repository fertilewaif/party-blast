import * as React from "react";
import {connect} from 'react-redux';
import * as LobbyConnect from '../store/LobbyConnect';
import {Button, Form, FormGroup, Input, Label, Spinner} from 'reactstrap';
import {useState} from "react";
import {ApplicationState} from "../store";
import {RouteComponentProps} from "react-router";

type LobbyConnectProps =
    LobbyConnect.CreateLobbyState &
    LobbyConnect.ConnectState &
    typeof LobbyConnect.actionCreators &
    RouteComponentProps<{}>;

const LobbyConnector: React.FC<LobbyConnectProps> = (props: LobbyConnectProps) => {
    const [login, setLogin] = useState<string>('');
    const [lobbyCode, setLobbyCode] = useState<string>('');
    
    const maxLength = 15;
    const [loginLengthLeft, setLoginLengthLeft] = useState<number>(maxLength);
    
    const createLobby = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        props.requestCreate({GameName: "quiz"});
    };

    const connectToLobby = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        props.requestConnect({Login: login, LobbyCode: lobbyCode});
    };

    return (
        <>
            <Form style={{ width: "30%", margin: "0 auto"}}>
                <FormGroup>
                    <Label>Username</Label>
                    <Label className="text-right" style={{ width: "75%"}}>{loginLengthLeft}</Label>
                    <Input type="text"
                           onChange={(ev): void => {
                               setLogin(ev.target.value);
                               setLoginLengthLeft(maxLength - ev.target.value.length);
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
                <Button color="primary" size="lg" block onClick={connectToLobby} disabled={loginLengthLeft < 0 || lobbyCode.length != 4}>
                    {!props.isLoadingConnect && "Join lobby"}
                    {props.isLoadingConnect && <Spinner/>}
                </Button>
                <Button color="primary" size="lg" block onClick={createLobby}>Create lobby</Button>
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
            ...state.connect,
            ...state.create
        }
    },
    LobbyConnect.actionCreators
)(LobbyConnector as any);
