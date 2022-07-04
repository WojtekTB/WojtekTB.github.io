class Chat {
    constructor() {
        this.chatLog = [];
        this.maxEntries = 6;
        this.opacityCounter = 0;
        this.activeField = "";
        this.active = false;
    }

    addEntry(playerId, text) {
        text = text.trim();
        this.active = false;
        if (text === "") {
            return;
        }
        this.opacityCounter = 400;
        this.chatLog.push(`${playerId}: ${text}`);
        if (this.chatLog.length > this.maxEntries) {
            this.chatLog.splice(0, 1);
        }
    }

    show() {
        textAlign(LEFT);
        let chatText = "";
        for (let i = 0; i < this.chatLog.length; i++) {
            chatText += "\n" + this.chatLog[i];
        }
        fill(30, this.opacityCounter);
        rect(0, 0, screenX / 3 + screenX * 0.02, screenY / 8 + screenX * 0.02);
        fill(255, this.opacityCounter);
        text(chatText, screenX * 0.01, screenY * 0.01, screenX / 3, screenY / 8);
        if (!this.active) {
            this.opacityCounter--;
        } else {
            fill(20);
            rect(0, screenY / 8 + screenX * 0.02, screenX / 3 + screenX * 0.02, 20);
            fill(255);
            text("SAY: " + this.activeField, 0, screenY / 8 + screenX * 0.02, screenX / 3 + screenX * 0.02, 20);
        }
    }

    makeActive() {
        this.active = true;
        this.opacityCounter = 400;
        keyPressed = () => {
            if (key.length === 1) {//letters or numbers   
                if (this.activeField.length > 120) {//if text too long
                    return;
                }
                this.activeField += key;
            } else if (key === "Backspace") {//backspace
                this.activeField = this.activeField.slice(0, -1);
            } else if (key === "Enter") {//Enter
                if (debugMode) {
                    if (this.activeField.slice(0, 1) === "/") {
                        eval(this.activeField.substring(1));
                    }
                }
                this.addEntry(uniqueUserId, this.activeField);
                socket.emit("newMessage", { newMessage: this.activeField, id: uniqueUserId });
                this.activeField = "";
                keyPressed = defaultKeyPressed;
            }
        }
    }

}