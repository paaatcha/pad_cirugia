import React, { Component } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, Keyboard, ActivityIndicator, KeyboardAvoidingView, TouchableHighlight, TextInput, Button, Alert, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import axios, { CancelToken } from 'axios';

import { resetarPaciente } from '../actions/pacienteActions';

import { resetarCartaoSus } from '../actions/buscaCartaoSusActions';

import BotaoCustomizado from './BotaoCustomizado';

import { ImagePicker, Permissions } from 'expo';

import { adicionarLesaoPac } from '../actions/pacienteActions';

class TelaListarLesoes extends Component {
 
    state = {
        url: 'http://192.168.0.150:8080/APIrequisicoes/',
        conectado: false,
        hasCameraPermission: null,
        animating: false,
        andamento: '',            
        lesaoAtual: 0,
        imagemSelecionada: null,
        lesaoSelecionada: null,
        editar: false,
        lesaoEdicao: null
    }    

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
            let les = this.state.lesaoEdicao;
            les.imagens.push(result)
            this.setState({ lesaoEdicao: les });          

          //this.props.adicionarImg(result);
          //console.log(result);
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
            let les = this.state.lesaoEdicao;
            les.imagens.push(result)
            this.setState({ lesaoEdicao: les });              
            
            //this.props.adicionarImg(result);
            //console.log(result);
        }
    };    
    
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

    async ack (){
        let source = CancelToken.source();
        let url = this.state.url + 'ack'
        setTimeout(() => {
            source.cancel();
        },5000);

        console.log('ACK enviar lesoes iniciado')

        await axios.get(url, {cancelToken: source.token})
        .then( response => {  
            console.log('Enviar lesoes conectado na rede');          
            this.setState({conectado: true});
        }) 
        .catch( () => {
            console.log('Enviar lesoes não conectado na rede');
            this._msgFalhaEnvio();
            this.setState({conectado: false});
        });
    }    

    _finalizarAplicacao = async () => {   
        let source = CancelToken.source();
        let lesoes = this.props.pac.lesoes;
        let urlPost = this.state.url + 'paciente/cadastrarLesoes/' + this.props.cartaoSus;  
        let okEnvio = false; 
        
        this.setState({animating: true});

        // VERIFICANDO CONEXÃO COM SERVIDOR
        await this.ack()
        
        
        if (this.state.conectado){

            console.log('INICIANDO ENVIO');

            setTimeout(() => {
                source.cancel();
            },60000);

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
        }

        this.setState({animating: false});

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
        } else if (les == numLes-1){
            this.setState({lesaoAtual: 0});
        }
    }

    _antLesao = () =>{
        les = this.state.lesaoAtual;
        if (les > 0){
            les--;
            this.setState({lesaoAtual: les});
        } else if (les == 0){
            this.setState({lesaoAtual: this.props.pac.lesoes.length-1});
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
    
    _editaLesao = (texto,campo) => {
        let les;
        if (campo === 'regiao'){
            les = this.state.lesaoEdicao;
            les.regiao = texto;
            this.setState({lesaoEdicao: les});
        } else if (campo === 'diaMaior'){
            les = this.state.lesaoEdicao;
            les.diaMaior = texto;
            this.setState({lesaoEdicao: les});
        } else if (campo === 'diaMenor'){
            les = this.state.lesaoEdicao;
            les.diaMenor = texto;
            this.setState({lesaoEdicao: les});
        } else if (campo === 'diag'){
            les = this.state.lesaoEdicao;
            les.diagnostico = texto;
            this.setState({lesaoEdicao: les});
        } else if (campo === 'proc'){
            les = this.state.lesaoEdicao;
            les.procedimento = texto;
            this.setState({lesaoEdicao: les});
        } else if (campo === 'obs'){
            les = this.state.lesaoEdicao;
            les.obs = texto;
            this.setState({lesaoEdicao: les});
        }
    }

    msgFormIncompleto (){
        Alert.alert(
            'Atenção',
            'Todos os campos do formulario devem ser preenchidos, inclusive na edição! ',
            [             
                {text: 'OK', onPress: () => console.log('OK msgFormIncompleto presionado')},
            ],
            { cancelable: false }
        ) 
    }  

    _concluirEdicao = () => {
        let les = this.state.lesaoEdicao;        
        if (les.regiao !== '' && les.diaMaior !== '' && les.diaMaior !=='' && les.diagnostico !== '' && les.procedimento !== ''){
            this.setState({editar: false, lesaoAtual: this.props.pac.lesoes.length-1});
            this.props.pac.lesoes.splice(this.state.lesaoAtual,1)
            this.props.adicionarLesaoPac(les);
        } else {
            this.msgFormIncompleto();
        }
    }


    render(){
        let lesoesPacientes = [];                       
        let todasImagens = [];

        for (let i=0; i<this.props.pac.lesoes.length; i++){
            let lesao = this.props.pac.lesoes[i];
            let imagensLesao = []

            for (let k=0; k<lesao.imagens.length; k++){
                imagensLesao.push(
                    <TouchableHighlight key={lesao.imagens[k].uri}                 
                        onLongPress={() => this.setState({ imagemSelecionada: k})} 
                        style={{marginRight: 5, marginTop: 5, marginBottom: 5}}
                    >
                        <Image source={ lesao.imagens[k] } style={estilos.imgMiniLesao} />

                    </TouchableHighlight>
                );
            }

            todasImagens.push(imagensLesao)
            imagensLesao = []

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

                            <Text style={estilos.titulo2}> Imagens: 
                                <Text style={estilos.dadoCampo}> {lesao.imagens.length} </Text>
                            </Text> 
                                <ScrollView contentContainerStyle={estilos.exibirImagens}>                            
                                    {
                                        todasImagens[i]
                                        //imagensLesao
                                    }
                                </ScrollView>

                            <View style={estilos.viewBotaoEditar}>
                                <View style={{ width: '49%'}}>
                                    <BotaoCustomizado 
                                        comp='FontAwesome' texto='Editar Lesão' tamanho={20} tamanhoFonte={13}
                                        icone='edit' onPress={() => this.setState({ lesaoSelecionada: i, editar: true, lesaoEdicao: this.props.pac.lesoes[i] })} altura={30}
                                        corFundo='#555555' 
                                    />
                                </View>

                                <View style={{ width: '49%'}}>
                                    <BotaoCustomizado 
                                        comp='FontAwesome' texto='Excluir Lesão' tamanho={20} tamanhoFonte={13}
                                        icone='trash-o' onPress={ this._msgRemoverLesao } altura={30}
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
                                    tamanho={22} altura={30} corFundo='#555555' />
                                </View>
                                
                                <View style={{ width: '45%', marginLeft: 10 }}>
                                    <BotaoCustomizado comp='Entypo' texto='Próxima' tamanhoFonte={13}
                                    icone='arrow-bold-right' onPress={this._proxLesao} posIcon='D'
                                    tamanho={22} altura={30} corFundo='#555555' />
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
                                    icone='send' onPress={ this._iniciaEnvio } tamanho={32} altura={75} 
                                    desabilitado={this.props.pac.lesoes.length == 0} corFundo='#00b38f'
                                />    
                            </View>                    

                        </View>                       
  
                    </View> 
                }      

                {
                    this.state.editar && this.state.imagemSelecionada==null &&
                    <KeyboardAvoidingView  behavior='padding'>
                        <Text style={estilos.titulo3}> Editando lesão: </Text>

                        <View style={estilos.quadroEditar}>

                            <View>
                                <Text style={estilos.texto}> Região: </Text>                
                                <TextInput  style={ estilos.inputs } value={this.state.lesaoEdicao.regiao} 
                                    onChangeText={ texto => this._editaLesao(texto,'regiao') }
                                    onSubmitEditing={() => this.diaMaiorRef.focus()} 
                                    blurOnSubmit={false}/> 
                            </View>

                            <View>
                                <Text style={estilos.texto}> Diâmetro maior (mm): </Text>                
                                <TextInput  style={ estilos.inputs} keyboardType='numeric' value={this.state.lesaoEdicao.diaMaior} 
                                    onChangeText={ texto => this._editaLesao(texto,'diaMaior') }
                                    onSubmitEditing={() => this.diaMenorRef.focus()} 
                                    ref={(ref) => this.diaMaiorRef=ref}
                                    blurOnSubmit={false} />    
                            </View>
                            
                            <View>
                                    <Text style={estilos.texto}> Diâmetro menor (mm): </Text>                
                                    <TextInput  style={ estilos.inputs} keyboardType='numeric' value={this.state.lesaoEdicao.diaMenor}  
                                        onChangeText={ texto => this._editaLesao(texto,'diaMenor') }
                                        onSubmitEditing={() => this.diagRef.focus()} 
                                        ref={(ref) => this.diaMenorRef=ref}
                                        blurOnSubmit={false} /> 
                            </View>

                            <View>
                                <Text style={estilos.texto}> Diagnóstico: </Text>                
                                <TextInput  style={ estilos.inputs} value={this.state.lesaoEdicao.diagnostico} 
                                    onChangeText={ texto => this._editaLesao(texto,'diag') }
                                    onSubmitEditing={() => this.procRef.focus()} 
                                    ref={(ref) => this.diagRef=ref}
                                    blurOnSubmit={false} />      
                            </View>

                            <View>
                                <Text style={estilos.texto}> Procedimento: </Text>                
                                <TextInput  style={ estilos.inputs} value={this.state.lesaoEdicao.procedimento} 
                                    onChangeText={ texto => this._editaLesao(texto,'proc') }
                                    onSubmitEditing={() => this.obsRef.focus()} 
                                    ref={(ref) => this.procRef=ref}
                                    blurOnSubmit={false} />    
                            </View>

                            <View>
                                <Text style={estilos.texto}> Observação: </Text>                
                                <TextInput style={ estilos.inputs} value={this.state.lesaoEdicao.obs} 
                                    onChangeText={ texto => this._editaLesao(texto,'obs') }
                                    ref={(ref) => this.obsRef=ref}
                                    blurOnSubmit={false}   
                                    />                                                                                          
                            </View>  

                        </View>    


                        <View style={estilos.quadroEditar}>
                            <Text style={estilos.titulo3}> Imagens: 
                                <Text style={estilos.dadoCampo}> {this.state.lesaoEdicao.imagens.length} </Text>
                            </Text>

                            <ScrollView contentContainerStyle={estilos.exibirImagens}> 
                                                                                             
                                        {                                            
                                            todasImagens[this.state.lesaoAtual]
                                        }
                                    
                                
                            </ScrollView>
                        </View>


                        <View style={{marginTop: 5}}>
                            <View style={estilos.viewBotoesCamera} >
                                <View style={{ width: '49%'}}>
                                    <BotaoCustomizado comp='Entypo' texto='Camera' tamanho={20}
                                        icone='camera' onPress={ this._pickImage } altura={45} tamanhoFonte={14}
                                    />
                                </View>

                                <View style={{ width: '49%'}}>
                                    <BotaoCustomizado  comp='FontAwesome' texto='Album' tamanho={20}
                                        icone='file-photo-o' onPress={ this._pickImageAlbum } altura={45} tamanhoFonte={14}
                                    />
                                </View>
                            </View>

                            <View style={estilos.botoes}>
                                <BotaoCustomizado comp='FontAwesome' texto='Concluir' tamanho={20}
                                    icone='check' onPress={ this._concluirEdicao } altura={45} tamanhoFonte={14}
                                />    
                            </View>
                        </View>

                    </KeyboardAvoidingView>                    
                }

                {
                    this.state.imagemSelecionada !== null && this.state.editar &&                
                    <View style={estilos.viewExcluirImagemEdicao} >
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

    titulo3:{
        fontSize: 17,        
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

    viewExcluirImagemEdicao: {             
        padding: 15,
        backgroundColor: '#d9d9d9',
        justifyContent: 'center',
        alignItems: 'center'               
    },

    imgSelecionada: {
        alignSelf: 'center',
        height: 200,
        width: 200,
    },
     
    verImgEdicao: {          
        paddingBottom: 10,
        paddingTop: 3        
    },

    quadroEditar: {        
        padding:5,
        borderColor: '#999',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 5        
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

export default connect(mapStateToProps, { resetarPaciente, resetarCartaoSus, adicionarLesaoPac } )(TelaListarLesoes);