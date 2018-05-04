import React, { Component } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, ActivityIndicator, TextInput, Button, Alert, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import axios, { CancelToken } from 'axios';

import { resetarPaciente } from '../actions/pacienteActions';

import { resetarCartaoSus } from '../actions/buscaCartaoSusActions';

import BotaoCustomizado from './BotaoCustomizado';


class TelaListarLesoes extends Component {
 
    state = {
        animating: false,
        andamento: ''
    }

    _iniciaEnvio = () => {
        Alert.alert(
            'Enviando as lesões para o banco de dados',
            'O envio dos dados será iniciado. O tempo de envio pode levar alguns segundos e varia de acordo com o número de lesões e imagens adicionadas.',
            [             
                {text: 'OK', onPress: () => this._finalizarAplicacao() },
                {text: 'Cancelar', onPress: () => console.log("EnvioCancelado") },
            ],
            { cancelable: false }
        )  
    } 

    _msgFalhaEnvio = () => {
        Alert.alert(
            'Falha no envio dos dados',
            'Ocorreu uma falha ao enviar os dados para o servidor. Verifique se você está conectado na rede PADUFES e se seu 3G está desligado. Após a verificação, tente novamente.',
            [             
                {text: 'OK', onPress: () => console.log('OK msgFalhaEnvio')},
            ],
            { cancelable: false }
        )  
    }    

    _finalizarAplicacao = async () => {   
        let source = CancelToken.source();
        let lesoes = this.props.pac.lesoes;
        let urlPost = 'http://192.168.1.99:8080//APIrequisicoes/paciente/cadastrarLesoes/' + this.props.cartaoSus;  
        let okEnvio = false; 
        
        this.setState({
            animating: true            
        });

        setTimeout(() => {
            source.cancel();
        },30000);

       for(let i=0; i<lesoes.length; i++){
            let les = lesoes[i];             
            let dados = new FormData(); 
            let imagens = les.imagens;  
            
            this.setState({andamento: (i+1).toString() + ' de ' + lesoes.length.toString() + '...' }); 

            dados.append('regiao', les.regiao);
            dados.append('diaMaior', les.diaMaior);
            dados.append('diaMenor', les.diaMenor);
            dados.append('diagnostico', les.diagnostico);
            dados.append('procedimento', les.procedimento);
            dados.append('obs', les.obs);

           for (let k=0; k<imagens.length; k++){
                dados.append('imagem', {
                        uri: imagens[k].uri,
                        name: new Date().getTime().toString(),
                        type: 'image/jpg'
                    }            
                );
            }                

            await axios({
                method: 'post', 
                url: urlPost,
                data: dados,
                config: {
                    'Content-Type': 'multipart/form-data',
                    'cancelToken': 'source.token'
                }
            })
            .then(response => {
                console.log(response.status);                  
                okEnvio = true;              
            })
            .catch ( () => this._msgFalhaEnvio() );

        }   

        if (okEnvio){
            this.props.resetarPaciente();
            this.props.resetarCartaoSus();        
            Actions.telaFinal ();        
        } 

        

    }

