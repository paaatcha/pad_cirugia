import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';


const cadastroPacienteImg = require ('../../img/cadastrarPaciente.png')

class TelaInicial extends Component{
    
    componentWillMount() {
        StatusBar.setHidden(true);
    }    

    render() {
        return (
            <View style={estilos.tudo} >
                <View style={estilos.acima} >
                    <Text style={estilos.titulo}> PAD </Text>
                    <Text style={estilos.subtitulo}> Programa de assistência dermatológica </Text> 
                </View>

                <View style={estilos.abaixo} >
                    <TouchableHighlight onPress={ Actions.telaBuscar } >
                        <View>
                            <Image source={ cadastroPacienteImg } style={ estilos.imgCadastro } />
                            <Text style={ estilos.textoCadastro }> ADICIONAR LESÃO </Text> 
                        </View>
                    </TouchableHighlight>
                </View>                
            </View>

        );
    }    
}

const estilos = StyleSheet.create ({
    tudo: {        
        flex: 1,        
        alignItems: 'center',
        justifyContent: 'center'
    },

    acima: {
        flex: 1,
        backgroundColor: '#4d79ff',
        width: '100%',         
        paddingTop: 20        
    },

    titulo: {
        fontSize: 30, 
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },

    subtitulo: {
        fontSize: 18, 
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10         
    },

    abaixo: {
        flex: 5,        
        alignItems: 'center',
        justifyContent: 'center'
    },

    imgCadastro: {
        height: 180,
        width: 180                     
    },

    textoCadastro: {
        fontSize: 20,  
        textAlign: 'center',
        marginTop: 20,
        fontWeight: '700',
        color: '#3596DB'

    }
});



export default TelaInicial;
