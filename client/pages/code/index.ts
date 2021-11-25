import { bg } from "../home";
import { state } from "../../state";
import { Router } from "@vaadin/router";

class Code extends HTMLElement {
  shadow: ShadowRoot;
  connectedCallback() {
    this.render();
  }
  render() {
    const lastState = state.getState();
    this.innerHTML = `
        <section class="main">
          <header class="main--header">
            <div class="header--names-container">
              <c-text variant="custom" custom="24" class="header--name">${
                lastState.name
              }: ${lastState.score ? lastState.score : " 0"}</c-text>
            </div>
            <div class="header--room-container">
              <c-text variant="custom" custom="24" class="room-text">Sala</c-text>
              <c-text variant="custom" custom="24" class="roomId">${
                lastState.roomId
              }</c-text>
            </div>
          </header>
          <section class="code-info">
              <c-text variant="custom" custom="35" class="info ">Compartí el codigo:</c-text>
              <c-text variant="custom" custom="48" class="info ">${
                lastState.roomId
              }</c-text>
              <c-text variant="custom" custom="35" class="info ">Con tu contrincante</c-text>
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
          padding: 30px 0 0 0;
        }

        .main--header {
          display: flex;
          justify-content: space-between;
          font-family: 'Special Elite';
          column-gap: 30px;
          max-width: 960px;
          margin: 0 auto 110px auto ;
          padding: 0 30px;
        }

        @media (min-width: 769px) {
          .main--header {
            margin: 0 auto 180px auto;
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

        .code-info {
          max-width: 960px;
          margin: 0 auto;
          text-align: center;
        }

        .info {
          display: block;
          font-family: 'Special Elite', cursive;
          font-weight: bold;
          margin: 0 0 30px 0 ;
        }

        .main--jugada-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 90%;
          max-width: 390px;
          margin: 0 auto;
      }    

      @media (min-height: 580px) {
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
customElements.define("code-page", Code);
