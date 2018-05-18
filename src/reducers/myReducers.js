import { combineReducers } from "redux";
import buscaCartaoSusReducer from './buscaCartaoSusReducer';
import dadosPacienteReducer from './dadosPacienteReducer';
import lesaoReducer from './lesaoReducer';
import pacienteReducer from './pacienteReducer';
import listasAutoCompReducer from './listasAutoCompReducer';
import lesaoEdicaoReducer from './lesaoEdicaoReducer';
 
export default combineReducers({
    buscaCartaoSusReducer: buscaCartaoSusReducer,
    dadosPacienteReducer: dadosPacienteReducer,
    pacienteReducer: pacienteReducer,
    lesaoReducer: lesaoReducer,
    listasAutoCompReducer: listasAutoCompReducer,
    lesaoEdicaoReducer: lesaoEdicaoReducer
});
