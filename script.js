document.addEventListener('DOMContentLoaded', function () {
    let galleries = document.querySelectorAll('.gallery');

    galleries.forEach(gallery => {
        let currentIndex = 0;
        let images = gallery.querySelectorAll('.image');
        let totalImages = images.length;
        let counter = gallery.querySelector('.counter');
        
        function showImage(index) {
            images.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
            if (counter) {
                counter.textContent = `${index + 1}/${totalImages}`;
            }
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

        // Add event listeners to the buttons
        let prevButton = gallery.querySelector('#prev');
        let nextButton = gallery.querySelector('#next');

        if (prevButton) {
            prevButton.addEventListener('click', () => changeImage(-1));
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => changeImage(1));
        }

        // Initialize the first image
        showImage(currentIndex);
    });
});
