document.addEventListener("DOMContentLoaded", () => {
    loadVideos();
});

function openUploadModal() {
    document.getElementById("uploadModal").style.display = "flex";
}

function closeUploadModal() {
    document.getElementById("uploadModal").style.display = "none";
}

function uploadVideo() {
    const videoFile = document.getElementById("videoFile").files[0];
    const videoTitle = document.getElementById("videoTitle").value;

    if (videoFile && videoTitle) {
        const videoData = {
            title: videoTitle,
            url: URL.createObjectURL(videoFile),
            comments: [],
            likes: 0,
            dislikes: 0
        };

        saveVideo(videoData);
        addVideoToDOM(videoData);
        closeUploadModal();
    } else {
        alert("Please provide both a video file and a title.");
    }
}

function saveVideo(videoData) {
    let videos = JSON.parse(localStorage.getItem("videos")) || [];
    videos.push(videoData);
    localStorage.setItem("videos", JSON.stringify(videos));
    notifyNewVideo();
}

function loadVideos() {
    let videos = JSON.parse(localStorage.getItem("videos")) || [];
    videos.forEach(videoData => addVideoToDOM(videoData));
}

function addVideoToDOM(videoData) {
    const videoGrid = document.getElementById("videoGrid");

    const videoCard = document.createElement("div");
    videoCard.className = "video-card";

    const videoElement = document.createElement("video");
    videoElement.src = videoData.url;
    videoElement.controls = true;

    const videoTitleElement = document.createElement("h3");
    videoTitleElement.textContent = videoData.title;

    // Like/Dislike Buttons
    const likeButton = document.createElement("button");
    likeButton.textContent = `👍 Like (${videoData.likes})`;
    likeButton.className = "like-button";
    likeButton.addEventListener("click", () => {
        videoData.likes++;
        updateLikeDislikeButtons(videoCard, videoData);
    });

    const dislikeButton = document.createElement("button");
    dislikeButton.textContent = `👎 Dislike (${videoData.dislikes})`;
    dislikeButton.className = "dislike-button";
    dislikeButton.addEventListener("click", () => {
        videoData.dislikes++;
        updateLikeDislikeButtons(videoCard, videoData);
    });

    const likeDislikeSection = document.createElement("div");
    likeDislikeSection.className = "like-dislike-section";
    likeDislikeSection.appendChild(likeButton);
    likeDislikeSection.appendChild(dislikeButton);

    const commentSection = document.createElement("div");
    commentSection.className = "comment-section";

    const commentTitle = document.createElement("h4");
    commentTitle.textContent = "Comments";

    const commentInput = document.createElement("div");
    commentInput.className = "comment-input";

    const commentTextInput = document.createElement("input");
    commentTextInput.type = "text";
    commentTextInput.placeholder = "Add a comment...";

    const commentButton = document.createElement("button");
    commentButton.textContent = "Comment";

    const commentList = document.createElement("div");
    commentList.className = "comment-list";

    videoData.comments.forEach(commentText => {
        const comment = document.createElement("div");
        comment.className = "comment";

        const commentParagraph = document.createElement("p");
        commentParagraph.textContent = commentText;

        comment.appendChild(commentParagraph);
        commentList.appendChild(comment);
    });

    commentButton.addEventListener("click", () => {
        const commentText = commentTextInput.value.trim();
        if (commentText) {
            const comment = document.createElement("div");
            comment.className = "comment";

            const commentParagraph = document.createElement("p");
            commentParagraph.textContent = commentText;

            comment.appendChild(commentParagraph);
            commentList.appendChild(comment);
            commentTextInput.value = "";

            videoData.comments.push(commentText);
            saveVideosToLocalStorage();
        }
    });

    commentInput.appendChild(commentTextInput);
    commentInput.appendChild(commentButton);
    commentSection.appendChild(commentTitle);
    commentSection.appendChild(commentInput);
    commentSection.appendChild(commentList);

    videoCard.appendChild(videoElement);
    videoCard.appendChild(videoTitleElement);
    videoCard.appendChild(likeDislikeSection);
    videoCard.appendChild(commentSection);

    videoGrid.appendChild(videoCard);
}

function updateLikeDislikeButtons(videoCard, videoData) {
    const likeButton = videoCard.querySelector(".like-button");
    const dislikeButton = videoCard.querySelector(".dislike-button");

    likeButton.textContent = `👍 Like (${videoData.likes})`;
    dislikeButton.textContent = `👎 Dislike (${videoData.dislikes})`;

    saveVideosToLocalStorage();
}

function saveVideosToLocalStorage() {
    let videos = document.getElementsByClassName("video-card");
    let videosData = [];

    for (let video of videos) {
        let title = video.getElementsByTagName("h3")[0].textContent;
        let url = video.getElementsByTagName("video")[0].src;
        let comments = Array.from(video.getElementsByClassName("comment-list")[0].getElementsByTagName("p")).map(p => p.textContent);
        let likes = parseInt(video.querySelector(".like-button").textContent.match(/\d+/)[0], 10);
        let dislikes = parseInt(video.querySelector(".dislike-button").textContent.match(/\d+/)[0], 10);

        videosData.push({ title, url, comments, likes, dislikes });
    }

    localStorage.setItem("videos", JSON.stringify(videosData));
}

function searchVideos() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const videos = document.getElementsByClassName("video-card");

    for (let video of videos) {
        const title = video.getElementsByTagName("h3")[0].textContent.toLowerCase();
        if (title.includes(searchInput)) {
            video.style.display = "block";
        } else {
            video.style.display = "none";
        }
    }
}

function notifyNewVideo() {
    localStorage.setItem("newVideo", "true");
}

window.addEventListener("storage", (event) => {
    if (event.key === "newVideo" && event.newValue === "true") {
        loadVideos();
        localStorage.setItem("newVideo", "false");
    }
});
