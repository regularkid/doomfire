var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d", { alpha: false });
var framebuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
var framebuffer32Bit = new Uint32Array(framebuffer.data.buffer);
var heightMult = 1.0;
var windMult = 0.0;

document.getElementById("heightSlider").oninput = () => { heightMult = 2.0 - parseFloat(document.getElementById("heightSlider").value); }
document.getElementById("windSlider").oninput = () => { windMult = parseFloat(document.getElementById("windSlider").value); }
window.addEventListener("keyup", e => { if (e.key === "ArrowUp") { SetFireActive(!fireActive); e.preventDefault(); }});

var colors =
[
    0x000000, 0x070707, 0x07071F, 0x070F2F, 0x070F47, 0x071757, 0x071F67, 0x071F77, 0x07278F, 0x072F9F, 0x073FAF, 0x0747BF, 0x0747C7, 0x074FDF, 0x0757DF, 0x075FD7, 0x0F67D7,
    0x0F6FCF, 0x0F77CF, 0x0F7FCF, 0x1787CF, 0x1787C7, 0x178FC7, 0x1F97C7, 0x1F9FBF, 0x27A7BF, 0x2FAFBF, 0x2FAFB7, 0x2FB7B7, 0x37B7B7, 0x6FCFCF, 0x9FDFDF, 0xC7EFEF, 0xFFFFFF,
];

var colorsLookup = {};
colors.forEach((color, i) => colorsLookup[color] = i);

function SetFireActive(active)
{
    fireActive = active;
    framebuffer32Bit.fill(fireActive ? colors[colors.length - 1] : 0x000000, (canvas.height - 1) * canvas.width, framebuffer32Bit.length);
}

function GameLoop()
{
    for (let pixelIdx = 0; pixelIdx < (canvas.height - 1) * canvas.width; pixelIdx++)
    {
        let dst = Math.max(Math.min(Math.round((pixelIdx - 1) + (Math.random() * 2.5) + windMult), framebuffer32Bit.length), 0);
        let src = pixelIdx + canvas.width;
        framebuffer32Bit[dst] = colors[Math.max(colorsLookup[framebuffer32Bit[src]] - Math.round(Math.random() * heightMult), 0)];
    }

    ctx.putImageData(framebuffer, 0, 0);
    window.requestAnimationFrame(GameLoop);
}

SetFireActive(true);
window.requestAnimationFrame(GameLoop);