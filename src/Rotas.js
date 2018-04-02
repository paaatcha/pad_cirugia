import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { StyleSheet } from 'react-native'
import TelaInicial from './components/TelaInicial'; 
import TelaBuscar from './components/TelaBuscar';
import TelaRespostaRequisicao from './components/TelaRespostaRequisicao';
import TelaAdicionarLesao from './components/TelaAdicionarLesao';
import TelaAdicionarImagemLesao from './components/TelaAdicionarImagemLesao'; 
import TelaListarLesoes from './components/TelaListarLesoes'
import TelaFinal from './components/TelaFinal'


export default props => (
    <Router navigationBarStyle={estilos.barraNavegacao} titleStyle={estilos.titulo} navBarButtonColor='#FFF' backTitle = " "> 
        <Scene key='root'>
            <Scene key='telaInicial' component={TelaInicial} hideNavBar={true} />
            <Scene key='telaBuscar' component={TelaBuscar} title='Buscar paciente' />
            <Scene key='telaRespostaRequisicao' component={TelaRespostaRequisicao} title='Dados do paciente' />
            <Scene key='telaAdicionarLesao' initial={true} component={TelaAdicionarLesao} title='Adicionar Lesão' />
            <Scene key='telaAdicionarImagemLesao' component={TelaAdicionarImagemLesao} title='Adicionar imagem' />
            <Scene key='telaListarLesoes' component={TelaListarLesoes} title='Lesões adicionadas' />
            <Scene key='telaFinal' component={TelaFinal} hideNavBar={true} />
        </Scene>
    </Router> 
); 


const estilos = StyleSheet.create({
    barraNavegacao: {
        backgroundColor: '#4d79ff'        
    },

    titulo: {
        color: '#FFF'
    }
});
