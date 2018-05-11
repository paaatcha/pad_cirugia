import React, { Component } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, ActivityIndicator, KeyboardAvoidingView, TouchableHighlight, TextInput, Button, Alert, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import axios, { CancelToken } from 'axios';

import { resetarPaciente } from '../actions/pacienteActions';

import { resetarCartaoSus } from '../actions/buscaCartaoSusActions';

import BotaoCustomizado from './BotaoCustomizado';


class TelaListarLesoes extends Component {
 
    state = {
        animating: false,
        andamento: '',    
        lesoesPacientes: [],
        imagesLesao: [],
        lesaoAtual: 0,
        imagemSelecionada: null,
        lesaoSelecionada: null,
        edicao: false,
        regiao: ''
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

    _proxLesao = () =>{
        numLes = this.props.pac.lesoes.length;
        les = this.state.lesaoAtual;
        if (les < numLes-1){
            les++;
            this.setState({lesaoAtual: les});
        }
    }

    _antLesao = () =>{
        les = this.state.lesaoAtual;
        if (les > 0){
            les--;
            this.setState({lesaoAtual: les});
        }
    }

    _removerImagem = () => {
        this.props.pac.lesoes[this.state.lesaoAtual].imagens.splice(this.state.imagemSelecionada,1);
        this.setState({imagemSelecionada: null});
    }

    _removerLesao = () => {
        this.props.pac.lesoes.splice(this.state.lesaoAtual,1);
        this.setState({lesaoAtual: 0});
    }

    _msgRemoverLesao = () => {
        Alert.alert(
            'Removendo lesão',
            'Tem certeza que deseja remover essa lesão?',
            [             
                {text: 'Sim', onPress: this._removerLesao },
                {text: 'Não', onPress: () => console.log("Remocao cancelada") },
            ],
            { cancelable: false }
        )  
    } 
    
    _altRegiao = (texto) => {
        les = this.state.lesaoEdicao
        les.regiao = texto
        this.setState({lesaoEdicao: les})
    }

    render(){
        let lesoesPacientes = [];                       
 
        for (let i=0; i<this.props.pac.lesoes.length; i++){
            let lesao = this.props.pac.lesoes[i];
            let imagensExibir = [];

            for (let k=0; k<lesao.imagens.length; k++){
                imagensExibir.push(
                    <TouchableHighlight key={lesao.imagens[k].uri}                 
                        onLongPress={() => this.setState({ imagemSelecionada: k})} 
                        style={{marginRight: 5, marginTop: 5, marginBottom: 5}}
                    >
                        <Image source={ lesao.imagens[k] } style={estilos.imgMiniLesao} />

                    </TouchableHighlight>
                );
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

                            <View style={estilos.viewBotaoEditar}>
                                <View style={{ width: '49%'}}>
                                    <BotaoCustomizado 
                                        comp='FontAwesome' texto='Editar Lesão' tamanho={20} tamanhoFonte={13}
                                        icone='edit' onPress={() => this.setState({ lesaoSelecionada: i, editar: true })} altura={28}
                                        corFundo='#999999' 
                                    />
                                </View>

                                <View style={{ width: '49%'}}>
                                    <BotaoCustomizado 
                                        comp='FontAwesome' texto='Excluir Lesão' tamanho={20} tamanhoFonte={13}
                                        icone='trash-o' onPress={ this._msgRemoverLesao } altura={28}
                                        corFundo='#d10202' 
                                    />
                                </View>                                 
                            </View>

                            {
                                this.state.imagemSelecionada !== null &&
                            
                                <View style={estilos.viewExcluirImagem} >
                                    <Image source={ this.props.pac.lesoes[this.state.lesaoAtual].imagens[this.state.imagemSelecionada] } style={estilos.imgSelecionada} />                                
                                    
                                    <View style={estilos.viewBotoesExcluirImagem} >
                                
                                        <View style={{ width: '33%', marginRight: 10 }}>
                                        
                                            <BotaoCustomizado comp='MaterialIcons' texto='Excluir' tamanhoFonte={10}
                                            icone='delete' onPress={ this._removerImagem } 
                                            tamanho={25} altura={30} corFundo='#d10202'/>
                                        </View>
                                        
                                        <View style={{ width: '33%', marginLeft: 10 }}>
                                            <BotaoCustomizado comp='FontAwesome' texto='Cancelar' tamanhoFonte={10}
                                            icone='close' onPress={() => this.setState({ imagemSelecionada: null })}
                                            tamanho={25} altura={30} />
                                        </View>
                                    </View>                        
                                </View>
                            }   
                            

                        </View>
            );
        }

        let reg;
        if (this.state.editar){
            reg = this.props.pac.lesoes[this.state.lesaoAtual].regiao;
            //this.setState({regiao: reg});
            //console.log(this.state.regiao);
        }
        
        return (
            
            <ScrollView style={estilos.tudo} keyboardShouldPersistTaps='handled'> 
                {
                    !this.state.editar &&
                    <View>                                           

                        {
                            this.props.pac.lesoes.length > 0 ?
                            <View>
                                <Text style={estilos.titulo}> Lesões adicionadas ao paciente: 
                                    <Text style={estilos.dadoCampo}> {this.props.pac.lesoes.length} </Text>
                                </Text>                        
                                <Text style={estilos.titulo2}> Exibindo lesão:
                                    <Text style={estilos.dadoCampo}> {this.state.lesaoAtual+1} </Text>
                                </Text>
                            </View>
                            :
                            <View>
                                <Text style={estilos.titulo}> NENHUMA LESÃO ADICIONADA </Text>
                                <Text style={estilos.msgTexto}> Você deve ter apagado todas as lesões. Adicione alguma lesão para continuar </Text>
                            </View>
                        }

                        {
                            lesoesPacientes[this.state.lesaoAtual]
                        }

                        {
                            this.state.imagemSelecionada == null && this.props.pac.lesoes.length > 0 &&                        
                            <View style={estilos.viewBotoesVerLesoes} >                            
                                <View style={{ width: '45%', marginRight: 10 }}>
                                
                                    <BotaoCustomizado comp='Entypo' texto='Anterior' tamanhoFonte={13}
                                    icone='arrow-bold-left' onPress={this._antLesao}
                                    tamanho={22} altura={30} corFundo='#999999' />
                                </View>
                                
                                <View style={{ width: '45%', marginLeft: 10 }}>
                                    <BotaoCustomizado comp='Entypo' texto='Próxima' tamanhoFonte={13}
                                    icone='arrow-bold-right' onPress={this._proxLesao} posIcon='D'
                                    tamanho={22} altura={30} corFundo='#999999' />
                                </View>
                            </View>
                        }


                        <View style={estilos.abaixo} >

                            <View style={estilos.botoes}>
                                <BotaoCustomizado comp='FontAwesome' texto='Adicionar nova lesão' tamanho={38}
                                    icone='plus' onPress={ Actions.telaAdicionarLesao } altura={75}
                                />
                            </View>

                            <View style={estilos.botoes}>
                                <BotaoCustomizado comp='FontAwesome' texto='Enviar lesões cadastradas' tamanhoFonte={14}
                                    icone='send' onPress={ this._iniciaEnvio } tamanho={32} altura={75} desabilitado={this.props.pac.lesoes.length == 0}
                                />    
                            </View>                    

                        </View>                       
  
                    </View> 
                }      

                {
                    this.state.editar &&
                    <KeyboardAvoidingView  behavior='padding'>
                        <Text style={estilos.titulo}> Editando lesão: 
                            <Text style={estilos.dadoCampo}> {this.state.lesaoSelecionada} </Text>
                        </Text>

                        {
                        <View>
                            <Text style={estilos.texto}> Região: </Text>                
                            <TextInput  style={ estilos.inputs} value={reg} 
                                
                                
                                blurOnSubmit={false}
                            /> 
                        </View>
                        }



                        <View >

                            <View style={estilos.viewBotoesCamera} >
                                <View style={{ width: '49%'}}>
                                    <BotaoCustomizado comp='Entypo' texto='Camera' tamanho={20}
                                        icone='camera' onPress={ () => false } altura={45} tamanhoFonte={14}
                                    />
                                </View>

                                <View style={{ width: '49%'}}>
                                    <BotaoCustomizado  comp='FontAwesome' texto='Albúm' tamanho={20}
                                        icone='file-photo-o' onPress={() => false} altura={45} tamanhoFonte={14}
                                    />
                                </View>
                            </View>

                            <View style={estilos.botoes}>
                                <BotaoCustomizado comp='FontAwesome' texto='Concluir' tamanho={20}
                                    icone='check' onPress={ () => this.setState({editar: false}) } altura={45} tamanhoFonte={14}
                                />    
                            </View>
                        </View>

                    </KeyboardAvoidingView>                    
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
                        
                        color="#FFF" />
                        <Text style={estilos.textoGif}> Enviando {this.state.andamento} </Text>
                    </View>
                }                           
 
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

    titulo2:{
        fontSize: 14,        
        fontWeight: 'bold',
        color: '#074fc1'
    },    

    msgTexto:{
        fontSize: 16,                
        color: '#074fc1',
        textAlign: 'center',
        marginTop: 15
    },

    abaixo: {            
        marginTop: 20       
    },

    texto: {
        fontSize: 15,
        fontWeight: '700'       
    },

    viewBotoesCamera: {
        flexDirection: 'row',         
        justifyContent: 'space-between',
        marginBottom: 15        
    },

    imgCadastro: {
        height: 104,
        width: 260,
        marginTop: 20                     
    },

    imgMiniLesao: {
        height: 75,
        width: 75,
        backgroundColor: '#d9d9d9'           
    },
    
    textoImg: {
        fontSize: 15, 
        textAlign: 'center',        
        fontWeight: '700',
        color: '#3596DB',
        marginTop: 15

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
        flexWrap: 'wrap',
        paddingLeft: 3
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
    },

    viewBotoesVerLesoes: {
        flexDirection: 'row', 
        marginTop: 5, 
        marginBottom: 5,
        justifyContent: 'space-between',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        paddingBottom: 3,
        paddingRight: 5,
        paddingLeft: 5
    },

    viewBotaoEditar:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 0,
        padding: 5,
        borderTopColor: 'black',
        borderTopWidth: 1,
        paddingBottom: 3,
        backgroundColor: '#d9d9d9'
    },   

    viewExcluirImagem: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 10,
        position: 'absolute',
        backgroundColor: '#d9d9d9',
        justifyContent: 'center',
        alignItems: 'center'               
    },

    imgSelecionada: {
        alignSelf: 'center',
        height: 200,
        width: 200,
    },
    
    viewBotoesExcluirImagem: {
        flexDirection: 'row', 
        marginTop: 15, 
        justifyContent: 'center'
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