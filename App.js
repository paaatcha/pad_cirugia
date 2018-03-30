import React, { Component } from 'react';
import { AppRegistry, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Rotas from './src/Rotas';
import reducers from './src/reducers/myReducers';

export default class App extends Component{
    render(){
        return (         
            <Provider store={createStore(reducers)}>               
                <Rotas />
            </Provider>
        );
    }
}
