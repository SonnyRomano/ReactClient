import React, { Component } from "react";
// import '../stylesheets/index.css';
import axios from 'axios';
import checkRoutingAccess from '../utility/checkRoutingAccess'

export default class PaginaRicercaProprietario extends Component {

  state = {
    listItems: '',
  }

  //Il metodo componentDidMount () viene chiamato dopo il rendering del componente.
  componentDidMount() {

    checkRoutingAccess(this.props)

    let idProprietario = sessionStorage.getItem('id')

    //Effettua un post passandogli i dati tramite l'oggetto "ricerca"
    axios.post(`https://team-mars-client.herokuapp.com/gestioneAnnunci/ricercaAnnunciProprietario`, { idProprietario })
      .then(res => {
        console.log(res);
        console.log(res.data);

        const listItems = res.data.map((d) =>
          <div className="shadow card mb-3" key={d.idAnnuncio}>
            <div className="row no-gutters">
              <div className="col-md-4">
                <a href={'/gestioneAnnunci/dettaglioAnnuncio?id=' + d.idAnnuncio}>
                  <img className="card-img" src={'https://team-mars.s3.eu-west-3.amazonaws.com/images/ID' + d.idAnnuncio + '/Cover.png'} alt="CoverImage" style={{ height: '100%', backgroundSize: 'cover' }} />
                </a>
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{d.titolo}</h5>
                  <p className="card-text">{d.indirizzo}<br />{d.cap} {d.citta}</p>
                  <button onClick={() => this.handleClickModify(d)} type="button" className="btn btn-secondary mb-2">Modifica</button>
                  <button onClick={() => this.handleClickRemove(d.idAnnuncio)} type="button" className="btn btn-danger">Elimina</button>
                </div>
              </div>
            </div>
          </div>
        );

        this.setState({
          listItems: listItems,
        });
      })
      .catch(err => {
        console.log("Error = ", err)
      })
  }

  handleClickModify(info) { //React passa i dati dell'annuncio alla  successiva pagina visualizza dettaglio annuncio
    this.props.history.push('/gestioneAnnunci/modificaAnnuncio', info);
  }

  handleClickRemove(idAnnuncio) {
    if (window.confirm('Sei sicuro di voler eliminare questo annuncio?')) {
      axios.post(`https://team-mars-client.herokuapp.com/gestioneAnnunci/eliminaAnnuncio`, { idAnnuncio })
        .then(res => {
          console.log(res);
          console.log(res.data);
          window.confirm('Annuncio eliminato');
          window.location.reload(false);
        })
        .catch(err => {
          console.log("Error = ", err)
          window.confirm('Errore! Operazione annullata');
        })
    }
  }

  render() {
    return (
      <div>
        <div className="container-fluid p-3" style={{ backgroundColor: '#f2f2f2' }} >
          <h1 className="display-4 text-center mb-3">I Tuoi Annunci</h1>
          <a className="btn btn-primary btn-block mb-3" href="/gestioneAnnunci/visualizzaPrenotazioni">Prenotazioni pendenti</a>
          <a className="btn btn-success btn-block mb-3" href='/gestioneAnnunci/inserisciAnnuncio'>Aggiungi annuncio</a>
          {this.state.listItems}
        </div>
      </div>
    );
  }
}