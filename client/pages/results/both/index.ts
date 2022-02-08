import { Router } from "@vaadin/router";
import { state } from "../../../state";
import { bg } from "../../home";

class resultsBoth extends HTMLElement {
  shadow: ShadowRoot;
  players: { name: string }[] = [];
  connectedCallback() {
    const lastState = state.getState();
    const myPlay = lastState["current-game"];

    this.render();

    // mis jugadas
    const piedraEl = this.querySelector(
      ".main--jugada-container"
    ).querySelector(".piedra");
    const papelEl = this.querySelector(".main--jugada-container").querySelector(
      ".papel"
    );
    const tijeraEl = this.querySelector(
      ".main--jugada-container"
    ).querySelector(".tijera");

    const jugadas = [piedraEl, papelEl, tijeraEl];

    const miJugada = jugadas.find((j) => {
      return j.className.includes(myPlay);
    });
    const misNoJugadas = jugadas.filter((j) => {
      return !j.className.includes(myPlay);
    });

    misNoJugadas.map((j) => {
      j.shadowRoot.querySelector("img").setAttribute("style", "opacity: .5;");
    });

    miJugada.setAttribute("selected", myPlay);
    miJugada.shadowRoot
      .querySelector("img")
      .setAttribute("style", "transform: translateY(-50px) scale(1.5);");

    //   oponente jugadas
    const oponentPlay =
      lastState["game"][0][`${lastState.player == 0 ? 1 : 0}`];

    const oponentPiedraEl = this.querySelector(
      ".oponent--jugada-container"
    ).querySelector(".piedra");
    const oponentPapelEl = this.querySelector(
      ".oponent--jugada-container"
    ).querySelector(".papel");
    const oponentTijeraEl = this.querySelector(
      ".oponent--jugada-container"
    ).querySelector(".tijera");

    const oponenteJugadas = [oponentPiedraEl, oponentPapelEl, oponentTijeraEl];

    const oponenteJugada = oponenteJugadas.find((j) => {
      return j.className.includes(oponentPlay);
    });

    const oponenteNoJugadas = oponenteJugadas.filter((j) => {
      return !j.className.includes(oponentPlay);
    });

    oponenteNoJugadas.map((j) => {
      j.shadowRoot
        .querySelector("img")
        .setAttribute(
          "style",
          "animation: oponent-notselect 2s .75s; animation-fill-mode: both;"
        );
    });

    oponenteJugada.setAttribute("selected", oponentPlay);
    oponenteJugada.shadowRoot
      .querySelector("img")
      .setAttribute(
        "style",
        "animation: oponent-select 2s .75s; animation-fill-mode: both;"
      );

    setTimeout(() => {
      const lastState = state.getState();

      const resultWhoWins = state.whoWins(lastState.game[0]);

      if (resultWhoWins == -1) {
        Router.go("/press-play");
      }
      if (lastState.player == resultWhoWins) {
        Router.go("/results/win");
      }
      if (lastState.player !== resultWhoWins && resultWhoWins !== -1) {
        Router.go("/results/loose");
      }
    }, 2750);
  }
  render() {
    this.innerHTML = `
        <section class="main">
            <div class="oponent--jugada-container">
              <c-play class="jugada piedra" play="piedraLarge"></c-play>
              <c-play class="jugada papel" play="papelLarge"></c-play>
              <c-play class="jugada tijera" play="tijeraLarge"></c-play>
            </div>
            <div class="main--jugada-container">
              <c-play class="jugada piedra" play="piedraLarge"></c-play>
              <c-play class="jugada papel" play="papelLarge"></c-play>
              <c-play class="jugada tijera" play="tijeraLarge"></c-play>
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
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }

       /* @media (min-width: 769px) {
          .main{
            padding: 60px 0 0 0;
          }
        } */

        .main--header {
          display: flex;
          justify-content: space-between;
          font-family: 'Special Elite';
          column-gap: 30px;
          max-width: 960px;
          margin: 0 auto 50px auto ;
          padding: 0 30px;
        }

        @media (min-width: 769px) {
          .main--header {
            margin: 0 auto 60px auto;
          }
        }
          
        .header--name {
          display: block;
          font-family: 'Special Elite', cursive;
        }

        .room-text {
          font-weight: bold;
        }
        
        .roomId {
          text-align: right;
          font-weight: bold;
        }

        .game-info {
          max-width: 960px;
          margin: 0 auto;
          text-align: center;
        }

        .info {
          display: block;
          max-width: 317px;
          font-family: 'Special Elite', cursive;
          font-weight: bold;
          margin: 0 auto 30px auto;
          text-align: center;
        }

        .game-info--button {
          display: block;
          margin: 0 0 80px 0;
        }

        .counter{
          display: flex;
          justify-content: center;
          margin: 0 0 30px 0;
        }

        .main--jugada-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 90%;
          max-width: 390px;
          margin: 0 auto;
        }    

        .oponent--jugada-container {
            transform: rotate(180deg);
        }

      @media (min-height: 580px) {
        .main--jugada-container {
          position: fixed;
          top: 100%;
          width: 100%;
          left: 50%;
          transform: translate(-50%, -100%);
        }

        .jugada {
          cursor: default;
        }
        `;

    this.appendChild(style);
  }
}
customElements.define("results-both-page", resultsBoth);
