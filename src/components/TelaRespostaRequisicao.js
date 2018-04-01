import React, { Component } from 'react';
import { Text, View, Keyboard, StyleSheet, TouchableHighlight, TextInput, Button} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { dadosPaciente } from '../actions/dadosPacienteActions'

class TelaRespostaRequisicao extends Component{

    componentWillMount(){
        Keyboard.dismiss();
    }

    render(){        
        return(
        <View style={estilos.tudo} >                
                
                <View style={estilos.acima}>
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
                        <Text style={estilos.dadoCampo}> {this.props.pac.pressao_sis} </Text>                                
                    </Text>
                </View>
                

                <View style={estilos.abaixo}>
                    <Button title='Adicionar lesão' onPress={ Actions.telaAdicionarLesao } />
                </View> 
            </View>
        );
    }
}

const estilos = StyleSheet.create({
    tudo: {
        flex: 1,
        padding: 10
    },

    acima: {
        flex: 5
    },

    abaixo: {
        flex: 1
    },

    pacCampo: {
        fontSize: 19,
        marginBottom: 5,
        fontWeight: 'bold'
        
    },

    dadoCampo: {
        fontSize: 17,
        fontWeight: 'normal'
    }

});

const mapStateToProps = state => (
    {
        pac: state.dadosPacienteReducer
    }

)

export default connect(mapStateToProps, { dadosPaciente })(TelaRespostaRequisicao);