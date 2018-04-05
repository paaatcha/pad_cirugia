import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { View, Platform } from 'react-native';
import { StyleSheet } from 'react-native'
import TelaInicial from './components/TelaInicial'; 
import TelaBuscar from './components/TelaBuscar';
import TelaRespostaRequisicao from './components/TelaRespostaRequisicao';
import TelaAdicionarLesao from './components/TelaAdicionarLesao';
import TelaAdicionarImagemLesao from './components/TelaAdicionarImagemLesao'; 
import TelaListarLesoes from './components/TelaListarLesoes'
import TelaFinal from './components/TelaFinal'


const margem = Platform.OS === 'ios' ? 0 : 45;

export default props => (
    <Router navigationBarStyle={estilos.barraNavegacao} titleStyle={estilos.titulo} navBarButtonColor='#FFF' backTitle = " " > 
        <Scene key='root'>
            <Scene key='telaInicial' component={TelaInicial} hideNavBar={true} />

            <Scene key='telaBuscar' component={TelaBuscar} title='Buscar paciente' />

            <Scene key='telaRespostaRequisicao' component={TelaRespostaRequisicao} title='Dados do paciente' />

            <Scene key='telaAdicionarLesao' component={TelaAdicionarLesao} title='Adicionar Lesão' 
                renderLeftButton={<View/>} titleStyle={{marginLeft: margem}}
            />

            <Scene key='telaAdicionarImagemLesao'  component={TelaAdicionarImagemLesao} title='Adicionar imagem' 
                renderLeftButton={<View/>} titleStyle={{marginLeft: margem}} 
                backTitle=" "
            />


            <Scene key='telaListarLesoes' component={TelaListarLesoes} title='Lesões adicionadas' 
                renderLeftButton={<View/>} titleStyle={{marginLeft: margem}} 
            />


            <Scene key='telaFinal' component={TelaFinal} hideNavBar={true} 
                renderLeftButton={<View/>} 
            />
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
