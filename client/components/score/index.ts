import { state } from "../../state";

export function initScore() {
  class Score extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const lastState = state.getState();

      const winsPlayerZero = lastState.winPlayerZero
        ? lastState.winPlayerZero.length
        : "";
      const winsPlayerOne = lastState.winPlayerOne
        ? lastState.winPlayerOne.length
        : "";

      const div = document.createElement("div");
      div.setAttribute("class", "score-container");

      const player0 = lastState.players ? lastState.players[0] : "";
      const player1 = lastState.players ? lastState.players[1] : "";

      div.innerHTML = `
                <c-text class="score-title" variant="subtitle">Score</c-text>
                <c-text class="score"> ${player0}: ${winsPlayerZero}</c-text>
                <c-text class="score"> ${player1}: ${winsPlayerOne}</c-text>
            `;
      const style = document.createElement("style");
      style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Odibee+Sans&display=swap');
                .score-container {
                    width: 259px;
                    height: 217px;
                    border: 10px solid var(--black);
                    border-radius: 10px;
                    margin-bottom: 20px;
                    background-color: var(--white);
                }

                .score-title {
                    font-family: 'Odibee Sans', cursive;
                    text-align: center;
                }

                .score {
                  font-family: 'Odibee Sans', cursive;
                  text-align: right;
                  display: block;
                  padding: 0 10px 0 0;
                }
            `;
      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
    }
  }
  customElements.define("c-score", Score);
}
