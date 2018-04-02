import { combineReducers } from "redux";
import buscaCartaoSusReducer from './buscaCartaoSusReducer';
import dadosPacienteReducer from './dadosPacienteReducer';
import lesaoReducer from './lesaoReducer';
import pacienteReducer from './pacienteReducer';
 
export default combineReducers({
    buscaCartaoSusReducer: buscaCartaoSusReducer,
    dadosPacienteReducer: dadosPacienteReducer,
    pacienteReducer: pacienteReducer,
    lesaoReducer: lesaoReducer
});
