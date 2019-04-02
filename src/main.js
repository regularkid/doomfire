var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d", { alpha: false });
var screenWidth = canvas.width;
var screenHeight = canvas.height;
var input = new Input();
var lastTime = 0;

var framebuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
var framebuffer32Bit = new Uint32Array(framebuffer.data.buffer);

var colors =
[
    0x000000,
    0x070707,
    0x07071F,
    0x070F2F,
    0x070F47,
    0x071757,
    0x071F67,
    0x071F77,
    0x07278F,
    0x072F9F,
    0x073FAF,
    0x0747BF,
    0x0747C7,
    0x074FDF,
    0x0757DF,
    0x075FD7,
    0x0F67D7,
    0x0F6FCF,
    0x0F77CF,
    0x0F7FCF,
    0x1787CF,
    0x1787C7,
    0x178FC7,
    0x1F97C7,
    0x1F9FBF,
    0x27A7BF,
    0x2FAFBF,
    0x2FAFB7,
    0x2FB7B7,
    0x37B7B7,
    0x6FCFCF,
    0x9FDFDF,
    0xC7EFEF,
    0xFFFFFF,
];

var colorsLookup = {};
for (let i = 0; i < colors.length; i++)
{
    colorsLookup[colors[i]] = i;
}

var fireActive = true;
for (let x = 0; x < screenWidth; x++)
{
    framebuffer32Bit[((screenHeight - 1) * screenWidth) + x] = colors[colors.length - 1];
}

function Update(dt)
{
    if (input.keysJustPressed["arrowup"])
    {
        fireActive = !fireActive;
        for (let x = 0; x < screenWidth; x++)
        {
            framebuffer32Bit[((screenHeight - 1) * screenWidth) + x] = fireActive ? colors[colors.length - 1] : 0x000000;
        }
    }

    input.postUpdate();
}

var colorIdx = 0;
function Render()
{
    for (let y = 0; y < screenHeight - 1; y++)
    {
        for (let x = 0; x < screenWidth; x++)
        {
            let rand = Math.round(Math.random() * 3) & 3;
            let pixelIdxDst = (y * screenWidth) + x - 1 + rand;
            let pixelIdxSrc = ((y + 1) * screenWidth) + x;//(x - 1 + rand);
            let curColor = framebuffer32Bit[pixelIdxSrc];
            let colorIdx = colorsLookup[curColor];
            framebuffer32Bit[pixelIdxDst] = colorIdx > 0 ? colors[colorIdx - (rand & 1)] : 0x000000;
        }
    }

    ctx.putImageData(framebuffer, 0, 0);

    colorIdx = (colorIdx + 1) % colors.length;
}

function GameLoop(curTime)
{
    let dt = Math.min((curTime - lastTime) / 1000.0, 0.2);
    lastTime = curTime;

    Update(dt);
    Render();

    //TEMP!
    this.ctx.font = `Bold 16px Arial`;
    this.ctx.fillStyle = "#FFF";
    this.ctx.fillText(`${Math.floor(dt * 1000.0)}`, 10, 20);

    window.requestAnimationFrame(GameLoop);
}

window.requestAnimationFrame(GameLoop);