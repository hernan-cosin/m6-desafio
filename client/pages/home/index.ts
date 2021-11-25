const bg = require("url:../../media/bg.svg");
import { Router } from "@vaadin/router";

class Home extends HTMLElement {
  shadow: ShadowRoot;
  connectedCallback() {
    this.render();

    const newGameButtonEl =
      this.querySelector(".new-game").shadowRoot.querySelector(".button");
    newGameButtonEl.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/name");
    });

    const enterRoomButtonEl =
      this.querySelector(".enter-room").shadowRoot.querySelector(".button");
    enterRoomButtonEl.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/room");
    });
  }
  render() {
    this.innerHTML = `
        <section class="main">
            <c-text class="main--title" variant="title"> Piedra Papel ó Tijera </c-text>
            <div class="main--buttons-container">
              <c-button class="main--button new-game">Nuevo Juego</c-button>
              <c-button class="main--button enter-room">Ingresar a una sala</c-button>
            </div>
            <div class="main--jugada-container">
              <c-play class="jugada piedra" play="piedra"></c-play>
              <c-play class="jugada papel" play="papel"></c-play>
              <c-play class="jugada tijera" play="tijera"></c-play>
            </div>
        </section>

        `;
    const style = document.createElement("style");
    style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Odibee+Sans&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

        .main {
          background-image: url(${bg});
          height: 100vh;
          padding: 70px 0 0 0;
        }

        @media (min-width: 769px) {
          .main{
            padding: 60px 0 0 0;
          }
        }

        .main--title {
            display: block;
            min-width: 270px;
            max-width: 280px;
            margin: 0 auto 55px auto;
            color: var(--principal);
            font-family: 'Special Elite', cursive;
        }

        .main--buttons-container {
          display: flex;
          flex-direction: column;
          margin: 0 auto 40px auto;
          row-gap: 20px;
        }

        .main--button {
          margin: 0 auto;
        }

        .main--jugada-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 90%;
          max-width: 390px;
          margin: 0 auto;
      }    

      @media (min-height: 700px) {
        .main--jugada-container {
          position: absolute;
          width: 100%;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 0);
        }
      }
        `;

    this.appendChild(style);
  }
}
customElements.define("home-page", Home);
export { bg };
