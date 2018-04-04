const INITIAL_STATE = {
    regiao: 'perna',
    diaMaior: '10',
    diaMenor: '5',
    diagnostico: 'cbc',
    procedimento: 'bex',
    obs: 'NENHUMA',
    imagens: []
}

export default (state = INITIAL_STATE, action) => {

    if (action.type === 'alterarRegiao'){
        return { ...state, regiao: action.payload }
    } else if (action.type === 'alterarDiaMaior'){
        return { ...state, diaMaior: action.payload }
    } else if (action.type === 'alterarDiaMenor'){
        return { ...state, diaMenor: action.payload }
    } else if (action.type === 'alterarDiagnostico'){
        return { ...state, diagnostico: action.payload }
    } else if (action.type === 'alterarProcedimento'){
        return { ...state, procedimento: action.payload }
    } else if (action.type === 'alterarObs'){
        return { ...state, obs: action.payload }
    } if (action.type === 'adicionarImg'){        
        return { ...state, imagens: [...state.imagens, action.payload] };
    } if (action.type === 'resetarLesao'){
        return { ...state, ...INITIAL_STATE }
    }    

    return state;
} 