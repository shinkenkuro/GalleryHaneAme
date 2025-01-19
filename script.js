// Fetch JSON data and populate folder list
fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        const folderList = document.getElementById('folderList');
        jsonData.folders.forEach(folder => {
            const folderDiv = document.createElement('div');
            folderDiv.classList.add('bg-gray-700', 'p-4', 'rounded-lg', 'cursor-pointer', 'hover:bg-gray-600');
            folderDiv.innerText = folder;
            folderDiv.addEventListener('click', () => showMedia(folder, jsonData));
            folderList.appendChild(folderDiv);
        });
    })
    .catch(error => console.error('Error loading JSON data:', error));

// Show media (images/videos) in the selected folder
function showMedia(folder, jsonData) {
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

    const media = jsonData.images[folder];
    grid.innerHTML = ''; // Clear any existing content

    media.forEach((mediaData, index) => {
        const { url, title, type } = parseMediaData(mediaData);

        const mediaDiv = document.createElement('div');
        mediaDiv.classList.add('relative', 'bg-gray-800', 'p-4', 'rounded-lg');

        let mediaElement;
        if (type === 'video') {
            if (url.includes('saint2.su')) {
                mediaElement = createSaintIframe(url);
            } else {
                mediaElement = document.createElement('video');
                mediaElement.classList.add('w-full', 'h-full', 'rounded-lg');
                mediaElement.src = url;
                mediaElement.controls = true;
                mediaElement.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent triggering the slideshow when playing the video
                });
            }
        } else {
            mediaElement = document.createElement('img');
            mediaElement.classList.add('w-40', 'h-auto', 'rounded-lg');
            mediaElement.src = url;
            mediaElement.alt = title || `Media ${index + 1}`;
        }

        const filename = document.createElement('p');
        filename.classList.add('text-center', 'mt-2', 'text-sm');
        filename.innerText = title || `Media ${index + 1}`;

        mediaDiv.appendChild(mediaElement);
        mediaDiv.appendChild(filename);
        mediaDiv.addEventListener('click', () => openSlideshow(index, media));
        grid.appendChild(mediaDiv);
    });
}

// Parse media data (support both URL-only and URL+title format)
function parseMediaData(mediaData) {
    const regex = /(?<url>https:\/\/[^\s]+)(?:\s\[(?<title>.+?)\])?(?:\s\((?<type>image|video)\))?/;
    const match = mediaData.match(regex);
    return {
        url: match ? match.groups.url : '',
        title: match && match.groups.title ? match.groups.title : null,
        type: match && match.groups.type ? match.groups.type : 'image'
    };
}

// Slideshow functionality
let currentIndex = 0;
let currentMedia = [];

function openSlideshow(index, media) {
    currentIndex = index;
    currentMedia = media;
    showSlideshow();
}

function showSlideshow() {
    const slideshowOverlay = document.getElementById('slideshowOverlay');
    const slideshowContainer = document.getElementById('slideshowContent');
    const filename = document.getElementById('imageFilename');

    if (!currentMedia || currentIndex < 0 || currentIndex >= currentMedia.length) {
        console.error('Invalid media index or media list is empty');
        return;
    }

    const { url, title, type } = parseMediaData(currentMedia[currentIndex]);
    slideshowContainer.innerHTML = ''; // Clear previous content

    let mediaElement;
    if (type === 'video') {
        if (url.includes('saint2.su')) {
            mediaElement = createSaintIframe(url);
        } else {
            mediaElement = createVideoElement(url);
        }
    } else {
        mediaElement = document.createElement('img');
        mediaElement.classList.add('max-w-full', 'rounded-lg');
        mediaElement.src = url;
        mediaElement.alt = title || `Media ${currentIndex + 1}`;
    }

    slideshowContainer.appendChild(mediaElement);
    filename.innerText = title || `Media ${currentIndex + 1}`;

    slideshowOverlay.classList.remove('hidden');
}

function createVideoElement(url) {
    const video = document.createElement('video');
    video.classList.add('max-w-full', 'rounded-lg');
    video.src = url;
    video.controls = true;
    video.autoplay = true;
    return video;
}

function createSaintIframe(url) {
    const iframe = document.createElement('iframe');
    iframe.classList.add('max-w-full', 'rounded-lg');
    iframe.src = url;
    iframe.style.border = 'none';
    iframe.loading = 'lazy';
    iframe.allow = 'fullscreen';
    return iframe;
}

// Navigation for slideshow
document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentMedia.length;
    showSlideshow();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentMedia.length) % currentMedia.length;
    showSlideshow();
});

// Close slideshow
document.getElementById('closeSlideshow').addEventListener('click', () => {
    document.getElementById('slideshowOverlay').classList.add('hidden');
});
