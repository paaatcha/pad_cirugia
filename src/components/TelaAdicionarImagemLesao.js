import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableHighlight, Image, StyleSheet, Keyboard, KeyboardAvoidingView, TextInput, Button, Alert, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { ImagePicker, Permissions } from 'expo';

import { adicionarLesaoPac } from '../actions/pacienteActions';

import { alterarRegiao, alterarDiaMaior, alterarDiaMenor, resetarLesao,
    alterarDiagnostico, alterarProcedimento, alterarObs, adicionarImg } from '../actions/lesaoActions';

import BotaoCustomizado from './BotaoCustomizado';


class TelaAdicionarImagemLesao extends Component {

    state = {
        image: null,
        image64: null,
        hasCameraPermission: null,
        seguirSemImg: false,
        imagemSelecionada: null,
        editar: false        
    };

    async componentWillMount(){
        Keyboard.dismiss();
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { status2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted' && status2 === 'granted'});
    }

    _pickImage = async () => {
        // CHECAR QUESTÃO DA PERMISSÃO
        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 4],
          base64: false,
          quality: 1
        });
    
        //console.log(result);
    
        if (!result.cancelled) {
          this.setState({ image: result.uri });
          this.setState({ image64: result.base64 });

          this.props.adicionarImg(result);
          console.log(result);
        }
    }; 

    _pickImageAlbum = async () => {
        // CHECAR QUESTÃO DA PERMISSÃO
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 4],
            base64: false,
            quality: 1,
            exif: true,
        });

        //console.log(result);
        if (!result.cancelled) {
            this.setState({ image: result.uri });
            this.setState({ image64: result.base64 });
  
            this.props.adicionarImg(result);
            //console.log(result);
        }
    };    

    msgFormImagem (){
        Alert.alert(
            'Atenção',
            'Você não inseriu a imagem da lesão do paciente. Apesar de não ser obrigatório é altamente desejável a inclusão da imagem. Deseja continuar sem a imagem?',
            [             
                {text: 'Sim', onPress: () => {
                        this.props.adicionarLesaoPac(this.props.lesao);
                        this.props.resetarLesao();
                        Actions.telaListarLesoes();
                    }
                },
                {text: 'Não', onPress: () => console.log('Não msgFormImg pressionado')},
            ],
            { cancelable: false }
        )         
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
    
    _concluir = () => {
        if (this.props.lesao.imagens.length == 0){
            this.msgFormImagem();
        } else {
            this.props.adicionarLesaoPac(this.props.lesao);
            this.props.resetarLesao();
            Actions.telaListarLesoes();
        }        
    }

    _selecionarImagem (i) {
        this.setState({ imagemSelecionada: i});
    }

    _removerImagem (){
        this.props.lesao.imagens.splice(this.state.imagemSelecionada,1);
        this.setState({imagemSelecionada: null});
    }

    _processaEdicao(){
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
            this.setState({editar: false})
        }        
    }    

    render(){
        let { image } = this.state;
        let { image64 } = this.state;
        let imagensExibir = [];

        for (let i=0; i<this.props.lesao.imagens.length; i++){
            imagensExibir.push(
                <TouchableHighlight key={this.props.lesao.imagens[i].uri} onLongPress={() => this._selecionarImagem(i)} style={{marginRight: 5}}>
                    
                    <Image source={ this.props.lesao.imagens[i] } style={estilos.imgMiniLesao} />
                    
                
                </TouchableHighlight>

            );
        }


        return (
            
            <ScrollView style={estilos.tudo} >                                
                 
                <ScrollView>
                
                    {
                        !this.state.editar ?
                        <Text style={estilos.titulo}> Dados da lesão </Text>
                        :
                        <Text style={estilos.titulo}> Editando lesão </Text>
                    }
                    
                    <View style={estilos.dadosLesao}> 
                    { 
                        !this.state.editar && 
                        <View>
                            <Text style={estilos.pacCampo}> Região: 
                                <Text style={estilos.dadoCampo}> {this.props.lesao.regiao.toUpperCase()} </Text>
                            </Text>                

                            <Text style={estilos.pacCampo}> Diâmetro maior (mm): 
                                <Text style={estilos.dadoCampo}> {this.props.lesao.diaMaior} </Text>   
                            </Text>                

                            <Text style={estilos.pacCampo}> Diâmetro menor (mm): 
                                <Text style={estilos.dadoCampo}> {this.props.lesao.diaMenor} </Text>                    
                            </Text>
                            
                            <Text style={estilos.pacCampo}> Diagnóstico: 
                                <Text style={estilos.dadoCampo}> {this.props.lesao.diagnostico.toUpperCase()} </Text>                                               
                            </Text>                

                            <Text style={estilos.pacCampo}> Procedimento:
                                <Text style={estilos.dadoCampo}> {this.props.lesao.procedimento.toUpperCase()} </Text>                 
                            </Text>              

                            <Text style={estilos.pacCampo}> Observação:
                                <Text style={estilos.dadoCampo}> {this.props.lesao.obs.toUpperCase()} </Text>
                            </Text>  

                            <Text style={estilos.pacCampo}> Imagens: 
                                <Text style={estilos.dadoCampo}> {this.props.lesao.imagens.length} </Text>
                            </Text>  

                            <ScrollView contentContainerStyle={estilos.exibirImagens}>
                                {                                
                                    imagensExibir 
                                }
                            </ScrollView> 

                            <View style={{marginTop: 0, padding: 5}}>
                                <BotaoCustomizado 
                                    comp='FontAwesome' texto='Editar' tamanho={20} tamanhoFonte={13}
                                    icone='edit' onPress={() => this.setState({ editar: true })} altura={28}
                                    corFundo='#999999' cor='#000' 
                                />
                            </View>

                        </View>
                        
                        }

                        {
                            this.state.imagemSelecionada !== null && 
                            <View style={estilos.excluirImagem} >
                                <Image source={ this.props.lesao.imagens[this.state.imagemSelecionada] } style={estilos.imgSelecionada} />                                
                                
                                <View style={estilos.viewBotoesExcluirImagem} >
                            
                                    <View style={{ width: '33%', marginRight: 10 }}>
                                    
                                        <BotaoCustomizado comp='MaterialIcons' texto='Excluir' tamanhoFonte={10}
                                        icone='delete' onPress={() => this._removerImagem()}
                                        tamanho={25} altura={30} />
                                    </View>
                                    
                                    <View style={{ width: '33%', marginLeft: 10 }}>
                                        <BotaoCustomizado comp='FontAwesome' texto='Cancelar' tamanhoFonte={10}
                                        icone='close' onPress={() => this.setState({ imagemSelecionada: null })}
                                        tamanho={25} altura={30} />
                                    </View>
                                </View>                        
                            </View>
                        }

                        {
                            this.state.editar &&
                            <ScrollView keyboardShouldPersistTaps='handled'>
                                
                                <KeyboardAvoidingView  behavior='padding'>
                                    <View>
                                        <Text style={estilos.texto}> Região: </Text>                
                                        <TextInput  style={ estilos.inputs} value={this.props.lesao.regiao} 
                                            onChangeText={ texto => this.props.alterarRegiao(texto) }
                                            onSubmitEditing={() => this.diaMaiorRef.focus()} 
                                            blurOnSubmit={false}/> 
                                    </View>

                                    <View>
                                        <Text style={estilos.texto}> Diâmetro maior (mm): </Text>                
                                        <TextInput  style={ estilos.inputs} keyboardType='numeric' value={this.props.lesao.diaMaior} 
                                            onChangeText={ texto => this.props.alterarDiaMaior(texto) }
                                            onSubmitEditing={() => this.diaMenorRef.focus()} 
                                            ref={(ref) => this.diaMaiorRef=ref}
                                            blurOnSubmit={false} />    
                                    </View>

                                    <View>
                                        <Text style={estilos.texto}> Diâmetro menor (mm): </Text>                
                                        <TextInput  style={ estilos.inputs} keyboardType='numeric' value={this.props.lesao.diaMenor}  
                                            onChangeText={ texto => this.props.alterarDiaMenor(texto) }
                                            onSubmitEditing={() => this.diagRef.focus()} 
                                            ref={(ref) => this.diaMenorRef=ref}
                                            blurOnSubmit={false} /> 
                                    </View>

                                    <View>
                                        <Text style={estilos.texto}> Diagnóstico: </Text>                
                                        <TextInput  style={ estilos.inputs} value={this.props.lesao.diagnostico} 
                                            onChangeText={ texto => this.props.alterarDiagnostico(texto) }
                                            onSubmitEditing={() => this.procRef.focus()} 
                                            ref={(ref) => this.diagRef=ref}
                                            blurOnSubmit={false} />      
                                    </View>

                                    <View>
                                        <Text style={estilos.texto}> Procedimento: </Text>                
                                        <TextInput  style={ estilos.inputs} value={this.props.lesao.procedimento} 
                                            onChangeText={ texto => this.props.alterarProcedimento(texto) }
                                            onSubmitEditing={() => this.obsRef.focus()} 
                                            ref={(ref) => this.procRef=ref}
                                            blurOnSubmit={false} />    
                                    </View>

                                    <View>
                                        <Text style={estilos.texto}> Observação: </Text>                
                                        <TextInput style={ estilos.inputs} value={this.props.lesao.obs} 
                                            onChangeText={ texto => this.props.alterarObs(texto) }
                                            ref={(ref) => this.obsRef=ref}
                                            blurOnSubmit={false}   
                                            onSubmitEditing={ () => this._processaEdicao() } />                                                                                          
                                    </View>
                                    
                                </KeyboardAvoidingView>
                                
                            </ScrollView>

                        }                                       

                    </View>              

                </ScrollView>
                
                {
                    !this.state.editar ?
                        <View style={estilos.abaixo} >

                            <View style={estilos.botoes}>
                                <BotaoCustomizado comp='Entypo' texto='Tirar foto' tamanho={20}
                                    icone='camera' onPress={ this._pickImage } altura={45} tamanhoFonte={15}
                                />
                            </View>

                            <View style={estilos.botoes}>
                                <BotaoCustomizado  comp='FontAwesome' texto='Selecionar do álbum' tamanho={20}
                                    icone='file-photo-o' onPress={this._pickImageAlbum} altura={45} tamanhoFonte={15}
                                />
                            </View>

                            <View style={estilos.botoes}>
                                <BotaoCustomizado comp='MaterialIcons' texto='Vincular lesão ao paciente' tamanho={20}
                                    icone='attach-file' onPress={ this._concluir } altura={45} tamanhoFonte={15}
                                />    
                            </View>
                        </View>  
                    :
                    <View style={estilos.viewBotoesExcluirImagem} >                            
                        <View style={{ width: '40%', marginRight: 10 }}>
                        
                            <BotaoCustomizado comp='FontAwesome' texto='Concluir' tamanhoFonte={13}
                            icone='check' onPress={() => this._processaEdicao()}
                            tamanho={25} altura={30} />
                        </View>
                        
                        <View style={{ width: '40%', marginLeft: 10 }}>
                            <BotaoCustomizado comp='FontAwesome' texto='Cancelar' tamanhoFonte={13}
                            icone='close' onPress={() => this.setState({ editar: false })}
                            tamanho={25} altura={30} />
                        </View>
                    </View>                     

                }
                
                
                
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

    dadosLesao: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        paddingBottom: 3,
        borderTopColor: 'black',
        borderTopWidth: 1,
        paddingTop: 3,
        backgroundColor: '#d9d9d9'
    },
   
    imgSelecionada: {
        alignSelf: 'center',
        height: 200,
        width: 200,
    },    

    botoes: {
        marginBottom: 25
    },

    titulo:{
        fontSize: 17,        
        fontWeight: 'bold'
    },

    abaixo: {            
        marginTop: 40,       
    },

    texto: {
        fontSize: 15,
        fontWeight: '700'       
    },

    imgCadastro: {
        height: 104,
        width: 260                     
    },

    imgMiniLesao: {
        height: 75,
        width: 75,
        backgroundColor: '#d9d9d9'
            
    },
    
    textoImg: {
        fontSize: 14, 
        textAlign: 'center',        
        fontWeight: '700',
        color: '#3596DB'

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
        padding: 5        
    },

    excluirImagem: {
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
    },    
    

});


const mapStateToProps = state => ( 
    {
        lesao: state.lesaoReducer        
    }

)

export default connect(mapStateToProps, { adicionarImg, adicionarLesaoPac, resetarLesao,
                                        alterarRegiao, alterarDiaMaior, alterarDiaMenor, 
                                        alterarDiagnostico, alterarProcedimento, alterarObs })(TelaAdicionarImagemLesao);