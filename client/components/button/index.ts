export function initButtom() {
  class Button extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const button = document.createElement("button");
      button.setAttribute("class", "button");
      button.textContent = this.textContent;

      const style = document.createElement("style");
      style.innerHTML = `
              @import url('https://fonts.googleapis.com/css2?family=Odibee+Sans&display=swap');
                  .button {
                      box-sizing: border-box;
                      min-width: 322px;
                      width: max-content;
                      height: 87px;
                      background-color: var(--button);
                      border: 10px solid var(--button-border);
                      border-radius: 10px;
                      font-size: 45px;
                      font-family: 'Odibee Sans', cursive;
                      color: var(--white);
                      cursor: pointer;
                  }
              `;
      this.shadow.appendChild(button);
      this.shadow.appendChild(style);
    }
  }
  customElements.define("c-button", Button);
}
