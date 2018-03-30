import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableHighlight, TextInput, Button} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { modificaCartaoSus } from '../actions/buscaCartaoSusActions';


class TelaBuscar extends Component{    
    
    constructor (props){
        super(props);
        this.state = {
            botaoDesabilitar: false
        }        
    }

    liberarBotao (texto) {                
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
                        keyboardType='numeric' onChangeText={ texto =>  this.liberarBotao(texto) }
                        placeholder='Digite o número do cartão' maxLength={18}                     
                    />

                </View>

                <View style={estilos.abaixo}>
                    <Button title='Buscar' onPress={ Actions.telaRespostaRequisicao } disabled={this.state.botaoDesabilitar}/>
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
        cartaoSus: state.buscaCartaoSusReducer.cartaoSus
    }

)

export default connect(mapStateToProps, { modificaCartaoSus })(TelaBuscar);