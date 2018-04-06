import React, { Component } from 'react';
import { Text, View, TouchableHighlight, StyleSheet} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, Entypo, FontAwesome, Octicons} from '@expo/vector-icons';

export default BotaoCustomizado = (props) => {

    
        //this.props.funcaoOnpress
        let cor = props.cor || '#FFF';
        let altura = props.altura || 40;
        let tamanho = props.tamanho || 40;
        let tamanhoFonte = props.tamanhoFonte || 16;
        let desabilitado = props.desabilitado || false;
        let compMaterial = props.comp == 'MaterialCommunityIcons';
        let compIonicons = props.comp == 'Ionicons';
        let compMaterialIcons = props.comp == 'MaterialIcons';
        let compEntypo = props.comp == 'Entypo';
        let compFontAwesome = props.comp == 'FontAwesome';   
        let compOcticons = props.comp == 'Octicons';
        
        return(
            <TouchableHighlight onPress={ props.onPress } disabled={ desabilitado }>
                <View style={
                        {
                            flexDirection: 'row',              
                            alignItems: 'center',
                            backgroundColor: desabilitado ? '#CCC' : '#4d79ff',
                            height: altura,
                            borderRadius: 5
                        }                    
                }>                   
                    
                    {
                        compMaterial &&
                        <MaterialCommunityIcons name={props.icone} size={tamanho} 
                            color={cor} style={estilos.icone}
                        />                                
                    }

                    {
                        compIonicons &&
                        <MaterialCommunityIcons name={props.icone} size={tamanho} 
                            color={cor} style={estilos.icone}
                        />                                
                    }       

                    {
                        compMaterialIcons &&
                        <MaterialIcons name={props.icone} size={tamanho} 
                            color={cor} style={estilos.icone}
                        />                                
                    }    

                    {
                        compEntypo &&
                        <Entypo name={props.icone} size={tamanho} 
                            color={cor} style={estilos.icone}
                        />                                
                    }

                    {
                        compFontAwesome &&
                        <FontAwesome name={props.icone} size={tamanho} 
                            color={cor} style={estilos.icone}
                        />                                
                    }

                    {
                        compOcticons &&
                        <Octicons name={props.icone} size={tamanho} 
                            color={cor} style={estilos.icone}
                        />                                
                    }                                                       

                    <Text style={
                        {
                            fontSize: tamanhoFonte,
                            color: cor,
                            flex: 1,
                            textAlign: 'center',        
                            fontWeight: 'bold'  
                        }
                    } >
                    
                        {props.texto.toUpperCase()} 
                     
                    </Text>
                </View>
            </TouchableHighlight>
        );
    
}

const estilos = StyleSheet.create({
    
    botaoIcon: {
        flexDirection: 'row',              
        alignItems: 'center',
        backgroundColor: '#4d79ff',
        height: 40,
        borderRadius: 5
        
    },   

    txtBotao: {
        fontSize: 18,
        color: '#FFF',
        flex: 1,
        textAlign: 'center',        
        fontWeight: 'bold'        
    },
    
    icone: {
        //position: 'absolute',
        //left: 10,
        top: 1,
        left: 10
    }

});