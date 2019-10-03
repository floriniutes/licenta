import React, {Component} from 'react';
import './index.css';
import Button from '../../common/button/index';
import Logo from '../../common/logo/index';
import Top from "../../top/index";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Redirect from "react-router-dom/es/Redirect";

export default class Presentation extends Component {

  constructor(props) {
    super(props);
    this.redirectLogin = this.redirectLogin.bind(this);
    this.redirectRegister = this.redirectRegister.bind(this);
    this.state = {
      currentLocation: 0,
      redirect: false
    };
    this.height = 0;
  }

  componentDidMount() {
    this.height = document.querySelector('.project-presentation-title').clientHeight;
  }

  moveToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  redirectLogin() {
    this.setState({
      redirect: 'login'
    });
  }

  redirectRegister() {
    this.setState({
      redirect: 'register'
    })
  }

  render() {
    if (this.state.redirect === 'login') {
      return <Redirect to='/login'/>
    } else if (this.state.redirect === 'register') {
      return <Redirect to='/register'/>
    }
    else
      return (
        <div className='project-presentation'>
          <Top usage="pagina-prezentare" redirectRegister={this.redirectRegister} redirectLogin={this.redirectLogin}/>
          <div className='project-presentation-wrapper'>
            <div className='project-presentation-title'>
              <div className='project-presentation-title-content'>
                <Logo/>
                <p>
                  Bine ați venit!
                </p>
              </div>
            </div>
            <div className='project-presentation-hospital'>
              <div className='project-presentation-hospital-text'>
                <p>
                  Spitalul Clinic de Urgenţă a fost fondat în anul 1979, din
                  necesitatea
                  construirii în
                  Bucureşti a unui spital funcţional, care să facă faţă cerinţelor anilor respectivi,
                  în
                  condiţiile în
                  care
                  populaţia oraşului era în creştere accentuată. A fost conceput ca un spital general
                  de
                  mărime medie, cu
                  un
                  număr de 600 de paturi şi care să includă secţiile de bază: medicină internă,
                  chirurgie,
                  ortopedie-traumatologie, urologie.
                </p>
              </div>
              <div className='project-presentation-hospital-photo'>
                <Carousel
                  autoPlay
                  showThumbs={false}
                  showStatus={false}
                  infiniteLoop>
                  <div>
                    <img src="../../../img/medic.png"/>
                  </div>
                  <div>
                    <img src="../../../img/spital-2.png"/>
                  </div>
                  <div>
                    <img src="../../../img/sectoare.png"/>
                  </div>
                </Carousel>
              </div>
            </div>
            <div className='project-presentation-services'>
              <div className='project-presentation-services-photo'>
                <Carousel
                  autoPlay
                  showThumbs={false}
                  showStatus={false}
                  infiniteLoop>
                  <div>
                    <img src="../../../img/urologie.png"/>
                  </div>
                  <div>
                    <img src="../../../img/service.png"/>
                  </div>
                </Carousel>
              </div>
              <div className='project-presentation-services-text'>
                În prezent, Spitalul Clinic de Urgenţă include un număr de 16 secţii
                clinice
                şi neclinice,
                un ambulatoriu de specialitate integrat, precum şi laboratoare specializate de
                tomografie
                computerizată,
                rezonanţă magnetică nucleară, angiografie şi endoscopie. Această structură, alături de
                Unitatea de Primire
                Urgenţe (UPU), permite furnizarea de servicii medicale la un nivel calitativ comparabil
                cu
                spitalele
                similare din centrele universitare din ţară.
              </div>
            </div>
          </div>
          <div className='project-presentation-signup'>
            <p>Ai deja un cont?</p>
            <div className='project-presentation-signup-login'>
              <Button label='Autentifică-te' onClick={this.redirectLogin}/>
            </div>
            <div className='project-presentation-signup-create'>
              <Button label='Înregistrează-te' onClick={this.redirectRegister}/>
            </div>
            <p className="project-presentation-phone-number">Sau poți suna la  <i className="fas fa-phone"/> 021 9119</p>
            <Button className='fa fa-angle-up backTop' onClick={this.moveToTop}/>
          </div>
        </div>
      )
  }
}