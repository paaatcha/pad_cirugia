import React, { Component } from 'react';
import { Text, View, ScrollView, KeyboardAvoidingView, TouchableHighlight, Image, StyleSheet, Keyboard, TextInput, Button, Alert, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { alterarRegiao, alterarDiaMaior, alterarDiaMenor, 
    alterarDiagnostico, alterarProcedimento, alterarObs } from '../actions/lesaoActions';

import BotaoCustomizado from './BotaoCustomizado';
    

class TelaAdicionarLesao extends Component {

    constructor (props){
        super(props);
        this.state = {
            botaoDesabilitar: true,
            isDiag: false, 
            lesSelecionada: null,
            listaDiagCompleta: this.props.listaAutoComp.listaAutoCompDiag,
            listaDiag: []
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

    _autoCompDiag(texto){
        if (texto.length > 0){
            this.setState({isDiag: true});
        } else {
            this.setState({isDiag: false});
        }

        this.props.alterarDiagnostico(texto);

        let listaSugestao = [];
        query = texto.toUpperCase();
        for (i=0; i < this.state.listaDiagCompleta.length; i++){
            if (this.state.listaDiagCompleta[i].indexOf(query) > -1){
                listaSugestao.push(this.state.listaDiagCompleta[i]);
            }
        }

        if (listaSugestao.length == 0){
            this.setState({isDiag: false});
        }

        this.setState({listaDiag: listaSugestao});        
        //console.log(listaSugestao);
    }

    setSelecionado (les){
        this.props.alterarDiagnostico(les);
        this.setState({isDiag: false});
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
        
        let opcoesDiag = [];

        for (i=0; i < this.state.listaDiag.length; i++){
            let les = this.state.listaDiag[i];
            opcoesDiag.push(
                <TouchableHighlight key={i} style={{backgroundColor: '#d9d9d9'}}                 
                onPress={() => this.setSelecionado(les) }>
                    <Text style={{fontSize: 15, marginBottom: 2}}> {les} </Text>
                </TouchableHighlight>
            );            
        }

        return (
            
            <ScrollView keyboardShouldPersistTaps='handled'>
                <KeyboardAvoidingView  behavior='padding'>                                 

                    <View style={estilos.tudo}>

                        <View style={estilos.acima}>
                            <View>
                                <Text style={estilos.texto}> Região: </Text>                
                                <TextInput  style={ estilos.inputs} value={this.props.lesao.regiao} 
                                    onChangeText={ texto => this.props.alterarRegiao(texto) }
                                    onSubmitEditing={() => this.diagRef.focus()} 
                                    blurOnSubmit={false}                                    
                                /> 
                            </View>

                            <View>
                                <Text style={estilos.texto}> Diagnóstico: </Text>                
                                <TextInput  style={ estilos.inputs} value={this.props.lesao.diagnostico} 
                                    onChangeText={ texto => this._autoCompDiag(texto) }
                                    onSubmitEditing={() => this.diaMaiorRef.focus()} 
                                    ref={(ref) => this.diagRef=ref}
                                    blurOnSubmit={false}
                                />      
                            </View>  

                            {   
                                this.state.isDiag &&
                                <View style={estilos.boxAutoCompletar}>
                                    {
                                        opcoesDiag
                                    }
                                </View>
                            }

                            <View>
                                <Text style={estilos.texto}> Diâmetro maior (mm): </Text>                
                                <TextInput  style={ estilos.inputs} keyboardType='numeric' value={this.props.lesao.diaMaior} 
                                    onChangeText={ texto => this.props.alterarDiaMaior(texto) }
                                    onSubmitEditing={() => this.diaMenorRef.focus()} 
                                    ref={(ref) => this.diaMaiorRef=ref}
                                    blurOnSubmit={false}
                                />    
                            </View>

                            <View>
                                <Text style={estilos.texto}> Diâmetro menor (mm): </Text>                
                                <TextInput  style={ estilos.inputs} keyboardType='numeric' value={this.props.lesao.diaMenor}  
                                    onChangeText={ texto => this.props.alterarDiaMenor(texto) }
                                    onSubmitEditing={() => this.procRef.focus()} 
                                    ref={(ref) => this.diaMenorRef=ref}
                                    blurOnSubmit={false}
                                /> 
                            </View>                            

                            <View>
                                <Text style={estilos.texto}> Procedimento: </Text>                
                                <TextInput  style={ estilos.inputs} value={this.props.lesao.procedimento} 
                                    onChangeText={ texto => this.props.alterarProcedimento(texto) }
                                    onSubmitEditing={() => this.obsRef.focus()} 
                                    ref={(ref) => this.procRef=ref}
                                    blurOnSubmit={false}                            
                                />    
                            </View>


                            <View>
                                <Text style={estilos.texto}> Observação: </Text>                
                                <TextInput style={ estilos.inputs} value={this.props.lesao.obs} 
                                    onChangeText={ texto => this.props.alterarObs(texto) }
                                    ref={(ref) => this.obsRef=ref}
                                    blurOnSubmit={false}   
                                    onSubmitEditing={ this.processaEntradas }                         
                                />                                                                                          
                            </View>
                        </View>

                        <View style={estilos.abaixo}>
                            <BotaoCustomizado comp='FontAwesome' texto='Adicionar lesão' tamanho={30}
                                icone='plus' onPress={ this.processaEntradas } 
                             />
                        </View>

                    </View>
                
                </KeyboardAvoidingView>

            </ScrollView>
            
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
        flex: 5
    },

    abaixo: {  
        flex: 1,              
        marginTop: 25
    },

    texto: {
        fontSize: 15,
        fontWeight: '700'       
    },

    boxAutoCompletar:{
        backgroundColor: '#ccc', 
        marginBottom:5,
        borderColor: 'black',
        borderWidth: 1,
        marginTop: -4
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
        lesao: state.lesaoReducer,
        listaAutoComp: state.listasAutoCompReducer
    }

)

export default connect(mapStateToProps, { alterarRegiao, alterarDiaMaior, alterarDiaMenor, alterarDiagnostico, alterarProcedimento, alterarObs })(TelaAdicionarLesao);