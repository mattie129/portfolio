let currentIndex = 0;
let totalImages = document.querySelectorAll('.image').length;
let counter = document.getElementById('counter');
console.log(counter);

function showImage(index) {
    let images = document.querySelectorAll('.image');
    images.forEach((img, i) => {
        img.style.display = i === index ? 'block' : 'none';
    });
    counter.textContent = `${index + 1}/${totalImages}`;
}

function changeImage(step) {
    currentIndex += step;

    if (currentIndex < 0) {
        currentIndex = totalImages - 1;
    } else if (currentIndex >= totalImages) {
        currentIndex = 0;
    }

    showImage(currentIndex);
}

showImage(currentIndex);