// Fetch JSON data and populate folder list
fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        const folderList = document.getElementById('folderList');
        jsonData.folders.forEach(folder => {
            const folderDiv = document.createElement('div');
            folderDiv.classList.add('bg-gray-700', 'p-4', 'rounded-lg', 'cursor-pointer', 'hover:bg-gray-600');
            folderDiv.innerText = folder;
            folderDiv.addEventListener('click', () => showImages(folder, jsonData));
            folderList.appendChild(folderDiv);
        });
    })
    .catch(error => console.error('Error loading JSON data:', error));

// Show images in the selected folder
function showImages(folder, jsonData) {
    const folderList = document.getElementById('folderList');
    const imageGrid = document.getElementById('imageGrid');
    const backBtn = document.getElementById('backBtn');
    const grid = document.getElementById('grid');

    folderList.classList.add('hidden');
    imageGrid.classList.remove('hidden');

    backBtn.addEventListener('click', () => {
        folderList.classList.remove('hidden');
        imageGrid.classList.add('hidden');
    });

    const images = jsonData.images[folder];
    grid.innerHTML = ''; // Clear any existing images

    images.forEach((imageData, index) => {
        const { url, title } = parseImageData(imageData);

        const imageDiv = document.createElement('div');
        imageDiv.classList.add('relative', 'bg-gray-800', 'p-4', 'rounded-lg');

        const img = document.createElement('img');
        img.classList.add('w-40', 'h-auto', 'rounded-lg');
        img.src = url;
        img.alt = title || `Image ${index + 1}`;

        const filename = document.createElement('p');
        filename.classList.add('text-center', 'mt-2', 'text-sm');
        filename.innerText = title || `Image ${index + 1}`;

        imageDiv.appendChild(img);
        imageDiv.appendChild(filename);
        imageDiv.addEventListener('click', () => openSlideshow(index, images));
        grid.appendChild(imageDiv);
    });
}

// Parse image data (support both URL-only and URL+title format)
function parseImageData(imageData) {
    const regex = /(?<url>https:\/\/[^\s]+)(?:\s\[(?<title>.+?)\])?/;
    const match = imageData.match(regex);
    return {
        url: match ? match.groups.url : '',
        title: match && match.groups.title ? match.groups.title : null
    };
}

// Slideshow functionality
let currentIndex = 0;
let currentImages = [];

function openSlideshow(index, images) {
    currentIndex = index;
    currentImages = images;
    showSlideshow();
}

function showSlideshow() {
    const slideshowOverlay = document.getElementById('slideshowOverlay');
    const slideshowImage = document.getElementById('slideshowImage');
    const filename = document.getElementById('imageFilename');

    const { url, title } = parseImageData(currentImages[currentIndex]);
    slideshowImage.src = url;
    filename.innerText = title || `Image ${currentIndex + 1}`;

    slideshowOverlay.classList.remove('hidden');
}

// Navigation for slideshow
document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    showSlideshow();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showSlideshow();
});

// Close slideshow
document.getElementById('closeSlideshow').addEventListener('click', () => {
    document.getElementById('slideshowOverlay').classList.add('hidden');
});
