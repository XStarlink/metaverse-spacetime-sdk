import { UiElement } from "../../../../UiElement.js";

import { MenuHeaderButtons } from "./MenuHeaderElements/MenuHeaderButtons.js"

class MenuHeader extends UiElement {
    constructor() {
        super({
            id: "MenuHeader",
            style: {
                boxShadow: "0 4px 4px #888888",
                background: "#E0E0E0",
                zIndex: "100",
                height: "50px",
                position: "absolute",
                width: "350px",
                transition: "all 0.5s ease",
                overflow: "hidden"
            }
        })

        this.isOpen = false;

        this.toggleMenuButton = new UiElement({
            innerHTML: "☰",
            style: {
                padding: "10px",
                cursor: "pointer",

            },
            onClick: () => {
                this.toggleMenu();
            }
        })

        this.chatPanelButton = new MenuHeaderButtons("chat", this);
        this.multiplayerPanelButton = new MenuHeaderButtons("multiplayer", this);
        this.avatarPanelButton = new MenuHeaderButtons("avatar", this);
        this.mapPanelButton = new MenuHeaderButtons("map", this);
        
        this.optionList = new UiElement({
            style: {
                display: "none",
                marginTop: "50px",
            }
        })
        this.optionList.appendChildList([
            this.chatPanelButton,
            this.multiplayerPanelButton,
            this.avatarPanelButton,
            this.mapPanelButton
        ])

        this.appendChildList([
            this.toggleMenuButton,
            this.optionList
        ])
    }

    handleMenuHeaderSelection(panel) {
        this.closeAllHeaders()
        switch(panel) {
            case "chat":
                this.chatPanelButton.element.style.background = "#c8c8c8";
                this.chatPanelButton.options.style.background = "#c8c8c8";
                break;
            case "multiplayer":
                this.multiplayerPanelButton.element.style.background = "#c8c8c8";
                this.multiplayerPanelButton.options.style.background = "#c8c8c8";
                break;
            case "avatar":
                this.avatarPanelButton.element.style.background = "#c8c8c8";
                this.avatarPanelButton.options.style.background = "#c8c8c8";
                break;
            case "map":
                this.mapPanelButton.element.style.background = "#c8c8c8";
                this.mapPanelButton.options.style.background = "#c8c8c8";
        }
    }

    toggleMenu() {
        if(this.isOpen){
            this.element.style.height = "50px";
            this.toggleMenuButton.element.innerHTML = "☰";
            this.optionList.element.style.display = "none"; 
        } else {
            this.element.style.height = "350px";
            this.toggleMenuButton.element.innerHTML = "X";
            this.optionList.element.style.display = "block"; 
        }
        this.isOpen = !this.isOpen;
    }

    closeAllHeaders() {
        this.chatPanelButton.element.style.background = "#e0e0e0";
        this.chatPanelButton.options.style.background = "#e0e0e0";
        this.multiplayerPanelButton.element.style.background = "#e0e0e0";
        this.multiplayerPanelButton.options.style.background = "#e0e0e0";
        this.avatarPanelButton.element.style.background = "#e0e0e0";
        this.avatarPanelButton.options.style.background = "#e0e0e0";
        this.mapPanelButton.element.style.background = "#e0e0e0";
        this.mapPanelButton.options.style.background = "#e0e0e0";
    }
}
export { MenuHeader }