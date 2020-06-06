import React from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { StyleSheet, View, Image, Text, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

const Home = () => {
  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate('Points');
  }

  const items = [
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Amazaonas', value: 'AM' },
    { label: 'Mato Grosso do Sul', value: 'MS' },
  ];

  return (
    <ImageBackground
      source={ require('../../assets/home-background.png') }
      style={ styles.container }
      imageStyle={ { width: 274, height: 368 } }
    >
      <View style={ styles.main }>
        <Image source={ require('../../assets/logo.png') } />
        <Text style={ styles.title }>Seu marketplace de coleta de resíduos.</Text>
        <Text style={ styles.description }>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>

      <RNPickerSelect
        onValueChange={ (value) => console.log(value) }
        items={ [
          { label: 'Distrito Federal', value: 'DF', color: 'black' },
          { label: 'Goiás', value: 'GO', color: 'black' },
          { label: 'Amazonas', value: 'AM', color: 'black' },
          { label: 'Tocantins', value: 'TO', color: 'black' },
        ] }
        placeholder={ { label: 'Selecione uma UF', value: null, color: '#6C6C80' } }
        style={ {
          inputIOS: {
            color: '#322153',
          },
          inputAndroid: {
            color: '#322153',
          },
        } }
      />
      <RNPickerSelect
        onValueChange={ (value) => console.log(value) }
        items={ [
          { label: 'Distrito Federal', value: 'DF' },
          { label: 'Goiás', value: 'GO' },
          { label: 'Amazonas', value: 'AM' },
          { label: 'Tocantins', value: 'TO' },
        ] }
        placeholder={ { label: 'Selecione uma UF', value: null, color: '#6C6C80' } }
        style={ {
          inputIOS: {
            color: '#322153',
          },
          inputAndroid: {
            color: '#322153',
          },
        } }
      />

      <View style={ styles.footer }>
        <RectButton style={ styles.button } onPress={ handleNavigateToPoints } >
          <View style={ styles.buttonIcon }>
            <Icon name="arrow-right" color="#fff" size={ 24 }></Icon>
          </View>
          <Text style={ styles.buttonText }>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 48,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});