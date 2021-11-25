import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

export function initFormName() {
  class FormName extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const form = document.createElement("form");
      form.setAttribute("class", "form");
      form.innerHTML = `
            <label id="name"><c-text class="form--label" variant="body">Tu Nombre</c-text></label>
            <input type="text" id="name" class="input-name">
            <c-button class="button">Empezar</c-button>
            `;

      const style = document.createElement("style");
      style.innerHTML = `
            .form{
                display: flex;
                flex-direction: column;
                min-width: 280px;
                max-width: 337px;
            }

            .form--label {
                font-family: Odibee Sans, "cursive";
                text-align: center;
            }

            .input-name {
                height: 50px;
                border: 10px solid var(--button-border-darker);
                border-radius: 10px;
                margin: 0 0 40px 0;
                font-size: 32px;
                padding: 0 0 0 15px;
                font-family: Odibee Sans, "cursive";
            }
            `;
      this.shadow.appendChild(form);
      this.shadow.appendChild(style);
    }
  }
  customElements.define("form-name", FormName);
}
