import { Router } from "@vaadin/router";
import { state } from "../../state";
import { bg } from "../home";

class WaitingRoom extends HTMLElement {
  shadow: ShadowRoot;
  players: { name: string }[] = [];
  connectedCallback() {
    state.resetOnline();

    this.render();
  }
  render() {
    state.readyToPlay(() => {
      state.resetStart(() => {
        Router.go("/choice");
      });
    });

    const lastState = state.getState();

    this.innerHTML = `
        <section class="main">
            <header class="main--header">
                <div class="header--names-container">
                  <c-text variant="custom" custom="24" class="header--name">${
                    lastState.players ? lastState.players[0] : ""
                  }: ${lastState.score ? lastState.score : " "}</c-text>
                  <c-text variant="custom" custom="24" class="header--name">${
                    lastState.players ? lastState.players[1] : ""
                  }: ${lastState.score ? lastState.score : " "}</c-text>
                  </div>
                <div class="header--room-container">
                  <c-text variant="custom" custom="24" class="room-text">Sala</c-text>
                  <c-text variant="custom" custom="24" class="roomId">${
                    lastState.roomId
                  }</c-text>
              </div>
            </header>
            <section class="game-info">
                <c-text variant="custom" custom="35" class="info ">Esperando a que ${
                  lastState.players[0] == lastState.name
                    ? lastState.players[1]
                    : lastState.players[0]
                } presione jugar</c-text>
            </section>
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
          padding: 40px 0 0 0;
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

        .main--jugada-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 90%;
          max-width: 390px;
          margin: 0 auto;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, -100%);
      }    
        `;

    this.appendChild(style);
  }
}
customElements.define("waiting-room-page", WaitingRoom);
