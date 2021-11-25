export function initFormRoom() {
  class FormRoom extends HTMLElement {
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
              <input type="text" class="input-room-code" placeholder="código">
              <button class="invisible-button"><c-button class="button">Ingresar a la sala</c-button></button>
              `;

      const style = document.createElement("style");
      style.innerHTML = `
              .form{
                  display: flex;
                  flex-direction: column;
                  min-width: 280px;
                  max-width: 337px;
              }
              
              .input-room-code {
                  height: 84px;
                  border: 10px solid var(--button-border-darker);
                  border-radius: 10px;
                  margin: 0 0 40px 0;
                  font-size: 32px;
                  padding: 0;
                  font-family: Odibee Sans, "cursive";
                  box-sizing: border-box;
              }

              ::-webkit-input-placeholder{
                font-size: 45px;
                text-align: center;
                color: #D9D9D9;
              }
  
              .invisible-button {
                border: none;
                background: none;
              }
  
              .invisible-button:focus-visible {
                border: none;
              }

              .button {
                display: block;
              }
              `;
      this.shadow.appendChild(form);
      this.shadow.appendChild(style);
    }
  }
  customElements.define("form-room", FormRoom);
}
