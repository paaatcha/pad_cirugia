export const dadosPaciente = (dados) => {
    return (
        {
            type: 'dadosPaciente',
            payload: dados
        }
    );
}

export const resetaPaciente = () => {
    return (
        {
            type: 'resetaPaciente'            
        }
    );
}
