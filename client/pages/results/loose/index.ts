import { state } from "../../../state";
import { Router } from "@vaadin/router";

class resultLoose extends HTMLElement {
  shadow: ShadowRoot;

  connectedCallback() {
    this.getHistory(() => {
      this.render();
      state.resetGameData();

      const button = document.querySelector(".button");
      button.addEventListener("click", (e) => {
        e.preventDefault();
        state.rtdbReseter(() => {
          state.setOnlineTrue();
          Router.go("/press-play");
        });
      });
    });
  }
  render() {
    this.innerHTML = `
            <div class="container">
                <div class="content">
                    <c-star variant="loose"></c-star>
                    <div class="score-container">
                      <c-score></c-score>
                    </div>
                    <c-button class="button">Volver a Jugar</c-button>
                </div>
            <div>
            `;
    const style = document.createElement("style");
    style.innerHTML = `
            .container {
                padding: 20px;
                background-color: var(--loose-secondary);
                overflow: auto;
            }

            .content {
                animation: fadeIn 2s;
                animation-fill-mode: both;
                opacity: 0;
                max-width: 769px;
                height: 100vh;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 30px 0;
            }

            @keyframes fadeIn{
                100% {
                    opacity: 1;
                    animation-fill-mode: both;
                }
            }

            .score-board {
                display: block;
            }       
            `;

    this.appendChild(style);
  }
  getHistory(cb?) {
    const lastState = state.getState();
    state.getHistoryFromFirestore(
      lastState.rtdbRoomId,
      lastState.roomId,
      () => {
        if (cb) {
          cb();
        }
      }
    );
  }
}
customElements.define("result-loose", resultLoose);
