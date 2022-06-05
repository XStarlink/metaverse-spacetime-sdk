class UiElement { 
    constructor(options) {
        const defaultOptions = {
            type: "div", 
            id: undefined,
            style: {},
            hover: undefined,
            onClick: undefined,
            innerHTML: undefined
        }

        // set empty options to their default values
        for (let option in defaultOptions) {
            options[option] = typeof options[option] === 'undefined' ? defaultOptions[option] : options[option];
        }
    
        // Create the element and assign id
        this.element = document.createElement(options.type);
        if(typeof options.id !== "undefined") {
            this.element.id = options.id;
        }

        // apply the style
        Object.assign(this.element.style, options.style);
        
        // if something is defined in the hover, add event listeners
        if(typeof options.hover !== "undefined"){
            this.element.addEventListener("mouseenter", function(){
                Object.assign(this.element.style, options.hover);
            })
            this.element.addEventListener("mouseleave", function(){
                Object.assign(this.element.style, options.style);
            })
        }

        // if something is defined in the onClick, add the event listener
        if(typeof options.onClick !== "undefined"){
            this.element.addEventListener("click", options.onClick)
        }
        // this.element.addEventListener("click", () => {console.log(this.element.id)})

        if(typeof options.innerHTML !== "undefined"){
            this.element.innerHTML = options.innerHTML;
        }
    }

    appendChild(elementObject) {
        this.element.appendChild(elementObject.element);
    }

    appendChildList(elementList) {
        elementList.forEach(element => {
            this.element.appendChild(element);
        })
    }
}
export { UiElement }