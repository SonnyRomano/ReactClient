import React, { Component } from "react";
import axios from 'axios';
import checkRoutingAccess from '../utility/checkRoutingAccess';


export default class FormQuestura extends Component {

  imageFiles = []

  state = {
    listOfFields: []
  }

  onImageChange = (event) => {
    this.imageFiles = event.target.files
  }

  handleSubmit = event => {
    event.preventDefault();

    let idPrenotazione = this.props.location.state

    let nomeCognome = []
    let nomeCognomeElement = document.getElementsByName("nomeCognome")
    for (let e = 0; e < nomeCognomeElement.length; e++) nomeCognome.push(nomeCognomeElement[e].value)

    let codiceFiscale = []
    let codiceFiscaleElement = document.getElementsByName("codiceFiscale")
    for (let e = 0; e < codiceFiscaleElement.length; e++) codiceFiscale.push(codiceFiscaleElement[e].value)


    let formData = new FormData();
    for (let i = 0; i < this.imageFiles.length; i++) {
      formData.append('file', this.imageFiles[i], 'img' + i + '.png');
    }

    let dati = {
      nomeCognome,
      codiceFiscale,
      formData,
      idPrenotazione
    }

    console.log(dati)

    axios.post(`https://team-mars-server.herokuapp.com/gestioneLegale/invioDatiQuestura`, { dati })
      .then(res => {
        console.log(res);
      })
  }

  componentDidMount() {
    checkRoutingAccess(this.props)
    if (this.props.history.action === 'POP') this.props.history.push('/')
  }

  aggiungiOspite() {
    let listTemp = this.state.listOfFields
    listTemp.push(
      <div key={listTemp.length}>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label>Nome e Cognome</label>
            <input className="form-control" name="nomeCognome" placeholder="Inserire Nome e Cognome" required />
          </div>
          <div className="form-group col-md-4">
            <label>Codice Fiscale</label>
            <input className="form-control" name="codiceFiscale" placeholder="Inserire Codice Fiscale" pattern='^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$' required />
          </div>
          <div className="form-group col-md-4">
            <label>Documenti</label>
            <div className="custom-file">
              <input type="file" className="custom-file-input" id="img" name="img" accept="image/*" multiple onChange={this.onImageChange} aria-describedby="inputGroupFileAddon01" />
              <label className="custom-file-label" htmlFor="inputGroupFile01">Seleziona immagini</label>
            </div>
          </div>
        </div>

        <hr className="my-3" />
      </div>
    )

    this.setState({ listOfFields: listTemp })
  }

  rimuoviOspite() {
    let listTemp = this.state.listOfFields
    listTemp.pop()

    this.setState({ listOfFields: listTemp })
  }

  render() {
    return (
      <div className="container-fluid p-3 rounded" style={{ backgroundColor: '#f2f2f2' }}>
        <h1 className="display-4 text-center">Invia Dati Ospiti</h1>
        {/* <p>Compila I campi con I dati degli ospiti</p> */}
        <hr />

        <form onSubmit={this.handleSubmit}>
          <button type="button" className="btn btn btn-primary mb-3" onClick={() => this.aggiungiOspite()}>Aggiungi ospite</button>

          <button type="button" className="btn btn btn-danger mb-3" onClick={() => this.rimuoviOspite()}>Rimuovi ultimo ospite</button>

          <div>
            {
              this.state.listOfFields
            }
          </div>

          <button className="btn btn btn-success" type="submit">Invia dati</button>

        </form>
      </div>

    );
  }
}