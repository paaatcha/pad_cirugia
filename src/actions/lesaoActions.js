export const alterarLesao = (dados) => {
    return (
        {
            type: 'alterarLesao',
            payload: dados
        }
    );
}

export const alterarRegiao = (dados) => {
    return (
        {
            type: 'alterarRegiao',
            payload: dados
        }
    );
}

export const alterarDiaMaior = (dados) => {
    return (
        {
            type: 'alterarDiaMaior',
            payload: dados
        }
    );
}

export const alterarDiaMenor = (dados) => {
    return (
        {
            type: 'alterarDiaMenor',
            payload: dados
        }
    );
}

export const alterarDiagnostico = (dados) => {
    return (
        {
            type: 'alterarDiagnostico',
            payload: dados
        }
    );
}

export const alterarProcedimento = (dados) => {
    return (
        {
            type: 'alterarProcedimento',
            payload: dados
        }
    );
}

export const alterarObs = (dados) => {
    return (
        {
            type: 'alterarObs',
            payload: dados
        }
    );
}

export const adicionarImg = (dados) => {
    return (
        {
            type: 'adicionarImg',
            payload: dados
        }
    );
}

export const resetarLesao = () => {
    return (
        {
            type: 'resetarLesao'            
        }
    );
}