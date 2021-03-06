import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import api from '../../services/api';

import Dropzone from '../../components/Dropzone';

import './styles.css';

import logo from '../../assets/logo.svg';

interface Item {
  id: number,
  title: string,
  image_url: string
}

interface Uf {
  id: number,
  sigla: string,
  nome: string
}

interface Cidade {
  id: number,
  nome: string
}

const CreatePoint = () => {

  const [ items, setItems ] = useState<Item[]>([]);
  const [ ufs, setUfs ] = useState<Uf[]>([]);
  const [ cities, setCities ] = useState<Cidade[]>([]);

  const [ initialPosition, setInitialPosition ] = useState<[ number, number ]>([ 0, 0 ]);

  const [ selectedUf, setSelectedUf ] = useState('0');
  const [ selectedCity, setSelectedCity ] = useState('0');
  const [ selectedPosition, setSelectedPosition ] = useState<[ number, number ]>([ 0, 0 ]);
  const [ selectedItems, setSelectedItems ] = useState<number[]>([]);
  const [ selectedFile, setSelectedFile ] = useState<File>();

  const [ formData, setFormData ] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setInitialPosition([
        position.coords.latitude,
        position.coords.longitude
      ]);
    })
  }, [])

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

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

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUf(event.target.value);
    setSelectedCity('0');
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value);
  }

  function handleSelectPosition(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [ name ]: value });
  }

  function handleSelectItem(id: number) {
    if (selectedItems.includes(id)) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([ ...selectedItems, id ]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [ latitude, longitude ] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    await api.post('points', data);

    alert('Ponto de coleta criado!');

    history.push('/');
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={ logo } alt="Ecoleta" />

        <Link to="/" >
          <FiArrowLeft />
          Voltar para a home
        </Link>
      </header>

      <form onSubmit={ handleSubmit }>
        <h1>Cadastro do ponto de coleta</h1>

        <Dropzone onFileUpload={ setSelectedFile } />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da Entidade</label>
            <input type="text" name="name" id="name" onChange={ handleInputChange } />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" onChange={ handleInputChange } />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={ handleInputChange } />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={ initialPosition } zoom={ 15 } onClick={ handleSelectPosition } >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={ selectedPosition } />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={ selectedUf }
                onChange={ handleSelectUf }
              >
                <option value="0">Selecione uma UF</option>
                { ufs.map(uf => (
                  <option key={ uf.id } value={ uf.sigla }>{ uf.nome }</option>
                )) }
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={ selectedCity }
                onChange={ handleSelectCity }
              >
                <option value="0">Selecione uma cidade</option>
                { cities.map(city => (
                  <option key={ city.id } value={ city.nome }>{ city.nome }</option>
                )) }
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            { items.map(item => (
              <li
                key={ item.id }
                onClick={ () => handleSelectItem(item.id) }
                className={ selectedItems.includes(item.id) ? 'selected' : '' }
              >
                <img src={ item.image_url } alt={ item.title } />
                <span>{ item.title }</span>
              </li>
            )) }
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
}

export default CreatePoint;