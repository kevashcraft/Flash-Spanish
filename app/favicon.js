const jdenticon = require('jdenticon')
const fs = require('fs')

let size = 2400
let hash = 'Spanish Flash!'

jdenticon.config = {
    hues: [58],
    lightness: {
        color: [0.40, 0.80],
        grayscale: [0.30, 0.90]
    },
    saturation: {
        color: 0.92,
        grayscale: 0.20
    },
    backColor: "#ff8103f0"
};

let png = jdenticon.toPng(hash, size);

fs.writeFileSync('public/favicon.ico', png);
