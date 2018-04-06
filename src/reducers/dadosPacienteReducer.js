const INITIAL_STATE = {
    nome: '',
    pront:'',
    alergia:'',
    diabetes:'',
    anticoagulante:'',
    has: '',
    pressao_sis: '',
    pressao_dis: '',
    nLesoes: 0
}

export default (state = INITIAL_STATE, action) => {
    if (action.type === 'dadosPaciente'){        
        return { ...state, ...action.payload } 
    } else if (action.type === 'resetaPaciente'){
        return { ...state, ...INITIAL_STATE }
    }

    return state;
} 