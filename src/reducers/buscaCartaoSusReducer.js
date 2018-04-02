const INITIAL_STATE = {
    cartaoSus: ''    
} 

export default (state = INITIAL_STATE, action) => {
    if (action.type === 'modificaCartaoSus'){
        let filtro1 = /^([0-9]){4}$/;
        let filtro2 = /^([0-9]){3}-([0-9]){5}$/;
        let filtro3 = /^([0-9]){3}-([0-9]){4}-([0-9]){5}$/;
        var cartao = action.payload;          

        if (filtro1.test(cartao)){
            cartao = cartao.substring(0,3) + '-' + cartao.substring(3,4);
        } else if (filtro2.test(cartao)) {
            cartao = cartao.substring(0,8) + '-' + cartao.substring(8,9);
        } else if (filtro3.test(cartao)) {
            cartao = cartao.substring(0,13) + '-' + cartao.substring(13,14);
        }

        return { ...state, cartaoSus: cartao } 
    } else if (action.type === 'resetarCartaoSus'){        
        return { ...state, INITIAL_STATE } 
    }

    return state;
}
