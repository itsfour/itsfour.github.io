(() => {
    "use strict";

    const ARTICLE = document.getElementById("article");

    if (!ARTICLE) {
        console.error("[ITSFOUR HUB] Không tìm thấy #article");
        return;
    }

    const CDN = {
        marked: "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
        purify: "https://cdn.jsdelivr.net/npm/dompurify@3.2.6/dist/purify.min.js"
    };

    // ==============================
    // LOAD LIBRARIES
    // ==============================

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = [...document.scripts].find(
                script => script.src === src
            );

            if (existing) {
                if (
                    (src.includes("marked") && window.marked) ||
                    (src.includes("purify") && window.DOMPurify)
                ) {
                    resolve();
                    return;
                }

                existing.addEventListener("load", resolve, { once: true });
                existing.addEventListener("error", reject, { once: true });
                return;
            }

            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;

            document.head.appendChild(script);
        });
    }

    async function loadLibraries() {
        if (!window.marked) {
            await loadScript(CDN.marked);
        }

        if (!window.DOMPurify) {
            await loadScript(CDN.purify);
        }

        if (!window.marked || !window.DOMPurify) {
            throw new Error("Không thể tải thư viện Markdown.");
        }
    }

    // ==============================
    // GET SLUG
    // ==============================

    function getSlug() {
        const params = new URLSearchParams(location.search);
        const slug = params.get("slug");

        if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
            return null;
        }

        return slug;
    }

    // ==============================
    // PARSE FRONT MATTER
    // Đồng bộ với workflow Python
    // ==============================

    function parseFrontMatter(markdown) {
        const result = {
            metadata: {
                title: "",
                description: "",
                category: "GENERAL",
                date: "",
                tags: []
            },
            content: markdown
        };

        const match = markdown.match(
            /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/
        );

        if (!match) {
            return result;
        }

        const frontMatter = match[1];

        result.content = markdown.slice(match[0].length);

        frontMatter.split(/\r?\n/).forEach(line => {
            const separator = line.indexOf(":");

            if (separator === -1) return;

            const key = line
                .slice(0, separator)
                .trim()
                .toLowerCase();

            let value = line
                .slice(separator + 1)
                .trim();

            // Bỏ dấu nháy bao quanh giá trị
            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1);
            }

            if (key === "tags") {
                result.metadata.tags = parseTags(value);
                return;
            }

            if (Object.prototype.hasOwnProperty.call(
                result.metadata,
                key
            )) {
                result.metadata[key] = value;
            }
        });

        return result;
    }

    // Hỗ trợ:
    // tags: [Android, Mod, Tutorial]
    // tags: Android, Mod, Tutorial

    function parseTags(value) {
        value = value.trim();

        if (value.startsWith("[") && value.endsWith("]")) {
            value = value.slice(1, -1);
        }

        if (!value) return [];

        return value
            .split(",")
            .map(tag => tag.trim().replace(/^["']|["']$/g, ""))
            .filter(Boolean);
    }

    // ==============================
    // ESCAPE HTML
    // ==============================

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    // ==============================
    // MARKDOWN RENDER
    // ==============================

    function renderMarkdown(content) {
        marked.setOptions({
            gfm: true,
            breaks: false
        });

        const rawHTML = marked.parse(content);

        // Làm sạch HTML trước khi đưa vào trang
        return DOMPurify.sanitize(rawHTML, {
            USE_PROFILES: {
                html: true
            },
            ADD_ATTR: [
                "target",
                "rel"
            ]
        });
    }

    // ==============================
    // FORMAT DATE
    // ==============================

    function formatDate(value) {
        if (!value) return "";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(date);
    }

    // ==============================
    // BUILD TAGS
    // ==============================

    function renderTags(tags) {
        if (!tags.length) return "";

        return `
            <div class="article-tags">
                ${tags.map(tag => `
                    <span class="tag">
                        #${escapeHTML(tag)}
                    </span>
                `).join("")}
            </div>
        `;
    }

    // ==============================
    // RENDER ARTICLE
    // ==============================

    function renderArticle(metadata, content) {
        const title = metadata.title || "Untitled";
        const description = metadata.description || "";
        const category = metadata.category || "GENERAL";
        const date = formatDate(metadata.date);

        document.title = `${title} | ITSFOUR_ HUB`;

        ARTICLE.innerHTML = `
            <article class="article">

                <div class="article-navigation">
                    <a href="index.html#publications">
                        ← BACK TO PUBLICATIONS
                    </a>
                </div>

                <header class="article-header">

                    <div class="article-category">
                        <span class="status-dot"></span>
                        ${escapeHTML(category)}
                    </div>

                    <h1 class="article-title">
                        ${escapeHTML(title)}
                    </h1>

                    ${description ? `
                        <p class="article-description">
                            ${escapeHTML(description)}
                        </p>
                    ` : ""}

                    <div class="article-meta">
                        ${date ? `
                            <span>
                                <span class="meta-label">DATE:</span>
                                ${escapeHTML(date)}
                            </span>
                        ` : ""}

                        <span>
                            <span class="meta-label">STATUS:</span>
                            PUBLISHED
                        </span>
                    </div>

                    ${renderTags(metadata.tags)}

                </header>

                <div class="article-content">
                    ${renderMarkdown(content)}
                </div>

                <footer class="article-footer">

                    <div class="article-actions">
                        <button type="button" id="share-post">
                            SHARE
                        </button>

                        <button type="button" id="copy-post">
                            COPY LINK
                        </button>
                    </div>

                    <div class="article-footer-text">
                        END OF DOCUMENT //
                        ITSFOUR_ HUB
                    </div>

                </footer>

            </article>
        `;

        bindActions();
    }

    // ==============================
    // SHARE & COPY
    // ==============================

    function bindActions() {
        const shareButton = document.getElementById("share-post");
        const copyButton = document.getElementById("copy-post");

        const shareData = {
            title: document.title,
            text: document.querySelector(".article-description")
                ?.textContent || document.title,
            url: location.href
        };

        shareButton?.addEventListener("click", async () => {
            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    await copyText(location.href);
                    showMessage("LINK COPIED");
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    showMessage("SHARE FAILED");
                }
            }
        });

        copyButton?.addEventListener("click", async () => {
            try {
                await copyText(location.href);
                showMessage("LINK COPIED");
            } catch {
                showMessage("COPY FAILED");
            }
        });
    }

    async function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const textarea = document.createElement("textarea");

        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();

        const success = document.execCommand("copy");

        textarea.remove();

        if (!success) {
            throw new Error("Copy failed");
        }
    }

    function showMessage(message) {
        let toast = document.getElementById("hub-toast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "hub-toast";

            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toast.timer);

        toast.timer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    }

    // ==============================
    // ERROR DISPLAY
    // ==============================

    function showError(title, description) {
        document.title = `${title} | ITSFOUR_ HUB`;

        ARTICLE.innerHTML = `
            <div class="article-error">

                <div class="article-category">
                    <span class="status-dot"></span>
                    SYSTEM MESSAGE
                </div>

                <h1>${escapeHTML(title)}</h1>

                <p>${escapeHTML(description)}</p>

                <a href="index.html#publications">
                    ← BACK TO PUBLICATIONS
                </a>

            </div>
        `;
    }

    // ==============================
    // LOAD POST
    // ==============================

    async function loadPost() {
        const slug = getSlug();

        if (!slug) {
            showError(
                "404 // INVALID REQUEST",
                "The requested publication does not exist."
            );
            return;
        }

        ARTICLE.innerHTML = `
            <div class="article-loading">
                <span class="status-dot"></span>
                LOADING PUBLICATION...
            </div>
        `;

        try {
            await loadLibraries();

            const response = await fetch(
                `posts/${encodeURIComponent(slug)}.md`
            );

            if (!response.ok) {
                throw new Error("POST_NOT_FOUND");
            }

            const markdown = await response.text();

            const parsed = parseFrontMatter(markdown);

            renderArticle(
                parsed.metadata,
                parsed.content
            );

        } catch (error) {
            console.error("[ITSFOUR HUB]", error);

            if (error.message === "POST_NOT_FOUND") {
                showError(
                    "404 // POST NOT FOUND",
                    "This publication may have been removed or does not exist."
                );
            } else {
                showError(
                    "500 // LOAD ERROR",
                    "Unable to load this publication. Please try again later."
                );
            }
        }
    }

    // START
    loadPost();

})();