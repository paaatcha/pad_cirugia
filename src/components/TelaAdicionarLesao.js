import React, { Component } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, Keyboard, TextInput, Button, Alert, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { alterarRegiao, alterarDiaMaior, alterarDiaMenor, 
    alterarDiagnostico, alterarProcedimento, alterarObs } from '../actions/lesaoActions';

class TelaAdicionarLesao extends Component {

    constructor (props){
        super(props);
        this.state = {
            botaoDesabilitar: true            
        }        

        this.processaEntradas = this.processaEntradas.bind(this);        
    }

    componentWillMount(){
        Keyboard.dismiss();
        //onChangeText={ texto =>  this.processaTextoEntrada(texto) }
    }


    msgFormIncompleto (campo){
        Alert.alert(
            'Atenção',
            'O campo ' + campo + ' não foi preenchido. É necessário preencher todas as informações da lesão para continuar.',
            [             
                {text: 'OK', onPress: () => console.log('OK msgFormIncompleto presionado')},
            ],
            { cancelable: false }
        ) 
    } 

    processaEntradas(){
        if (this.props.lesao.regiao == ''){            
            this.msgFormIncompleto ('Região');
        } else if (this.props.lesao.diaMaior == ''){
            this.msgFormIncompleto ('Diâmetro maior');
        } else if (this.props.lesao.diaMenor == ''){
            this.msgFormIncompleto ('Diâmetro menor');
        } else if (this.props.lesao.diagnostico == ''){
            this.msgFormIncompleto ('Diagnóstico');
        } else if (this.props.lesao.procedimento == ''){
            this.msgFormIncompleto ('Procedimento');
        } else {
            Actions.telaAdicionarImagemLesao();
        }        
    }

    render(){
        return (
            
            <ScrollView style={estilos.tudo} >                
                 
                    
                    <View>
                        <Text style={estilos.texto}> Região: </Text>                
                        <TextInput  style={ estilos.inputs} value={this.props.lesao.regiao} 
                            onChangeText={ texto => this.props.alterarRegiao(texto) }
                        /> 
                    </View>

                    <View>
                        <Text style={estilos.texto}> Diâmetro maior (mm): </Text>                
                        <TextInput  style={ estilos.inputs} keyboardType='numeric' value={this.props.lesao.diaMaior} 
                            onChangeText={ texto => this.props.alterarDiaMaior(texto) }
                        />    
                    </View>

                    <View>
                        <Text style={estilos.texto}> Diâmetro menor (mm): </Text>                
                        <TextInput  style={ estilos.inputs} keyboardType='numeric' value={this.props.lesao.diaMenor}  
                            onChangeText={ texto => this.props.alterarDiaMenor(texto) }
                        /> 
                    </View>


                    <View>
                        <Text style={estilos.texto}> Diagnóstico: </Text>                
                        <TextInput  style={ estilos.inputs} value={this.props.lesao.diagnostico} 
                            onChangeText={ texto => this.props.alterarDiagnostico(texto) }
                        />      
                    </View>


                    <View>
                        <Text style={estilos.texto}> Procedimento: </Text>                
                        <TextInput  style={ estilos.inputs} value={this.props.lesao.procedimento} 
                            onChangeText={ texto => this.props.alterarProcedimento(texto) }
                        />    
                    </View>


                    <View>
                        <Text style={estilos.texto}> Observação: </Text>                
                        <TextInput style={ estilos.inputs} value={this.props.lesao.obs} 
                            onChangeText={ texto => this.props.alterarObs(texto) }
                        />                                                                                          
                    </View>


                <View style={estilos.botao}> 
                    <Button title='Adicionar lesão' onPress={ this.processaEntradas } color="#FFF"/>                    
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
        marginTop: 40,
        marginBottom: 40,
        alignItems: 'center', 
        justifyContent: 'center'        
    },

    texto: {
        fontSize: 15,
        fontWeight: '700'       
    },

    inputs: {
        fontSize: 16,
        height: 35,
        marginBottom: 3,
        ...Platform.select({
            ios: {
                backgroundColor: '#ccc',
                marginBottom: 8
            }
        })       
    },

    botao: {
        marginBottom: 60,
        marginTop: 40, 

        ...Platform.select({
            ios: {
                backgroundColor: '#3596DB'                
            }
        })           

    }

});

const mapStateToProps = state => (
    {
        lesao: state.lesaoReducer
    }

)

export default connect(mapStateToProps, { alterarRegiao, alterarDiaMaior, alterarDiaMenor, alterarDiagnostico, alterarProcedimento, alterarObs })(TelaAdicionarLesao);