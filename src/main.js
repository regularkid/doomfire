var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d", { alpha: false });
var framebuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
var framebuffer32Bit = new Uint32Array(framebuffer.data.buffer);
var heightMult = 1.0;
var windMult = 0.0;
var touch = { x: 0, y: 0, active: false}
var colorsClassic =   [0xFF000000, 0xFF070707, 0xFF07071F, 0xFF070F2F, 0xFF070F47, 0xFF071757, 0xFF071F67, 0xFF071F77, 0xFF07278F, 0xFF072F9F, 0xFF073FAF, 0xFF0747BF, 0xFF0747C7, 0xFF074FDF, 0xFF0757DF, 0xFF075FD7, 0xFF0F67D7, 0xFF0F6FCF, 0xFF0F77CF, 0xFF0F7FCF, 0xFF1787CF, 0xFF1787C7, 0xFF178FC7, 0xFF1F97C7, 0xFF1F9FBF, 0xFF27A7BF, 0xFF2FAFBF, 0xFF2FAFB7, 0xFF2FB7B7, 0xFF37B7B7, 0xFF6FCFCF, 0xFF9FDFDF, 0xFFC7EFEF, 0xFFFFFFFF];
var colorsGrayscale = [0xFF000000, 0xFF151515, 0xFF1A1A1A, 0xFF252525, 0xFF2A2A2A, 0xFF353535, 0xFF3A3A3A, 0xFF454545, 0xFF4A4A4A, 0xFF555555, 0xFF585858, 0xFF5A5A5A, 0xFF656565, 0xFF686868, 0xFF6A6A6A, 0xFF757575, 0xFF7A7A7A, 0xFF858585, 0xFF8A8A8A, 0xFF959595, 0xFF9A9A9A, 0xFFA5A5A5, 0xFFAAAAAA, 0xFFB5B5B5, 0xFFBABABA, 0xFFC5C5C5, 0xFFCACACA, 0xFFD5D5D5, 0xFFDADADA, 0xFFE5E5E5, 0xFFEAEAEA, 0xFFF5F5F5, 0xFFFAFAFA, 0xFFFFFFFF];
var colorsRainbow =   [0xFF000000, 0xFF220000, 0xFF440000, 0xFF880000, 0xFFBB0000, 0xFFFF0000, 0xFFFF2200, 0xFFFF4400, 0xFFFF8800, 0xFFFFBB00, 0xFFFFFF00, 0xFFBBFF00, 0xFF88FF00, 0xFF22FF00, 0xFF44FF00, 0xFF00FF00, 0xFF00FF22, 0xFF00FF44, 0xFF00FF88, 0xFF00FFBB, 0xFF00FFFF, 0xFF00BBFF, 0xFF0088FF, 0xFF0044FF, 0xFF0022FF, 0xFF0000FF, 0xFF2200FF, 0xFF4400FF, 0xFF8800FF, 0xFFBB00FF, 0xFFFF00FF, 0xFFFF22FF, 0xFFFF44FF, 0xFFFF88FF];
var colors = colorsClassic;
var colorsLookup = {};

document.getElementById("heightSlider").oninput = () => { heightMult = 2.0 - parseFloat(document.getElementById("heightSlider").value); }
document.getElementById("windSlider").oninput = () => { windMult = parseFloat(document.getElementById("windSlider").value); }
window.addEventListener("mousemove", SetTouchPos );
window.addEventListener("mousedown", e => { touch.active = true });
window.addEventListener("mouseup", e => { touch.active = false });
window.addEventListener("touchstart", e => { SetTouchPos(e.touches[0]); touch.active = true; } );
window.addEventListener("touchend", e => { touch.active = false } );
window.addEventListener("touchcancel", e => { touch.active = false } );
window.addEventListener("touchmove", e => { SetTouchPos(e.touches[0]); } );

function Init(colorPalette)
{
    colors = colorPalette;
    colorsLookup = {};
    colors.forEach((color, i) => colorsLookup[color] = i);
    framebuffer32Bit.fill(0xFF000000);
    framebuffer32Bit.fill(colors[colors.length - 1], (canvas.height - 1) * canvas.width, framebuffer32Bit.length);
}

function GameLoop()
{
    for (let pixelIdx = 0; pixelIdx < (canvas.height - 1) * canvas.width; pixelIdx++)
    {
        let dst = Math.max(Math.min(Math.round((pixelIdx - 1) + (Math.random() * 2.5) + windMult), framebuffer32Bit.length), 0);
        let src = pixelIdx + canvas.width;
        framebuffer32Bit[dst] = colors[Math.max(colorsLookup[framebuffer32Bit[src]] - Math.round(Math.random() * heightMult), 0)];
    }

    if (touch.active && touch.x )
    {
        for (let i = 0; i < 4; i++)
        {
            let touchPixelIdx = (Math.round(touch.y + i) * canvas.width) + Math.round(touch.x);
            framebuffer32Bit.fill(colors[colors.length - 1], Math.max(touchPixelIdx - 3, 0), Math.min(touchPixelIdx + 3, framebuffer32Bit.length));
        }
    }

    ctx.putImageData(framebuffer, 0, 0);
    window.requestAnimationFrame(GameLoop);
}

function SetTouchPos(event)
{
    touch.x = (event.clientX - canvas.getBoundingClientRect().left) / 4.0;     // Screen scale factor = 4 (see index.html)
    touch.y = (event.clientY - canvas.getBoundingClientRect().top) / 4.0;
        
    if (touch.x >= 0 && touch.x < canvas.width && touch.y >= 0 && touch.y < canvas.height)
    {
        event.preventDefault();
    }
    else
    {
        touch.x = 0;
        touch.y = 0;
    }
}

Init(colorsClassic);
window.requestAnimationFrame(GameLoop);