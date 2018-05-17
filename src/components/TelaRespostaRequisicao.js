import React, { Component } from 'react';
import { Text, View, Keyboard, StyleSheet, TextInput} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { dadosPaciente } from '../actions/dadosPacienteActions'
import BotaoCustomizado from './BotaoCustomizado';

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

                        <Text style={estilos.pacCampo}> Nº de lesões cadastradas: 
                            <Text style={estilos.dadoCampo}> {this.props.pac.nLesoes} </Text>                                
                        </Text>                        
                    </View>
                </View>

                <View style={estilos.abaixo} >
                    <BotaoCustomizado comp='FontAwesome' texto='Inserir dados da lesão' tamanho={38} altura={60}
                        icone='pencil-square-o' onPress={ Actions.telaAdicionarLesao } tamanhoFonte={14}
                    />                
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
        flex: 3,              
    },

    abaixo: {
        flex: 2
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
        height: 64,
        width: 241                     
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