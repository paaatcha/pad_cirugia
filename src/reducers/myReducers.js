import { combineReducers } from "redux";
import buscaCartaoSusReducer from './buscaCartaoSusReducer';
import dadosPacienteReducer from './dadosPacienteReducer';

export default combineReducers({
    buscaCartaoSusReducer: buscaCartaoSusReducer,
    dadosPacienteReducer: dadosPacienteReducer
});