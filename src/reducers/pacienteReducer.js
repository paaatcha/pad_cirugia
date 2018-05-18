const INITIAL_STATE = {
    lesoes: []
}

export default (state = INITIAL_STATE, action) => {
    
    if (action.type === 'adicionarLesao'){
        return { ...state, lesoes: [...state.lesoes, action.payload] };
    } else if (action.type === 'resetarPaciente'){
        return { ...state, ...INITIAL_STATE };
    } else if (action.type === 'alterarLesaoPac'){
        let tempLesao = {...state};
        tempLesao.lesoes[action.payload.pos] = action.payload.lesoes;
        return tempLesao;
        //return { ...state, lesoes: [...state.lesoes, action.payload] };
    }

    return state;
} 