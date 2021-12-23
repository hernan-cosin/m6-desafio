import { state } from "../../../state";
import { Router } from "@vaadin/router";

class resultLoose extends HTMLElement {
  shadow: ShadowRoot;

  connectedCallback() {
    this.render();
    const button = document.querySelector(".button");

    button.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/press-play");
      // params.goTo("/dwf-m5-desafio/instructions");
    });

    const scoreContainer = document.querySelector(".score-container");

    state.subscribe(() => {
      const scoreBoard = document.createElement("c-score");
      scoreBoard.setAttribute("class", "score-board");
      scoreContainer.firstChild
        ? scoreContainer.firstChild.remove()
        : scoreContainer.appendChild(scoreBoard);
    });

    // state.setState(state.getState());
  }
  render() {
    this.innerHTML = `
            <div class="container">
                <div class="content">
                    <c-star variant="loose"></c-star>
                    <div class="score-container"></div>
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
}
customElements.define("result-loose", resultLoose);
