class Input
{
    constructor()
    {
        this.mousePos = {x: 0, y: 0};
        this.mouseDelta = {x: 0, y: 0};
        this.mouseButtons = {};
        this.mouseButtonsJustPressed = {};
        this.keys = {};
        this.keysJustPressed = {};

        window.addEventListener("mousemove", e =>
        {
            this.mouseDelta.x += e.movementX;
            this.mouseDelta.y += e.movementY;

            // var rect = ctx.canvas.getBoundingClientRect();
            // this.mousePos = {x: e.clientX - rect.left, y: e.clientY - rect.top};
        });

        // window.addEventListener("mousedown", e => this.setMouseButtonState(e, true));
        // window.addEventListener("mouseup", e => this.setMouseButtonState(e, false));
        window.addEventListener("contextmenu", e => e.preventDefault());
        window.addEventListener("keydown", e => this.setKeyState(e, true));
        window.addEventListener("keyup", e => this.setKeyState(e, false));
    }

    setMouseButtonState(event, isOn)
    {
        this.mouseButtonsJustPressed[event.button] = isOn && (this.mouseButtons[event.button] === false || this.mouseButtons[event.button] === undefined);
        this.mouseButtons[event.button] = isOn;
    }

    setKeyState(event, isOn)
    {
        let keyName = event.key.toLowerCase();
        this.keysJustPressed[keyName] = isOn && (this.keys[keyName] === false || this.keys[keyName] === undefined);
        this.keys[keyName] = isOn;
        
        // Hack: prevent arrow keys from scrolling the page
        if (keyName === "arrowup" || keyName === "arrowdown" || keyName === "arrowleft" || keyName === "arrowright")
        {
            event.preventDefault();
        }
    }

    postUpdate()
    {
        this.mouseDelta.x = 0.0;
        this.mouseDelta.y = 0.0;
        this.mouseLeftButtonJustPressed = false;
        this.mouseRightButtonJustPressed = false;

        Object.keys(this.mouseButtonsJustPressed).forEach(key => this.mouseButtonsJustPressed[key] = false);
        Object.keys(this.keysJustPressed).forEach(key => this.keysJustPressed[key] = false);
    }
}