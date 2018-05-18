const INITIAL_STATE = {
    posLes: -1,
    telaAnt: ''
    
}

export default (state = INITIAL_STATE, action) => {    
    
    if (action.type === 'alterarPosicao'){
        return { ...state, posLes: action.payload }
    } else if (action.type === 'alterarTela'){
        return { ...state, telaAnt: action.payload }
    }
    
    return state;
} 