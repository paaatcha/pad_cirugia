import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import axios from 'axios';

import { modificaCartaoSus } from '../actions/buscaCartaoSusActions';
import { dadosPaciente } from '../actions/dadosPacienteActions';


class TelaBuscar extends Component{    
    
    constructor (props){
        super(props);
        this.state = {
            botaoDesabilitar: true            
        }        

        this.processaRequisicao = this.processaRequisicao.bind(this);
        this.msgPacienteNaoEncontrado = this.msgPacienteNaoEncontrado.bind(this);
        this.msgFalhaRequisicao = this.msgFalhaRequisicao.bind(this);
    }

    async processaRequisicao (){
        let url = 'http://192.168.103:8080/APIrequisicoes/pegaPaciente.xhtml?cartaosus=' + this.props.cartaoSus;

        await axios.get(url)
        .then( response => {
            this.props.dadosPaciente(response.data);            

            if (this.props.pac.nome === null){
                this.msgPacienteNaoEncontrado();
            } else {
                Actions.telaRespostaRequisicao();
            }

        }) 
        .catch( () => {
            this.msgFalhaRequisicao();
        });
    } 

    msgPacienteNaoEncontrado (){  
        Alert.alert(
            'Atenção',
            'Não existe paciente cadastrado com esse nº do cartão do SUS. Verifique se o número está correto e tente novamente. Caso ainda assim não consiga, verifique se o paciente existe no sistema web',
            [             
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
        )        
    }

    msgFalhaRequisicao (){
        Alert.alert(
            'Atenção',
            'Falha na comunicação com o servidor. Verifique se você está conectado na rede PAD-UFES. Se sim, verifique se o 3G do seu celular está ativo. Caso positivo, desative-o. Se ainda assim o erro persistir, contate o administrador do sistema.',
            [             
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
        ) 
    }  
    
    // Processando o texto para liberar o botão
    processaTextoEntrada (texto) {                
        this.props.modificaCartaoSus(texto); 
        this.setState({botaoDesabilitar: texto.length != 18});

        console.log(texto)        
    } 
    
    render(){
        //console.log(this.state)
        return(
            <View style={estilos.tudo} >                
                <View style={estilos.acima}> 
                    <Text style={estilos.texto}> Digite o nº do cartão do SUS: </Text>                
                    <TextInput value={this.props.cartaoSus} style={ estilos.inputs} 
                        keyboardType='numeric' onChangeText={ texto =>  this.processaTextoEntrada(texto) }
                        placeholder='Digite o número do cartão' maxLength={18}                      
                    /> 

                    <Text> {this.props.pac.nome} </Text>

                </View>

                <View style={estilos.abaixo}> 
                    <Button title='Buscar' onPress={ this.processaRequisicao } disabled={this.state.botaoDesabilitar}/>                    
                </View> 

                
            </View>
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

const mapStateToProps = state => (
    {
        cartaoSus: state.buscaCartaoSusReducer.cartaoSus,
        pac: state.dadosPacienteReducer
        
    }

)

export default connect(mapStateToProps, { modificaCartaoSus, dadosPaciente })(TelaBuscar);