export const adicionarLesaoPac = (dados) => {
    return (
        {
            type: 'adicionarLesao',
            payload: dados
        }
    );
}

export const resetarPaciente = (dados) => {
    return (
        {
            type: 'resetarPaciente'            
        }
    );
}
