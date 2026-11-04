const postsGrid = document.getElementById("postsGrid");
const categoryList = document.getElementById("categoryList");
const searchInput = document.getElementById("searchInput");
const postCount = document.getElementById("postCount");
const emptyBox = document.getElementById("emptyBox");

let allPosts = [];
let selectedCategory = "ALL";


function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}


function formatDate(date) {
    if (!date) return "CHƯA CÓ NGÀY";

    const parsed = new Date(date + "T00:00:00");

    if (Number.isNaN(parsed.getTime())) {
        return escapeHTML(date);
    }

    return parsed.toLocaleDateString("vi-VN");
}


function renderCategories() {

    const categories = [
        ...new Set(
            allPosts
                .map(post => post.category || "GENERAL")
                .map(category => category.toUpperCase())
        )
    ];

    categoryList.innerHTML = `
        <button class="category-btn active" data-category="ALL">
            TẤT CẢ
        </button>
    `;

    categories.forEach(category => {

        const button = document.createElement("button");

        button.className = "category-btn";
        button.dataset.category = category;
        button.textContent = category;

        categoryList.appendChild(button);

    });

}


function renderPosts() {

    const keyword = searchInput.value
        .trim()
        .toLowerCase();

    const filtered = allPosts.filter(post => {

        const category = (
            post.category || "GENERAL"
        ).toUpperCase();

        const matchesCategory =
            selectedCategory === "ALL" ||
            category === selectedCategory;

        const searchable = [
            post.title,
            post.description,
            post.category,
            ...(post.tags || [])
        ].join(" ").toLowerCase();

        const matchesSearch =
            searchable.includes(keyword);

        return matchesCategory && matchesSearch;

    });


    postCount.textContent =
        `${filtered.length} BÀI VIẾT`;

    postsGrid.innerHTML = "";

    emptyBox.hidden = filtered.length !== 0;


    filtered.forEach(post => {

        const card = document.createElement("article");

        card.className = "post-card";

        const title = escapeHTML(post.title);
        const description = escapeHTML(
            post.description || "Chưa có mô tả cho bài viết này."
        );

        const category = escapeHTML(
            post.category || "GENERAL"
        );

        const date = formatDate(post.date);

        card.innerHTML = `
            <div class="post-meta">
                <span class="post-category">
                    ${category}
                </span>

                <span>${date}</span>
            </div>

            <h3>${title}</h3>

            <p>${description}</p>

            <a
                class="post-read"
                href="post.html?slug=${encodeURIComponent(post.slug)}"
            >
                ĐỌC BÀI VIẾT →
            </a>
        `;

        postsGrid.appendChild(card);

    });

}


categoryList.addEventListener("click", event => {

    const button = event.target.closest(".category-btn");

    if (!button) return;

    document.querySelectorAll(".category-btn")
        .forEach(item => item.classList.remove("active"));

    button.classList.add("active");

    selectedCategory = button.dataset.category;

    renderPosts();

});


searchInput.addEventListener("input", renderPosts);


document.addEventListener("keydown", event => {

    if (
        event.key === "/" &&
        document.activeElement !== searchInput
    ) {
        event.preventDefault();
        searchInput.focus();
    }

    if (
        event.key === "Escape" &&
        document.activeElement === searchInput
    ) {
        searchInput.value = "";
        searchInput.blur();
        renderPosts();
    }

});


async function loadPosts() {

    try {

        const response = await fetch(
            "posts/index.json?t=" + Date.now()
        );

        if (!response.ok) {
            throw new Error("Không thể tải danh sách bài viết.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Dữ liệu bài viết không hợp lệ.");
        }

        allPosts = data;

        renderCategories();
        renderPosts();

    } catch (error) {

        postsGrid.innerHTML = `
            <div class="error-box">
                LỖI: ${escapeHTML(error.message)}
                <br><br>
                Vui lòng thử tải lại trang.
            </div>
        `;

        postCount.textContent = "LỖI TẢI DỮ LIỆU";

    }

}


loadPosts();