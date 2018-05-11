import React, { Component } from 'react';
import { Text, View, TouchableHighlight, StyleSheet} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, Entypo, FontAwesome, Octicons} from '@expo/vector-icons';

export default BotaoCustomizado = (props) => {

    
        //this.props.funcaoOnpress
        let cor = props.cor || '#FFF';
        let corFundo = props.corFundo || '#4d79ff';
        let altura = props.altura || 40;
        let tamanho = props.tamanho || 40;
        let tamanhoFonte = props.tamanhoFonte || 16;
        let desabilitado = props.desabilitado || false;
        let iconeDir = props.posIcon == 'D' || false;
        let iconeEsq = props.posIcon == 'E' || !iconeDir;        
        let compMaterial = props.comp == 'MaterialCommunityIcons';
        let compIonicons = props.comp == 'Ionicons';
        let compMaterialIcons = props.comp == 'MaterialIcons';
        let compEntypo = props.comp == 'Entypo';
        let compFontAwesome = props.comp == 'FontAwesome';   
        let compOcticons = props.comp == 'Octicons';

        let estiloIcon = {
            top: 1,
            left: iconeEsq ? 10 : -10,
            //left: iconeDir ? -10 : 0            
            
        }
        
        return(
            <TouchableHighlight onPress={ props.onPress } disabled={ desabilitado } style={props.style}>
                <View style={
                        {
                            flexDirection: 'row',              
                            alignItems: 'center',
                            backgroundColor: desabilitado ? '#CCC' : corFundo,
                            height: altura,
                            borderRadius: 5
                        }                    
                }>              

                    {
                        iconeDir &&
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
                    }                     
                    
                    {
                        compMaterial &&
                        <MaterialCommunityIcons name={props.icone} size={tamanho} 
                            color={cor} style={estiloIcon}
                        />                                
                    }

                    {
                        compIonicons &&
                        <MaterialCommunityIcons name={props.icone} size={tamanho} 
                            color={cor} style={estiloIcon}
                        />                                
                    }       

                    {
                        compMaterialIcons &&
                        <MaterialIcons name={props.icone} size={tamanho} 
                            color={cor} style={estiloIcon}
                        />                                
                    }    

                    {
                        compEntypo &&
                        <Entypo name={props.icone} size={tamanho} 
                            color={cor} style={estiloIcon}
                        />                                
                    }

                    {
                        compFontAwesome &&
                        <FontAwesome name={props.icone} size={tamanho} 
                            color={cor} style={estiloIcon}
                        />                                
                    }

                    {
                        compOcticons &&
                        <Octicons name={props.icone} size={tamanho} 
                            color={cor} style={estiloIcon}
                        />                                
                    }                                                       

                    {
                        iconeEsq &&
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
                    }
                </View>
            </TouchableHighlight>
        );
    
}