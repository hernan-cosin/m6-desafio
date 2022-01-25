const piedraImg = require("url:../../media/piedra.svg");
const papelImg = require("url:../../media/papel.svg");
const tijeraImg = require("url:../../media/tijera.svg");
const piedraLargeImg = require("url:../../media/piedraLarge.svg");
const papelLargeImg = require("url:../../media/papelLarge.svg");
const tijeraLargeImg = require("url:../../media/tijeraLarge.svg");

export function initPlay() {
  class initPlay extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const img = document.createElement("img");
      const att = this.getAttribute("play");
      const selected = this.getAttribute("selected");

      if (att == "piedra") {
        img.setAttribute("src", piedraImg);
        img.setAttribute("class", "jugada");
      }
      if (att == "piedraLarge") {
        img.setAttribute("src", piedraLargeImg);
        img.setAttribute("class", "jugadaLarge");
      }
      if (att == "papel") {
        img.setAttribute("src", papelImg);
        img.setAttribute("class", "jugada");
        img.classList.add("papel");
      }
      if (att == "papelLarge") {
        img.setAttribute("src", papelLargeImg);
        img.setAttribute("class", "jugadaLarge");
      }
      if (att == "tijera") {
        img.setAttribute("src", tijeraImg);
        img.setAttribute("class", "jugada");
      }
      if (att == "tijeraLarge") {
        img.setAttribute("src", tijeraLargeImg);
        img.setAttribute("class", "jugadaLarge");
      }
      if (selected == "piedra" && att.includes(selected)) {
        img.setAttribute("src", piedraLargeImg);
        img.setAttribute("class", "jugadaLargeSelected");
      }
      if (selected == "papel" && att.includes(selected)) {
        img.setAttribute("src", papelLargeImg);
        img.setAttribute("class", "jugadaLargeSelected");
      }
      if (selected == "tijera" && att.includes(selected)) {
        img.setAttribute("src", tijeraLargeImg);
        img.setAttribute("class", "jugadaLargeSelected");
      }

      const style = document.createElement("style");
      style.innerHTML = `
                .jugada {
                    transform: translateY(10px);
                    display: inline-block;
                }

                @media (min-width: 769px) {
                    .jugada {
                        width: 80px;
                        height: auto;
                    }
                }

                @media (min-width: 769px) {
                    .papel {
                        width: 135%;
                    }
                }

                .select-move {
                    animation: select 2s .75s;
                }
                
                @keyframes select {
                    0% {
                        
                        transform: translateY(0px);
                    }
                    100% {
                        transform: translateY(-50px) scale(1.5);
                    }
                }

                .transparent {
                    animation: transparent 2s;
                    animation-fill-mode: both;
                }

                @keyframes transparent {
                    0% {
                        
                        opacity: 1;
                    }
                    100% {
                        opacity: .5;
                    }
                }

                .jugadaLargeSelected{
                  transform: translateY(-50px) scale(1.5);
                }

                @keyframes oponent-select {
                  0% {
                      
                      transform: translateY(0px);
                  }
                  100% {
                      transform: translateY(-50px) scale(1.5);
                  }
              }

              @keyframes oponent-notselect {
                  0% {
                            
                      opacity: 1;
                  }
                  100% {
                      opacity: .5;
                  }
              }
            `;
      img.appendChild(style);
      this.shadow.appendChild(img);
    }
  }
  customElements.define("c-play", initPlay);
}
