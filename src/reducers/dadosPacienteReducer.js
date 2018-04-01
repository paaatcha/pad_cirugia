const INITIAL_STATE = {
    nome: '000',
    pront:'',
    alergia:'',
    diabetes:'',
    anticoagulante:'',
    has: '',
    pressao_sis: '',
    pressao_dis: ''
}

export default (state = INITIAL_STATE, action) => {
    if (action.type === 'dadosPaciente'){        
        return { ...state, ...action.payload } 
    } else if (action.type === 'resetaPaciente'){
        return { ...state, ...INITIAL_STATE }
    }

    return state;
} 