import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Feather as Icon } from '@expo/vector-icons';
import { StyleSheet, View, Image, Text, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

interface Uf {
  id: number,
  sigla: string,
  nome: string
}

interface Cidade {
  id: number,
  nome: string
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<Uf[]>([]);
  const [cities, setCities] = useState<Cidade[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
      setUfs(response.data);
    })
  }, []);

  useEffect(() => {
    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      setCities(response.data);
    });
  }, [ selectedUf ]);

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      city: selectedCity,
      uf: selectedUf
    });
  }

  const items = [
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Amazonas', value: 'AM' },
    { label: 'Tocantins', value: 'TO' },
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
        onValueChange={ (value) => {
          setSelectedUf(value);
          setSelectedCity('0');
        } }
        items={ ufs.map(uf => (
          {label: uf.nome, value: uf.sigla}
        )) }
        placeholder={ { label: 'Selecione uma UF', value: '0', color: '#6C6C80' } }
        style={ {
          inputIOS: {
            color: '#322153'
          },
          inputAndroid: {
            color: '#322153'
          },
        } }
      />
      <RNPickerSelect
        onValueChange={ (value) => setSelectedCity(value) }
        items={ cities.map(city => (
          {label: city.nome, value: city.nome}
        )) }
        placeholder={ { label: 'Selecione uma Cidade', value: '0', color: '#6C6C80' } }
        style={ {
          inputIOS: {
            color: '#322153'
          },
          inputAndroid: {
            color: '#322153'
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