import * as React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

export default class Layout extends React.PureComponent<{}, { children?: React.ReactNode }> {
    public render() {
        return (
            <>
                <NavMenu />
                <Container>
                    {this.props.children}
                </Container>
            </>
        );
    }
}