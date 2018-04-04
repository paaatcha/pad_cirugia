import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert, Image, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import axios from 'axios';

import { resetarPaciente } from '../actions/pacienteActions';

const imgSucesso = require ('../../img/sucesso.png');

class TelaFinal extends Component{   
    
    render(){        
        return(
            <View style={estilos.tudo} >                
                
                <View style={estilos.acima}>
                    <Image style={estilos.imgSucesso} source={imgSucesso} />
                    <Text style={ estilos.textoImg }> Inclusão realizada com sucesso </Text>  
                </View>

                <View style={estilos.abaixo}>
                    <Button title='Voltar para tela inicial' onPress={ Actions.telaInicial } color={Platform.select({ios:'#FFF'})} />
                </View>
                
            </View>
        );
    }
}

const estilos = StyleSheet.create({
    tudo: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#3596DB',
        margin: 20,
        marginTop: 40
    },

    acima: {        
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center'       
    },

    abaixo: {  
        flex: 1,
        width: '100%',
        
        ...Platform.select({
            ios: {
                backgroundColor: '#3596DB'                
            }
        })        
    },

    imgSucesso: {
        height: 195,
        width: 195                     
    },
       
    textoImg: {
        fontSize: 17, 
        textAlign: 'center',        
        fontWeight: '700',
        color: '#3596DB'

    }

});

const mapStateToProps = state => (    {
        
        pac: state.pacienteReducer
        
    }

)

export default connect(mapStateToProps, { resetarPaciente })(TelaFinal);