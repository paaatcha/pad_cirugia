const INITIAL_STATE = {
    lesoes: []
}

export default (state = INITIAL_STATE, action) => {
    
    if (action.type === 'adicionarLesao'){
        return { ...state, lesoes: [...state.lesoes, action.payload] };
    } else if (action.type === 'resetarPaciente'){
        return { ...state, ...INITIAL_STATE };
    }

    return state;
} 