    render(){
        let lesoesPacientes = [];                       
 
        for (let i=0; i<this.props.pac.lesoes.length; i++){
            let lesao = this.props.pac.lesoes[i];
            let imagensExibir = [];

            for (let k=0; k<lesao.imagens.length; k++){
                imagensExibir.push(<Image key={ lesao.imagens[k].uri } source={ lesao.imagens[k] } style={estilos.imgMiniLesao} />);
            }

            lesoesPacientes.push(
                        <View key={i} style={estilos.dadosLesao}> 
                            <Text style={estilos.pacCampo}> Região: 
                                <Text style={estilos.dadoCampo}> {lesao.regiao.toUpperCase()} </Text>
                            </Text>                

                            <Text style={estilos.pacCampo}> Diâmetro maior (mm): 
                                <Text style={estilos.dadoCampo}> {lesao.diaMaior} </Text>   
                            </Text>                

                            <Text style={estilos.pacCampo}> Diâmetro menor (mm): 
                                <Text style={estilos.dadoCampo}> {lesao.diaMenor} </Text>                    
                            </Text>
                            
                            <Text style={estilos.pacCampo}> Diagnóstico: 
                                <Text style={estilos.dadoCampo}> {lesao.diagnostico.toUpperCase()} </Text>                                               
                            </Text>                

                            <Text style={estilos.pacCampo}> Procedimento:
                                <Text style={estilos.dadoCampo}> {lesao.procedimento.toUpperCase()} </Text>                 
                            </Text>              

                            <Text style={estilos.pacCampo}> Observação:
                                <Text style={estilos.dadoCampo}> {lesao.obs.toUpperCase()} </Text>
                            </Text> 

                            <Text style={estilos.pacCampo}> Imagens: 
                                <Text style={estilos.dadoCampo}> {lesao.imagens.length} </Text>
                            </Text> 
                                <ScrollView contentContainerStyle={estilos.exibirImagens}>                            
                                    {
                                        imagensExibir
                                    }
                                </ScrollView>

                        </View>
            );
        }
        
        return (
            
            <ScrollView style={estilos.tudo} > 
            <View style={estilos.tudoView}>


                <View style={estilos.acima}>                  

                    <Text style={estilos.titulo}> Lesões adicionadas ao paciente: </Text>

                    {
                        lesoesPacientes
                    }
                                     

                </View>

                <View style={estilos.abaixo} >

                    <View style={estilos.botoes}>
                        <BotaoCustomizado comp='FontAwesome' texto='Adicionar nova lesão' tamanho={38}
                            icone='plus' onPress={ Actions.telaAdicionarLesao } altura={75}
                        />
                    </View>

                    <View style={estilos.botoes}>
                        <BotaoCustomizado comp='FontAwesome' texto='Enviar lesões cadastradas' tamanhoFonte={14}
                            icone='send' onPress={ this._iniciaEnvio } tamanho={32} altura={75}
                        />    
                    </View>                    

                </View>   

           
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
                        
                        color="#FFF" />
                        <Text style={estilos.textoGif}> Enviando {this.state.andamento} </Text>
                    </View>
                }  

            </View>

            </ScrollView>
            
        );
    }
}

const estilos = StyleSheet.create({
    tudo: {        
        padding: 10,
        borderWidth: 1,
        borderColor: '#999',
        margin: 7,
               
    },

    tudoView:{
        flex: 1
    },

    acima: {
              
    },

    dadosLesao: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        paddingBottom: 3,
        borderTopColor: 'black',
        borderTopWidth: 1,
        paddingTop: 3,
        marginTop: 7, 
        backgroundColor: '#d9d9d9'         
    },

    titulo:{
        fontSize: 17,        
        fontWeight: 'bold'
    },

    abaixo: {            
        marginTop: 25       
    },

    texto: {
        fontSize: 15,
        fontWeight: '700'       
    },

    imgCadastro: {
        height: 104,
        width: 260,
        marginTop: 20                     
    },

    imgMiniLesao: {
        height: 75,
        width: 75,
        marginRight: 5,
        marginTop: 5
    },
    
    textoImg: {
        fontSize: 15, 
        textAlign: 'center',        
        fontWeight: '700',
        color: '#3596DB',
        marginTop: 15

    },

    botao: {
        marginBottom: 50,
        marginTop: 20,

        ...Platform.select({
            ios: {
                backgroundColor: '#3596DB'                
            }
        })        
    },

    botoes: {
        marginBottom: 25
    },    

    pacCampo: {
        fontSize: 14,        
        fontWeight: 'bold'
        
    },    

    dadoCampo: {
        fontSize: 14,
        fontWeight: 'normal'
    },
    
    exibirImagens: {
        flexDirection: 'row',
        flexWrap: 'wrap'
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
        pac: state.pacienteReducer,
        cartaoSus: state.buscaCartaoSusReducer.cartaoSus,
        lesao: state.lesaoReducer
    }

)

export default connect(mapStateToProps, { resetarPaciente, resetarCartaoSus } )(TelaListarLesoes);