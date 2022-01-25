// const bg = require("url:../../media/bg.svg");
import { Router } from "@vaadin/router";
import { initFormRoom } from "../../components/form-room";
import { state } from "../../state";
import { bg } from "../home";

class NoRoom extends HTMLElement {
  shadow: ShadowRoot;
  connectedCallback() {
    this.render();

    // const formEl =
    //   this.querySelector(".main--form").shadowRoot.querySelector(".form");

    // const inputEl = this.querySelector(".main--form").shadowRoot.querySelector(
    //   ".input-name"
    // ) as any;

    // const buttonEl =
    //   this.querySelector(".main--form").shadowRoot.querySelector(".button");

    // formEl.addEventListener("submit", (e) => {
    //   e.preventDefault();
    // });

    // buttonEl.addEventListener("click", (e) => {
    //   e.preventDefault;

    //   if (inputEl.value.length == 0) {
    //     return;
    //   } else {
    //     state.setName(inputEl.value);
    //     const lastState = state.getState();

    //     const userData = { name: inputEl.value };

    //     state.signin(userData, () => {
    //       if (state.getState().roomId.length > 0) {
    //         state.connectToRoom(() => {
    //           state.accessToRoom(
    //             () => {
    //               Router.go("/code");
    //             },
    //             () => {
    //               Router.go("/no-room");
    //             }
    //           );
    //         });
    //       } else {
    //         state.askNewRoom(() => {
    //           state.connectToRoom(() => {
    //             Router.go("/code");
    //           });
    //         });
    //       }
    //     });
    //   }
    // });

    // buttonEl.addEventListener("click", (e) => {
    //   e.preventDefault();
    // });
  }
  render() {
    this.innerHTML = `
        <section class="main">
          <c-text class="main--title" variant="title"> Piedra Papel ó Tijera </c-text>
          <c-text variant="custom" custom="35" class="info ">
            Ups, esta sala está completa y tu nombre no coincide con nadie en la sala.
          </c-text>
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

        .info {
          display: block;
          max-width: 317px;
          font-family: 'Special Elite', cursive;
          font-weight: bold;
          margin: 0 auto 30px auto;
          text-align: center;
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
        `;

    this.appendChild(style);
  }
}
customElements.define("no-room", NoRoom);
