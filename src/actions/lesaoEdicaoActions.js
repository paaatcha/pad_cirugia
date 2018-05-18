export const alterarPosLesEdicao = (dados) => {
    return (
        {
            type: 'alterarPosicao',
            payload: dados
        }
    );
}

export const alterarTelaAntEdicao = (dados) => {
    return (
        {
            type: 'alterarTela',
            payload: dados
        }
    );
}

