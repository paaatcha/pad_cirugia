export const adicionarLesaoPac = (dados) => {
    return (
        {
            type: 'adicionarLesao',
            payload: dados
        }
    );
}

export const resetarPaciente = () => {
    return (
        {
            type: 'resetarPaciente'            
        }
    );
}

export const alterarLesaoPac = (dados) => {
    return (
        {
            type: 'resetarPaciente',
            payload: dados            
        }
    );
}
