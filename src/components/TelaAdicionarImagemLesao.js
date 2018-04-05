import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableHighlight, Image, StyleSheet, Keyboard, TextInput, Button, Alert, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { ImagePicker, Permissions } from 'expo';

import { adicionarImg, resetarLesao } from '../actions/lesaoActions';
import { adicionarLesaoPac } from '../actions/pacienteActions';

const addImagem = require ('../../img/addImagem.png'); 

class TelaAdicionarImagemLesao extends Component {

    state = {
        image: null,
        image64: null,
        hasCameraPermission: null,
        seguirSemImg: false        
    };

    async componentWillMount(){
        Keyboard.dismiss();
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
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

    msgFormImagem (){
        Alert.alert(
            'Atenção',
            'Você não inseriu a imagem da lesão do paciente. Deseja continuar sem a imagem?',
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
                        <View style={estilos.exibirImagens}>
                            { 
                                imagensExibir 
                            }
                        </View>
                        
                        
                                        

                    </View>              

                </View>


                <View style={estilos.abaixo} >
                    <TouchableHighlight onPress={ this._pickImage } >
                        <View>
                            <Image source={ addImagem } style={ estilos.imgCadastro } />                            
                        </View>
                    </TouchableHighlight>
                </View>  


                <View style={estilos.botao}> 
                    <Button title='Vincular lesão ao paciente' onPress={ this._concluir } 
                        color={Platform.select({ios:'#FFF'})}    
                    />                    
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

    titulo:{
        fontSize: 17,        
        fontWeight: 'bold'
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

    imgCadastro: {
        height: 104,
        width: 260                     
    },

    imgMiniLesao: {
        height: 75,
        width: 75,
        marginRight: 5
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
        flexDirection: 'row'
    }
    

});


const mapStateToProps = state => (
    {
        lesao: state.lesaoReducer        
    }

)

export default connect(mapStateToProps, { adicionarImg, adicionarLesaoPac, resetarLesao })(TelaAdicionarImagemLesao);