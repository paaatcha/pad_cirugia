import React, { Component } from 'react';
import { Text, View, Keyboard, StyleSheet, TouchableHighlight, TextInput, Button, Image, ScrollView} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { dadosPaciente } from '../actions/dadosPacienteActions'

const addLesao = require ('../../img/addLesao.png');

class TelaRespostaRequisicao extends Component{

    componentWillMount(){
        Keyboard.dismiss();
    }

    render(){        
        return(
        <View style={estilos.tudo} >                
                
                <View style={estilos.acima}>

                    <View style={estilos.dadosLesao} >
                        <Text style={estilos.pacCampo}> Nome: 
                            <Text style={estilos.dadoCampo}> {this.props.pac.nome} </Text>
                        </Text>                

                        <Text style={estilos.pacCampo}> Prontuário: 
                            <Text style={estilos.dadoCampo}> {this.props.pac.pront} </Text>   
                        </Text>                

                        <Text style={estilos.pacCampo}> Alergia: 
                            <Text style={estilos.dadoCampo}> {this.props.pac.alergia} </Text>                    
                        </Text>
                        
                        <Text style={estilos.pacCampo}> Diabetes: 
                            <Text style={estilos.dadoCampo}> {this.props.pac.diabetes} </Text>                                               
                        </Text>                

                        <Text style={estilos.pacCampo}> Anticoagulante: 
                            <Text style={estilos.dadoCampo}> {this.props.pac.anticoagulante} </Text>                 
                        </Text>                

                        <Text style={estilos.pacCampo}> HAS: 
                            <Text style={estilos.dadoCampo}> {this.props.pac.has} </Text>
                        </Text>                

                        <Text style={estilos.pacCampo}> Pressão arterial sistolica: 
                            <Text style={estilos.dadoCampo}> {this.props.pac.pressao_sis} </Text>
                        </Text>                

                        <Text style={estilos.pacCampo}> Pressão arterial diastolica: 
                            <Text style={estilos.dadoCampo}> {this.props.pac.pressao_dis} </Text>                                
                        </Text>
                    </View>
                </View>

                <View style={estilos.abaixo} >
                    <TouchableHighlight onPress={ Actions.telaAdicionarLesao } >
                        <View>
                            <Image source={ addLesao } style={ estilos.imgAddLesao } />                            
                        </View>
                    </TouchableHighlight>
                </View>                 

            </View>
        );
    }
}

const estilos = StyleSheet.create({
    tudo: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#999',
        margin: 7        
    },

    acima: {
        flex: 4,              
    },

    abaixo: {
        flex: 1,
        marginTop: 40,
        marginBottom: 40,
        alignItems: 'center',  
        justifyContent: 'center' 
    },

    dadosLesao: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        paddingBottom: 3,
        borderTopColor: 'black',
        borderTopWidth: 1,
        paddingTop: 3,
        marginTop: 2,
        backgroundColor: '#d9d9d9'          
    },

    pacCampo: {
        fontSize: 17,
        marginBottom: 5,
        fontWeight: 'bold'
        
    },

    dadoCampo: {
        fontSize: 15,
        fontWeight: 'normal'
    },

    imgAddLesao: {
        height: 104,
        width: 260                     
    },  
    
    textoImg: {
        fontSize: 15, 
        textAlign: 'center',        
        fontWeight: '700',
        color: '#3596DB',
        marginTop: 15

    }    

});

const mapStateToProps = state => (
    {
        pac: state.dadosPacienteReducer
    }

)

export default connect(mapStateToProps, { dadosPaciente })(TelaRespostaRequisicao);