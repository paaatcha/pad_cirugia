import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { StyleSheet } from 'react-native'
import TelaInicial from './components/TelaInicial'; 
import TelaBuscar from './components/TelaBuscar';
import TelaRespostaRequisicao from './components/TelaRespostaRequisicao';


export default props => (
    <Router navigationBarStyle={estilos.barraNavegacao} titleStyle={estilos.titulo} navBarButtonColor='#FFF' >
        <Scene key='root'>
            <Scene key='telaInicial' component={TelaInicial} hideNavBar={true} initial={ true }/>
            <Scene key='telaBuscar' component={TelaBuscar} title='Buscar paciente' />
            <Scene key='telaRespostaRequisicao' component={TelaRespostaRequisicao} title='Paciente buscado' />
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
