import React, { Component } from 'react';
import { Text, View, ScrollView, KeyboardAvoidingView, TouchableHighlight, Image, StyleSheet, Keyboard, TextInput, Button, Alert, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { alterarLesaoPac } from '../actions/pacienteActions';

import BotaoCustomizado from './BotaoCustomizado';
    

class TelaEditarLesao extends Component {

    constructor (props){
        super(props);
        this.state = {
            botaoDesabilitar: true,
            imagemSelecionada: null,
            hasCameraPermission: null,
            lesaoEdicao: null,            
            imagem: null,
            isDiag: false, 
            lesSelecionada: null,
            listaDiagCompleta: this.props.listaAutoComp.listaAutoCompDiag,
            listaDiag: []
        }

        this.processaEntradas = this.processaEntradas.bind(this);        
    }

    componentWillMount(){
        Keyboard.dismiss();  
        this.setState({lesaoEdicao: this.props.pac.lesoes[this.props.lesaoEdicao.posLes]});      
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

        this._editaLesao (texto,"diag");

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
        if (this.state.lesaoEdicao.regiao == ''){            
            this.msgFormIncompleto ('Região');
        } else if (this.state.lesaoEdicao.diaMaior == ''){
            this.msgFormIncompleto ('Diâmetro maior');
        } else if (this.state.lelesaoEdicaosao.diaMenor == ''){
            this.msgFormIncompleto ('Diâmetro menor');
        } else if (this.state.lesaoEdicao.diagnostico == ''){
            this.msgFormIncompleto ('Diagnóstico');
        } else if (this.state.lesaoEdicao.procedimento == ''){
            this.msgFormIncompleto ('Procedimento');
        } else {

            this.props.alterarLesaoPac({pos: this.props.lesaoEdicao.posLes, lesao: this.state.lesaoEdicao});


            Actions.telaAdicionarImagemLesao();
        }        
    }

    _editaLesao = (texto,campo) => {
        let les;
        if (campo === 'regiao'){
            les = this.state.lesaoEdicao;
            les.regiao = texto;
            this.setState({lesaoEdicao: les});
        } else if (campo === 'diaMaior'){
            les = this._editaLesaostate.lesaoEdicao;
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



    render(){
        

        // ************ FAZENDO LISTA AUTOCOMPLETAR DE DIAGNOSTICO ***********
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
        // *********************************************************************

        // ***************** PEGANDO LISTA DE IMAGES DA LESAO ******************
        let posLes = this.props.lesaoEdicao.posLes;
        let listaImagens = [];
        let lesao = this.state.lesaoEdicao;

        //lesao = this.props.pac.lesoes[posLes];
        //this.setState({lesaoEdicao: lesao});

        for (let k=0; k<posLes; k++){
            listaImagens.push(
                <TouchableHighlight key={k}                 
                    onLongPress={() => this.setState({ imagemSelecionada: k})} 
                    style={{marginRight: 5, marginTop: 5, marginBottom: 5}}
                >
                    <Image source={ lesao.imagens[k] } style={estilos.imgMiniLesao} />

                </TouchableHighlight>
            );
        }
        
        
        // *********************************************************************

        return (
            
            <ScrollView keyboardShouldPersistTaps='handled'>
                <KeyboardAvoidingView  behavior='padding' style={estilos.tudo}>                                 

                    {
                        this.state.imagemSelecionada == null ?
                        <View>
                            <Text style={estilos.titulo}> Dados da lesão: </Text>

                            <View style={estilos.acima}>                               

                                <View>
                                    <Text style={estilos.texto}> Região: </Text>                
                                    <TextInput  style={ estilos.inputs} value={this.props.lesao.regiao} 
                                        onChangeText={ texto => this._editaLesao(texto,'regiao') }
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
                                        onChangeText={ texto => this._editaLesao(texto,'diaMaior') }
                                        onSubmitEditing={() => this.diaMenorRef.focus()} 
                                        ref={(ref) => this.diaMaiorRef=ref}
                                        blurOnSubmit={false}
                                    />    
                                </View>

                                <View>
                                    <Text style={estilos.texto}> Diâmetro menor (mm): </Text>                
                                    <TextInput  style={ estilos.inputs} keyboardType='numeric' value={this.props.lesao.diaMenor}  
                                        onChangeText={ texto => this._editaLesao(texto,'diaMenor') }
                                        onSubmitEditing={() => this.procRef.focus()} 
                                        ref={(ref) => this.diaMenorRef=ref}
                                        blurOnSubmit={false}
                                    /> 
                                </View>                            

                                <View>
                                    <Text style={estilos.texto}> Procedimento: </Text>                
                                    <TextInput  style={ estilos.inputs} value={this.props.lesao.procedimento} 
                                        onChangeText={ texto => this._editaLesao(texto,'proc') }
                                        onSubmitEditing={() => this.obsRef.focus()} 
                                        ref={(ref) => this.procRef=ref}
                                        blurOnSubmit={false}                            
                                    />    
                                </View>


                                <View>
                                    <Text style={estilos.texto}> Observação: </Text>                
                                    <TextInput style={ estilos.inputs} value={this.props.lesao.obs} 
                                        onChangeText={ texto => this._editaLesao(texto,'obs') }
                                        ref={(ref) => this.obsRef=ref}
                                        blurOnSubmit={false}   
                                        onSubmitEditing={ this.processaEntradas }                         
                                    />                                                                                          
                                </View>
                            </View>
                        
                                
                            <Text style={estilos.titulo}>
                                Imagens: 
                            </Text>

                            <View style={estilos.quadroImagens}>
                                <ScrollView contentContainerStyle={estilos.exibirImagens}> 
                                    {                                            
                                        listaImagens
                                    }                                               
                                </ScrollView>
                            </View>


                            <View style={estilos.abaixo}>
                                    <View style={estilos.viewBotoesCamera} >
                                        <View style={{ width: '49%'}}>
                                            <BotaoCustomizado comp='Entypo' texto='Camera' tamanho={20}
                                                icone='camera' onPress={ () => false } altura={45} tamanhoFonte={14}
                                            />
                                        </View>

                                        <View style={{ width: '49%'}}>
                                            <BotaoCustomizado  comp='FontAwesome' texto='Album' tamanho={20}
                                                icone='file-photo-o' onPress={ () => false } altura={45} tamanhoFonte={14}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <BotaoCustomizado comp='FontAwesome' texto='Concluir' tamanho={20}
                                            icone='check' onPress={ this.processaEntradas } altura={45} tamanhoFonte={14}
                                        />    
                                    </View>
                            </View>
                        </View>

                        :

                        <View style={estilos.viewExcluirImagemEdicao} >
                            <Image source={ lesao.imagens[this.state.imagemSelecionada] } style={estilos.imgSelecionada} />                                
                            
                            <View style={estilos.viewBotoesExcluirImagem} >
                        
                                <View style={{ width: '33%', marginRight: 10 }}>
                                
                                    <BotaoCustomizado comp='MaterialIcons' texto='Excluir' tamanhoFonte={10}
                                    icone='delete' onPress={ () => false } 
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
        flex: 5,
        padding:5,
        borderColor: '#000',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 10 
    },

    quadroImagens:{
        padding:5,
        borderColor: '#000',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 5 
    },

    abaixo: {  
        flex: 1,                      
        marginTop: 15,
        marginBottom: 25
    },

    viewExcluirImagemEdicao: {             
        padding: 15,
        backgroundColor: '#d9d9d9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25

    },

    viewBotoesExcluirImagem: {
        flexDirection: 'row', 
        marginTop: 15, 
        justifyContent: 'center'
    },

    imgSelecionada: {
        alignSelf: 'center',
        height: 200,
        width: 200,
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

    titulo:{
        fontSize: 17,        
        fontWeight: 'bold',
        color: '#074fc1'
    },

    viewBotoesCamera: {
        flexDirection: 'row',         
        justifyContent: 'space-between',
        marginBottom: 10        
    },

    imgMiniLesao: {
        height: 75,
        width: 75,
        backgroundColor: '#d9d9d9'           
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
        pac: state.pacienteReducer,
        lesaoEdicao: state.lesaoEdicaoReducer,
        listaAutoComp: state.listasAutoCompReducer
    }

)

export default connect(mapStateToProps, { alterarLesaoPac })(TelaEditarLesao);