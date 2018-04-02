import React, { Component } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, TouchableHighlight, TextInput, Button, Alert} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

const addLesao = require ('../../img/addLesao.png');

class TelaListarLesoes extends Component {

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

                            <Text style={estilos.pacCampo}> Imagens: </Text> 
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
                        <Button title='Finalizar' onPress={ () => false } />                    
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
        marginTop: 2         
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
        fontSize: 14, 
        textAlign: 'center',        
        fontWeight: '700',
        color: '#3596DB'

    },

    botao: {
        marginBottom: 50,
        marginTop: 20
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
        pac: state.pacienteReducer
    }

)

export default connect(mapStateToProps, null)(TelaListarLesoes);