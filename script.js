let currentImage = 0;
const images = document.querySelectorAll('.banner img');

function showNextImage() {
    images[currentImage].classList.remove('active');
    currentImage = (currentImage + 1) % images.length;
    images[currentImage].classList.add('active');
}

setInterval(showNextImage, 3000);

function toggleContent(menuId) {
    const contents = document.querySelectorAll('.menu-content');
    contents.forEach(content => {
        if (content.id === menuId) {
            content.classList.add('active-content');
        } else {
            content.classList.remove('active-content');
        }
    });
}       

const links = document.querySelectorAll('nav a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                links.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            });
        });


//* upload file
function previewFile() {
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];
    const filePreview = document.getElementById('filePreview');
    const videoPreview = document.getElementById('videoPreview');

    if (file) {
        const fileURL = URL.createObjectURL(file);
        if (file.type.startsWith('image/')) {
            filePreview.src = fileURL;
            filePreview.style.display = 'block';
            videoPreview.style.display = 'none';
        } else if (file.type.startsWith('video/')) {
            videoPreview.src = fileURL;
            videoPreview.style.display = 'block';
            filePreview.style.display = 'none';
        }
    }
}

function uploadContent() {
    const fileInput = document.getElementById('fileUpload');
    const username = document.getElementById('username').value;
    const content = document.getElementById('content').value || "Tidak ada isian.";
    const postsContainer = document.getElementById('posts');

    if (username.trim() === "") {
        alert("Nama Anda wajib diisi.");
        return;
    }

    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    const currentTime = new Date().toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    postDiv.innerHTML = `<strong>${username}</strong> (dikirim pada ${currentTime}): <p>${content}</p>`;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileURL = URL.createObjectURL(file);
        const fileType = file.type.split('/')[0];

        if (fileType === 'image') {
            postDiv.innerHTML += `<img src="${fileURL}" alt="Gambar"><br>`;
        } else if (fileType === 'video') {
            postDiv.innerHTML += `<video controls><source src="${fileURL}" type="${file.type}">Your browser does not support the video tag.</video><br>`;
        }
    }

    // Like functionality
    postDiv.innerHTML += `<div class="social-buttons">
        <button onclick="likePost(this)">Like</button>
        <span class="like-count">Likes: <span class="like-number">0</span></span>
    </div>`;

    // Comment area
    postDiv.innerHTML += `
    <div class="comment-area">
        <input type="text" placeholder="Nama Anda untuk komentar" class="comment-username" required>
        <input type="text" placeholder="Komentar Anda" class="comment-input" required>
        <button onclick="addComment(this)">Kirim</button>
        <div class="comments"></div>
    </div>`;

    // Share buttons with icons
    postDiv.innerHTML += `<div class="social-icons">
        <strong>Berbagi ke:</strong>
        <a href="#" onclick="sharePost(event, 'facebook', '${username}: ${content}')"><img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook"></a>
        <a href="#" onclick="sharePost(event, 'whatsapp', '${username}: ${content}')"><img src="https://img.icons8.com/ios-filled/50/000000/whatsapp.png" alt="WhatsApp"></a>
        <a href="#" onclick="sharePost(event, 'twitter', '${username}: ${content}')"><img src="https://img.icons8.com/ios-filled/50/000000/twitter.png" alt="Twitter"></a>
        <a href="#" onclick="sharePost(event, 'instagram', '${username}: ${content}')"><img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram"></a>
    </div>`;

    // Insert new post at the top
    postsContainer.prepend(postDiv);
    fileInput.value = ''; // Reset file input
    document.getElementById('username').value = ''; // Reset username input
    document.getElementById('content').value = ''; // Reset content input
    document.getElementById('filePreview').style.display = 'none'; // Hide image preview
    document.getElementById('videoPreview').style.display = 'none'; // Hide video preview
}

function likePost(button) {
    const postDiv = button.closest('.post');
    const likeCountElement = postDiv.querySelector('.like-number');
    let likeCount = parseInt(likeCountElement.textContent);
    
    if (button.textContent === "Like") {
        button.textContent = "Unlike";
        likeCount += 1;
    } else {
        button.textContent = "Like";
        likeCount -= 1;
    }
    likeCountElement.textContent = likeCount;
}

function addComment(button) {
    const commentArea = button.closest('.comment-area');
    const nameInput = commentArea.querySelector('.comment-username');
    const commentInput = commentArea.querySelector('.comment-input');
    const commentsDiv = commentArea.querySelector('.comments');

    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if (name === "" || comment === "") {
        alert("Nama dan komentar tidak boleh kosong.");
        return;
    }

    const currentTime = new Date().toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const commentDiv = document.createElement('div');
    commentDiv.textContent = `${name} (dikirim pada ${currentTime}): ${comment}`;
    commentsDiv.prepend(commentDiv); // Insert newest comment at the top

    nameInput.value = ''; // Reset name input
    commentInput.value = ''; // Reset comment input
}

function sharePost(event, platform, content) {
    event.preventDefault();
    const encodedContent = encodeURIComponent(content);
    const currentURL = encodeURIComponent(window.location.href);
    let shareURL;

    switch(platform) {
        case 'facebook':
            shareURL = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;
            break;
        case 'whatsapp':
            shareURL = `https://api.whatsapp.com/send?text=${encodedContent} ${currentURL}`;
            break;
        case 'twitter':
            shareURL = `https://twitter.com/intent/tweet?text=${encodedContent}&url=${currentURL}`;
            break;
        case 'instagram':
            alert("Fitur berbagi ke Instagram tidak dapat dilakukan melalui URL. Silakan salin dan tempel.");
            return;
    }

    // Copy the share URL to clipboard
    navigator.clipboard.writeText(shareURL).then(() => {
        alert('URL telah disalin ke clipboard! Anda dapat membagikannya sekarang.');
    });

    window.open(shareURL, '_blank');
}