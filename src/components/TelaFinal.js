import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert, Image, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import axios from 'axios';
import { Octicons } from '@expo/vector-icons';

import { resetarPaciente } from '../actions/pacienteActions';
import BotaoCustomizado from './BotaoCustomizado';

class TelaFinal extends Component{   
    
    render(){        
        return(
            <View style={estilos.tudo} >                
                
                <View style={estilos.acima}>                    
                    <Octicons name='smiley' size={200} color='#4d79ff' style={estilos.imgSucesso} />
                    <Text style={ estilos.textoImg }> Inclusão realizada com sucesso </Text>  
                </View>

                
                <View style={estilos.abaixo}>
                <BotaoCustomizado comp='MaterialCommunityIcons' texto='Voltar para tela inicial' 
                        icone='keyboard-backspace' onPress={ Actions.telaInicial } altura={60}
                />
                </View>
                    
                
                
            </View>
        );
    }
}

const estilos = StyleSheet.create({
    tudo: {
        flex: 1,
        padding: 20,        
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#4d79ff',
        margin: 20,
        marginTop: 45
        
    },

    acima: {        
        flex: 7,
        alignItems: 'center',
        //justifyContent: 'center'       
    },

    abaixo: {  
        flex: 2,      
    },

    imgSucesso: {
        //height: 195,
        //width: 195                     
    },
       
    textoImg: {
        fontSize: 20, 
        textAlign: 'center',        
        fontWeight: '700',
        color: '#4d79ff',
        marginTop: 15

    }

});

const mapStateToProps = state => (    {
        
        pac: state.pacienteReducer
        
    }

)

export default connect(mapStateToProps, { resetarPaciente })(TelaFinal);