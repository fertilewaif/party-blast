import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';
import LobbyConnect from "./components/LobbyConnect";

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={LobbyConnect} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    </Layout>
);
