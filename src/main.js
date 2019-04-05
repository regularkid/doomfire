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
    0xFF000000, 0xFF070707, 0xFF07071F, 0xFF070F2F, 0xFF070F47, 0xFF071757, 0xFF071F67, 0xFF071F77, 0xFF07278F, 0xFF072F9F, 0xFF073FAF, 0xFF0747BF, 0xFF0747C7, 0xFF074FDF, 0xFF0757DF, 0xFF075FD7, 0xFF0F67D7,
    0xFF0F6FCF, 0xFF0F77CF, 0xFF0F7FCF, 0xFF1787CF, 0xFF1787C7, 0xFF178FC7, 0xFF1F97C7, 0xFF1F9FBF, 0xFF27A7BF, 0xFF2FAFBF, 0xFF2FAFB7, 0xFF2FB7B7, 0xFF37B7B7, 0xFF6FCFCF, 0xFF9FDFDF, 0xFFC7EFEF, 0xFFFFFFFF,
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