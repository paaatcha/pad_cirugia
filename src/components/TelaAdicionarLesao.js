import React, { Component } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, Keyboard, TextInput, Button} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';


export default class TelaAdicionarLesao extends Component {

    componentWillMount(){
        Keyboard.dismiss();
    }

    render(){
        return (
            <ScrollView style={estilos.tudo} >                
                <View style={estilos.acima}> 
                    <Text style={estilos.texto}> Região: </Text>                
                    <TextInput  style={ estilos.inputs} /> 

                    <Text style={estilos.texto}> Diâmetro maior (mm): </Text>                
                    <TextInput  style={ estilos.inputs} keyboardType='numeric' />    

                    <Text style={estilos.texto}> Diâmetro menor (mm): </Text>                
                    <TextInput  style={ estilos.inputs} keyboardType='numeric' /> 

                    <Text style={estilos.texto}> Diagnóstico: </Text>                
                    <TextInput  style={ estilos.inputs} />      

                    <Text style={estilos.texto}> Procedimento: </Text>                
                    <TextInput  style={ estilos.inputs} />    

                    <Text style={estilos.texto}> Observação: </Text>                
                    <TextInput  style={ estilos.inputs} />                                                                                          
                </View>
                
            </ScrollView>
        );
    }
}

const estilos = StyleSheet.create({
    tudo: {
        flex: 1,
        padding: 20
    },

    acima: {
        flex: 1
    },

    abaixo: {
        flex: 2
    },

    texto: {
        fontSize: 20,
        marginBottom: 15
    },

    inputs: {
        fontSize: 20,
        height: 45        
    }

});