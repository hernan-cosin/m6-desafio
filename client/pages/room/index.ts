import { Router } from "@vaadin/router";
import { state } from "../../state";
import { bg } from "../home";

class Room extends HTMLElement {
  shadow: ShadowRoot;
  connectedCallback() {
    this.render();

    const formEl =
      this.querySelector(".main--form").shadowRoot.querySelector(".form");
    const inputEl = this.querySelector(".main--form").shadowRoot.querySelector(
      ".input-room-code"
    ) as any;

    const buttonEl =
      this.querySelector(".main--form").shadowRoot.querySelector(".button");

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    buttonEl.addEventListener("click", (e) => {
      e.preventDefault;

      if (inputEl.value.length == 0) {
        return;
      } else {
        const roomId = inputEl.value.toString();
        state.setRoomId(roomId);

        const haveName = state.getState().name;
        if (!haveName) {
          Router.go("/name");
        }
      }
    });

    buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
    });
  }
  render() {
    this.innerHTML = `
        <section class="main">
            <c-text class="main--title" variant="title"> Piedra Papel ó Tijera </c-text>
            <form-room class="main--form"></form-room>
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

        .main--form {
            display: block;
            width: fit-content;
            margin: 0 auto;
        }
        `;

    this.appendChild(style);
  }
}
customElements.define("room-page", Room);
