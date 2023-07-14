import { qrEncodedData } from "./encoding-service";

const svgns = "http://www.w3.org/2000/svg";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        svg {
            border: solid 1px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
        }
    </style>
    <svg xmlns="${svgns}"></svg>
`

class DamiQrcode extends HTMLElement {
    constructor() {
        super();
        this.initShadow();
    }

    initShadow() {
        const shadow = this.attachShadow({mode: "open"});
        shadow.append(template.content.cloneNode(true));
        this.svgElm = shadow.querySelector("svg");
    }

    connectedCallback() {
        console.log(qrEncodedData("HELLO WORLD", "M"));
    }

    static get observedAttributes() {
        return [];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        
    }

}

customElements.define("dami-qrcode", DamiQrcode);
