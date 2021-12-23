const starW = require("url:../../media/starW.svg");
const starL = require("url:../../media/starL.svg");

export function initStar() {
  class Star extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const div = document.createElement("div");
      const att = this.getAttribute("variant");

      if (att == "win") {
        div.innerHTML = `
                    <img src="${starW}" alt="estrella verde"/>
                `;
      }
      if (att == "loose") {
        div.innerHTML = `
                    <img src="${starL}" alt="estrella roja"/>
                `;
      }

      this.shadow.appendChild(div);
    }
  }
  customElements.define("c-star", Star);
}
