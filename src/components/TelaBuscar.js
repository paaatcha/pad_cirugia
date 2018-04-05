import React, { Component } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Keyboard, TextInput, Button, Alert, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import axios from 'axios';

import { modificaCartaoSus } from '../actions/buscaCartaoSusActions';
import { dadosPaciente } from '../actions/dadosPacienteActions';


class TelaBuscar extends Component{    
    
    constructor (props){
        super(props);
        this.state = {
            botaoDesabilitar: true,
            animating: false
        }        

        this.processaRequisicao = this.processaRequisicao.bind(this);
        this.msgPacienteNaoEncontrado = this.msgPacienteNaoEncontrado.bind(this);
        this.msgFalhaRequisicao = this.msgFalhaRequisicao.bind(this);
    }

    async processaRequisicao (){
        let url = 'http://172.20.75.18:8080/APIrequisicoes/paciente/' + this.props.cartaoSus;

        console.log(url);
        Keyboard.dismiss();
        this.setState({animating: true});

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

        this.setState({animating: false});
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
        const filtro = /^([0-9]){3}-([0-9]){4}-([0-9]){4}-([0-9]){4}$/;
        this.setState({ botaoDesabilitar: !filtro.test(texto) });     

        console.log(texto)        
    } 
    
    render(){
        //console.log(this.state.animating);
        return(          
            
            <View style={estilos.tudo} >                
                <View style={estilos.acima}> 
                    <Text style={estilos.texto}> Digite o nº do cartão do SUS: </Text>                
                    <TextInput value={this.props.cartaoSus} style={ estilos.inputs} 
                        keyboardType='numeric' onChangeText={ texto =>  this.processaTextoEntrada(texto) }
                        placeholder='Digite o número do cartão' maxLength={18}                      
                        onSubmitEditing={ this.processaRequisicao }
                    /> 
                </View>

            {
                !this.state.animating &&
                <View style={estilos.abaixo}> 
                    <View style={estilos.botao}>
                        <Button title='Buscar' onPress={ this.processaRequisicao } color={Platform.select({ios:'#FFF'})}
                            disabled={this.state.botaoDesabilitar}                            
                        />                    
                    </View>                    
                </View>
            }

            {
                this.state.animating &&
                <View style={estilos.gifEspera}>
                    <ActivityIndicator 
                    size={Platform.select(
                        {
                            ios: 'large',
                            android: 100
                        }
                    )}
                    
                    color="#2196F3" />
                    <Text style={estilos.textoGif}> Buscando... </Text>
                </View>
            }                        


            </View>

            

            
        );
    }
}

const estilos = StyleSheet.create({
    tudo: {
        flex: 1,
        padding: 20,
        borderWidth: 1,
        borderColor: '#999',
        margin: 7        
    },

    acima: {
        flex: 1,
        marginTop: 15
    },

    abaixo: {
        flex: 2
    },

    texto: {
        fontSize: 20,
        marginBottom: 15
    },

    inputs: {
        fontSize: 16,
        height: 35,
        marginBottom: 3,
        ...Platform.select({
            ios: {
                backgroundColor: '#d9d9d9',
                marginBottom: 8
            }
        })       
    },

    botao: {
        ...Platform.select({
            ios: {
                backgroundColor: '#3596DB'                
            }
        })           

    },

    gifEspera: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 10,
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'               
    },

    textoGif:{
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 10
    }

        

});

const mapStateToProps = state => (
    {
        cartaoSus: state.buscaCartaoSusReducer.cartaoSus,
        pac: state.dadosPacienteReducer
        
    }

)

export default connect(mapStateToProps, { modificaCartaoSus, dadosPaciente })(TelaBuscar);