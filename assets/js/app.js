const postList = document.getElementById("post-list");
const searchInput = document.getElementById("search");
const postCount = document.getElementById("post-count");
const empty = document.getElementById("empty");

let posts = [];

async function loadPosts() {
    try {
        const response = await fetch("posts/index.json");

        if (!response.ok) {
            throw new Error("Cannot load publications");
        }

        posts = await response.json();

        postCount.textContent = posts.length;

        renderPosts(posts);

    } catch (error) {
        postList.innerHTML =
            '<div class="empty">Unable to load publications.</div>';
    }
}

function renderPosts(data) {
    postList.innerHTML = "";

    empty.hidden = data.length !== 0;

    data.forEach(post => {
        const card = document.createElement("article");
        card.className = "post-card";

        const meta = document.createElement("div");
        meta.className = "post-meta";
        meta.textContent =
            `${post.category} / ${post.date}`;

        const title = document.createElement("h3");
        title.textContent = post.title;

        const description = document.createElement("p");
        description.textContent = post.description;

        const link = document.createElement("a");
        link.className = "read-more";
        link.href = `post.html?slug=${encodeURIComponent(post.slug)}`;
        link.textContent = "Read publication →";

        card.append(meta, title, description, link);

        postList.appendChild(card);
    });
}

searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();

    const filtered = posts.filter(post => {
        const content = [
            post.title,
            post.description,
            post.category,
            ...(post.tags || [])
        ].join(" ").toLowerCase();

        return content.includes(keyword);
    });

    renderPosts(filtered);
});

loadPosts();