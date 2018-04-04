import React, { Component } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, TouchableHighlight, TextInput, Button, Alert, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import axios from 'axios';

import { resetarPaciente } from '../actions/pacienteActions';

import { resetarCartaoSus } from '../actions/buscaCartaoSusActions';

const addLesao = require ('../../img/addLesao.png');



class TelaListarLesoes extends Component {
 

    _finalizarAplicacao = async () => {  
        /*
        let urlPost = 'http://172.20.75.18:8080//APIrequisicoes/paciente/cadastrarLesoes/' + '111-1111-1111-1111' 
        var dados = new FormData ();
        const img = {
            uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Ftemplate-0a5e87fa-fe7b-444e-9946-3df15ba9ab93/ImagePicker/16c6db34-b872-4813-95ba-175c0ed1a7c7.jpg',
            name: 'imagem.jpg',
            type: 'image/jpg'
        }

        const img2 = {
            uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Ftemplate-0a5e87fa-fe7b-444e-9946-3df15ba9ab93/ImagePicker/16c6db34-b872-4813-95ba-175c0ed1a7c7.jpg',
            name: 'imagem.jpg',
            type: 'image/jpg'
        }        

        dados.append('nome', 'Fulano');
        dados.append('imagem', img);  
        dados.append('imagem', img2); 
        */

        let lesoes = this.props.pac.lesoes;
        let urlPost = 'http://172.20.75.18:8080//APIrequisicoes/paciente/cadastrarLesoes/' + this.props.cartaoSus;  
               

       for(let i=0; i<lesoes.length; i++){
            let les = lesoes[i];             
            let dados = new FormData(); 
            let imagens = les.imagens;   

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
                config: {'Content-Type': 'multipart/form-data'}
            })
            .then(response => {
                console.log(response.status);                
            })
            .catch (response => console.log('Deu ruim'));

        }   


        this.props.resetarPaciente();
        this.props.resetarCartaoSus();        
        Actions.telaFinal ();


        

    }

    render(){
        let lesoesPacientes = [];                        

        for (let i=0; i<this.props.pac.lesoes.length; i++){
            let lesao = this.props.pac.lesoes[i];
            let imagensExibir = [];

            for (let i=0; i<lesao.imagens.length; i++){
                imagensExibir.push(<Image key={ lesao.imagens[i].uri } source={ lesao.imagens[i] } style={estilos.imgMiniLesao} />);
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
                                <View style={estilos.exibirImagens}>                            
                                    {
                                        imagensExibir
                                    }
                                </View>

                        </View>
            );
        }
        
        return (
            
            <ScrollView style={estilos.tudo} >                
                 
                <View style={estilos.acima}>

                    <Text style={estilos.titulo}> Lesões do paciente </Text>

                    {
                        lesoesPacientes
                    }
                                     

                </View>

                <View style={estilos.abaixo} >
                    <TouchableHighlight onPress={ Actions.telaAdicionarLesao } >
                        <View>
                            <Image source={ addLesao } style={ estilos.imgCadastro } />
                            <Text style={ estilos.textoImg }> Adicionar nova lesão </Text> 
                        </View>
                    </TouchableHighlight>
                </View>             

                    <View style={estilos.botao}> 
                        <Button title='Finalizar' onPress={ this._finalizarAplicacao } color={Platform.select({ios:'#FFF'})} />                    
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

    dadosLesao: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        paddingBottom: 3,
        borderTopColor: 'black',
        borderTopWidth: 1,
        paddingTop: 3,
        marginTop: 2, 
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
        height: 150,
        width: 150                     
    },

    imgMiniLesao: {
        height: 75,
        width: 75,
        marginRight: 5
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
        pac: state.pacienteReducer,
        cartaoSus: state.buscaCartaoSusReducer.cartaoSus,
        lesao: state.lesaoReducer
    }

)

export default connect(mapStateToProps, { resetarPaciente, resetarCartaoSus } )(TelaListarLesoes);