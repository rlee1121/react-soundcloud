export function loadImage(url) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = function onload() {
            resolve();
        };
        image.src = url;
    });
}
