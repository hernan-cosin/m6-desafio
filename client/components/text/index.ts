export function initText() {
  class Text extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const texto = document.createElement("p");
      texto.textContent = this.textContent;

      let variant = this.getAttribute("variant") || "body";
      texto.className = variant;
      let custom = this.getAttribute("custom");

      const style = document.createElement("style");
      style.innerHTML = `
                  .title {
                      font-size: 66px;
                      margin: 0;
                  }
                  
                  .subtitle {
                      font-size: 55px;
                      margin: 0;
                  }
                  
                  .body {
                      font-size: 40px;
                      margin: 0;
                  }
                  
                  .custom {
                    font-size: ${custom}px;
                    margin: 0;
                  }
              `;
      this.shadow.appendChild(texto);
      this.shadow.appendChild(style);
    }
  }
  customElements.define("c-text", Text);
}
