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
    }

    processaRequisicao (){
        let url = 'http://192.168.1.103:8080/APIrequisicoes/pegaPaciente.xhtml?cartaosus=' + this.props.cartaoSus;

        console.log(this.props.cartaoSus);
        
        axios.get(url)
        .then( response => this.props.dadosPaciente(response.data) ) 
        .catch( () => { this.falhaNaRequisicao() } );   
        

        return Actions.telaRespostaRequisicao;
    } 

    processaRespostaRequisicao (dados){
        if (dados.nome == null){
            Alert.alert(
                'Atenção',
                'Não existe paciente cadastrado com esse nº do cartão do SUS. Verifique o número e tente novamente. Caso ainda assim não consiga, verifique se o paciente existe no sistema web',
                [             
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              )
        } else {
            this.props.dadosPaciente(dados)
        }
    }

    falhaNaRequisicao (){
        // TODO: Aplicar o reduxThunk para deixar a requisição sincrona!
    }
    
    // Processando o texto para liberar o botão
    processaTextoEntrada (texto) {                
        this.props.modificaCartaoSus(texto);        
        this.setState({botaoDesabilitar: texto.length != 18});

        console.log(texto)        
    }
    
    render(){
        console.log(this.state)
        return(
            <View style={estilos.tudo} >                
                <View style={estilos.acima}> 
                    <Text style={estilos.texto}> Digite o nº do cartão do SUS: </Text>                
                    <TextInput value={this.props.cartaoSus} style={ estilos.inputs} 
                        keyboardType='numeric' onChangeText={ texto =>  this.processaTextoEntrada(texto) }
                        placeholder='Digite o número do cartão' maxLength={18}                     
                    />

                </View>

                <View style={estilos.abaixo}>
                    <Button title='Buscar' onPress={ this.processaRequisicao() } disabled={this.state.botaoDesabilitar}/>
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