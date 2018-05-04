import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableHighlight, Image, StyleSheet, Keyboard, TextInput, Button, Alert, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { ImagePicker, Permissions } from 'expo';

import { adicionarImg, resetarLesao } from '../actions/lesaoActions';
import { adicionarLesaoPac } from '../actions/pacienteActions';

import BotaoCustomizado from './BotaoCustomizado';


class TelaAdicionarImagemLesao extends Component {

    state = {
        image: null,
        image64: null,
        hasCameraPermission: null,
        seguirSemImg: false,
        imagemSelecionada: null        
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
    
    _concluir = () => {
        if (this.props.lesao.imagens.length == 0){
            this.msgFormImagem();
        } else {
            this.props.adicionarLesaoPac(this.props.lesao);
            this.props.resetarLesao();
            Actions.telaListarLesoes();
        }        
    }

    render(){
        let { image } = this.state;
        let { image64 } = this.state;
        let imagensExibir = [];

        for (let i=0; i<this.props.lesao.imagens.length; i++){
            imagensExibir.push(<Image key={ this.props.lesao.imagens[i].uri } source={ this.props.lesao.imagens[i] } style={estilos.imgMiniLesao} />);
        }


        return (
            
            <ScrollView style={estilos.tudo} >                                
                 
                 <View style={estilos.acima}>

                    <Text style={estilos.titulo}> Dados da lesão </Text>

                    <View style={estilos.dadosLesao}> 

                        
                        <BotaoCustomizado 
                            comp='FontAwesome' texto='  ' tamanho={60} tamanhoFonte={10}
                            icone='edit' onPress={Actions.telaAdicionarLesao} altura={60}
                            corFundo='#d9d9d9' cor='#000'
                        />
                        

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
                        
                        
                                        

                    </View>              

                </View>


                <View style={estilos.abaixo} >

                    <View style={estilos.botoes}>
                        <BotaoCustomizado comp='Entypo' texto='Tirar foto' tamanho={38}
                            icone='camera' onPress={ this._pickImage } altura={75}
                        />
                    </View>

                    <View style={estilos.botoes}>
                        <BotaoCustomizado  comp='FontAwesome' texto='Selecionar do álbum' tamanho={38}
                            icone='file-photo-o' onPress={this._pickImageAlbum} altura={75}
                        />
                    </View>

                    <View style={estilos.botoes}>
                        <BotaoCustomizado comp='MaterialIcons' texto='Vincular lesão ao paciente' tamanhoFonte={12}
                            icone='attach-file' onPress={ this._concluir } tamanho={32} altura={75}
                        />    
                    </View>


                </View>       
                
                
                
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
        flex: 1       
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
        marginRight: 5,
        marginTop: 5
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
        flexWrap: 'wrap'
    }
    

});


const mapStateToProps = state => (
    {
        lesao: state.lesaoReducer        
    }

)

export default connect(mapStateToProps, { adicionarImg, adicionarLesaoPac, resetarLesao })(TelaAdicionarImagemLesao);