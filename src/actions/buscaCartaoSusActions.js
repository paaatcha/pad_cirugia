export const modificaCartaoSus = (texto) => {
    return (
        {
            type: 'modificaCartaoSus',
            payload: texto
        }
    );
}

export const resetarCartaoSus = () => {
    return (
        {
            type: 'resetarCartaoSus'            
        }
    );
}