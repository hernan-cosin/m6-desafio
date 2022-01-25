export function initCounter() {
  class Counter extends HTMLElement {
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
      div.setAttribute("class", "container");

      div.innerHTML = `
                <div class="counter-container">
                    <p class="counter"></p>
                </div>
            `;

      let counter = 3;
      const intervalo = setInterval(() => {
        const num = div.querySelector(".counter");
        num.innerHTML = `${counter}`;
        counter--;
        if (counter < 0) {
          clearInterval(intervalo);
          displayNoPlayText();
          const event = new CustomEvent("timeOut", { bubbles: true });
          this.dispatchEvent(event);
        }
      }, 1000);

      function displayNoPlayText() {
        setTimeout(() => {
          const counterContainer = div.querySelector(".counter-container");
          counterContainer.firstChild.remove();
          counterContainer.innerHTML = `
                            <c-text class="time-out" variant="body">No has elegido a tiempo</c-text>
                        `;
          counterContainer.classList.add("transparent");
        }, 1000);
      }

      const style = document.createElement("style");
      style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
            
                .counter-container {
                    width: 243px;
                    height: 243px;
                    border-radius: 50%;
                    border: 23px solid var(--grey);
                    border-top-color: var(--black);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    animation: rotate 1s 3 .75s ease-out;
                }

                @keyframes rotate {
                  0% {
                    transform: rotate(0);
                  }
                  100% {
                    transform: rotate(365deg);
                  }
                }

                .counter {
                    font-size: 100px;
                    font-family: 'Special Elite', cursive;
                    text-align: center;
                    animation: no-rotate 1s 3 .75s ease-out;
                }

                @keyframes no-rotate {
                  0% {
                    transform: rotate(0);
                  }
                  100% {
                    transform: rotate(-365deg);
                  }
                } 

                .time-out {
                    font-family: 'Special Elite', cursive;
                    text-align: center;
                }

                .transparent {
                    border-color: rgba(0, 0, 0, 0.6);
                }
            `;
      div.appendChild(style);
      this.shadow.appendChild(div);
    }
  }
  customElements.define("c-counter", Counter);
}
