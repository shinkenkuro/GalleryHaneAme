fetch('data.json')
            .then(response => response.json())
            .then(jsonData => {
                // Populate folder list
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

            // Add "Back" button functionality
            backBtn.addEventListener('click', () => {
                folderList.classList.remove('hidden');
                imageGrid.classList.add('hidden');
            });

            const images = jsonData.images[folder];

            grid.innerHTML = ''; // Clear any existing images
            images.forEach((imageUrl, index) => {
                const imageDiv = document.createElement('div');
                imageDiv.classList.add('relative', 'bg-gray-800', 'p-4', 'rounded-lg');
                
                const img = document.createElement('img');
                img.classList.add('w-40', 'h-full', 'rounded-lg');
                img.src = extractImageSrc(imageUrl);
                img.alt = `Image ${index + 1}`;
                
                const filename = document.createElement('p');
                filename.classList.add('text-center', 'mt-2', 'text-sm');
                filename.innerText = `Image ${index + 1}`;

                imageDiv.appendChild(img);
                imageDiv.appendChild(filename);
                imageDiv.addEventListener('click', () => openSlideshow(index, images));
                grid.appendChild(imageDiv);
            });
        }

        // Extract image URL from the [url][img] string
        function extractImageSrc(urlString) {
            const regex = /https:\/\/[^ ]+/;
            const match = urlString.match(regex);
            return match ? match[0] : '';
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

            const imageUrl = extractImageSrc(currentImages[currentIndex]);
            slideshowImage.src = imageUrl;
            filename.innerText = `Image ${currentIndex + 1}`;

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