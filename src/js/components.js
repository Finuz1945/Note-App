import anime from "animejs";

class AppTitle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          h3 {
            text-align: center;
            font-size: 2rem;
            color: #22177a;
            margin-bottom: 1rem;
          }
        </style>
        <h3>${this.getAttribute("text") || "Notes App"}</h3>
      `;
  }
}
customElements.define("app-title", AppTitle);

class FormLabel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          label {
            font-size: large;
            color: #22177a;
            margin-top: 0.5rem;
            display: block;
          }
        </style>
        <label for="${this.getAttribute("for")}">${this.getAttribute("text")}</label>
      `;
  }
}
customElements.define("form-label", FormLabel);

class ErrorMessage extends HTMLElement {
  constructor() {
    super();
    this._message = this.getAttribute("message") || "";
    this._visible = this.hasAttribute("visible");
    this.attachShadow({ mode: "open" });
    this.render();
  }

  static get observedAttributes() {
    return ["message", "visible"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "message") this._message = newValue;
    if (name === "visible") this._visible = this.hasAttribute("visible");
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          .error {
            color: red;
            font-size: 0.9rem;
            margin-top: 5px;
            margin-bottom: 0.5rem;
            display: ${this._visible ? "block" : "none"};
          }
        </style>
        <div class="error">${this._message}</div>
      `;
  }
}
customElements.define("error-message", ErrorMessage);

const formattedDate = (dateString) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createNoteItemElement = ({ id, title, body, createdAt }) => `
    <div data-noteid="${id}" class="note-card">
      <h3>${title}</h3>
      <p>${body}</p>
      <small>Tanggal dibuat: ${formattedDate(createdAt)}</small>
      <button class="submit" data-id="${id}">Hapus</button>
    </div>
  `;

const showCustomError = (element, message, isVisible) => {
  element.setAttribute("message", message);
  if (isVisible) element.setAttribute("visible", "");
  else element.removeAttribute("visible");
};

const loader = document.getElementById("loader");

const showLoader = () => {
  loader.style.display = "block";
  anime({
    targets: "#loader p",
    translateY: [-20, 0],
    opacity: [0, 1],
    duration: 1000,
    loop: true,
    easing: "easeInOutSine",
  });
};

const hideLoader = () => {
  loader.style.display = "none";
};

export { createNoteItemElement, showCustomError, showLoader, hideLoader };
