import React, { Component } from 'react';
import { Router, Scene, ActionConst } from 'react-native-router-flux';
import { View, Platform, Text, TouchableHighlight } from 'react-native';
import { StyleSheet } from 'react-native'
import TelaInicial from './components/TelaInicial'; 
import TelaBuscar from './components/TelaBuscar';
import TelaRespostaRequisicao from './components/TelaRespostaRequisicao';
import TelaAdicionarLesao from './components/TelaAdicionarLesao';
import TelaAdicionarImagemLesao from './components/TelaAdicionarImagemLesao'; 
import TelaListarLesoes from './components/TelaListarLesoes'
import TelaFinal from './components/TelaFinal'

import { MaterialCommunityIcons} from '@expo/vector-icons';


const margem = Platform.OS === 'ios' ? 0 : 45;

export default Rotas = (props) => { 
    
    // renderRightButton={menuLateral}
    // Aqui é para fazer o menu lateral. Feature futura
    let menuLateral = 
        <View>
            <TouchableHighlight onPress={ () => false }>
                <View>
                    <MaterialCommunityIcons name='menu' color='#FFF' size={25}  
                        style={ {right: 15 }}
                    />
                </View>
            </TouchableHighlight>
        </View>

    return (
        <Router navigationBarStyle={estilos.barraNavegacao} titleStyle={estilos.titulo} 
            navBarButtonColor='#FFF' backTitle = " " panHandlers={null}
            
        > 
            <Scene key='root'>
                <Scene key='telaInicial' component={TelaInicial} hideNavBar={true} />

                <Scene key='telaBuscar' component={TelaBuscar} title='Buscar paciente' />

                <Scene key='telaRespostaRequisicao' component={TelaRespostaRequisicao} title='Dados do paciente' />

                <Scene key='telaAdicionarLesao'  component={TelaAdicionarLesao} title='Adicionar Lesão' 
                    titleStyle={{marginLeft: margem}} 
                />

                <Scene key='telaAdicionarImagemLesao'  component={TelaAdicionarImagemLesao} title='Adicionar imagem' 
                    titleStyle={{marginLeft: margem}} 
                    backTitle=" " 
                />


                <Scene key='telaListarLesoes'  component={TelaListarLesoes} title='Lesões adicionadas' 
                    renderLeftButton={<View/>} titleStyle={{marginLeft: margem}} type={ActionConst.RESET}
                />


                <Scene key='telaFinal' component={TelaFinal} hideNavBar={true} 
                    renderLeftButton={<View/>} type={ActionConst.RESET} 
                />
            </Scene>
        </Router> 
    ); 
}


const estilos = StyleSheet.create({
    barraNavegacao: {
        backgroundColor: '#4d79ff'        
    },

    titulo: {
        color: '#FFF'
    }
});
