export const dadosPaciente = (dados) => {
    return (
        {
            type: 'dadosPaciente',
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
