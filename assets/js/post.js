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
    // BASE PATH
    // ==============================

    function getBasePath() {
        const script = [...document.scripts].find(item =>
            item.src.includes("/assets/js/post.js")
        );

        if (script) {
            return new URL("../../../", script.src).href;
        }

        return new URL("./", location.href).href;
    }

    const BASE_PATH = getBasePath();

    // ==============================
    // LOAD LIBRARIES
    // ==============================

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");

            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(
                new Error("Không thể tải thư viện: " + src)
            );

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
            throw new Error("MARKDOWN_LIBRARY_ERROR");
        }
    }

    // ==============================
    // GET SLUG
    // ==============================

    function getSlug() {
        const slug = new URLSearchParams(location.search).get("slug");

        if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
            return null;
        }

        return slug;
    }

    // ==============================
    // PARSE FRONT MATTER
    // ==============================

    function parseFrontMatter(markdown) {
        const metadata = {
            title: "",
            description: "",
            category: "GENERAL",
            date: "",
            tags: []
        };

        const match = markdown.match(
            /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/
        );

        if (!match) {
            return { metadata, content: markdown };
        }

        match[1].split(/\r?\n/).forEach(line => {
            const separator = line.indexOf(":");

            if (separator < 0) return;

            const key = line.slice(0, separator).trim().toLowerCase();
            const value = line.slice(separator + 1).trim();

            if (key === "tags") {
                metadata.tags = parseTags(value);
            } else if (
                Object.prototype.hasOwnProperty.call(metadata, key)
            ) {
                metadata[key] = value.replace(/^["']|["']$/g, "");
            }
        });

        return {
            metadata,
            content: markdown.slice(match[0].length)
        };
    }

    function parseTags(value) {
        value = value.trim();

        if (value.startsWith("[") && value.endsWith("]")) {
            value = value.slice(1, -1);
        }

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
    // MARKDOWN
    // ==============================

    function renderMarkdown(content) {
        marked.setOptions({
            gfm: true,
            breaks: false
        });

        return DOMPurify.sanitize(
            marked.parse(content),
            {
                USE_PROFILES: { html: true },
                ADD_ATTR: ["target", "rel"]
            }
        );
    }

    // ==============================
    // DATE
    // ==============================

    function formatDate(value) {
        if (!value) return "";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return value;

        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(date);
    }

    // ==============================
    // TAGS
    // ==============================

    function renderTags(tags) {
        if (!tags.length) return "";

        return `
            <div class="article-tags">
                ${tags.map(tag => `
                    <span class="tag">#${escapeHTML(tag)}</span>
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

        document.title = `${title} | ITSFOUR_ HUB`;

        ARTICLE.innerHTML = `
            <article class="article">

                <div class="article-navigation">
                    <a href="${BASE_PATH}index.html#publications">
                        ← BACK TO PUBLICATIONS
                    </a>
                </div>

                <header class="article-header">

                    <div class="article-category">
                        <span class="status-dot"></span>
                        ${escapeHTML(metadata.category || "GENERAL")}
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
                        ${metadata.date ? `
                            <span>
                                <span class="meta-label">DATE:</span>
                                ${escapeHTML(formatDate(metadata.date))}
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
                        <button type="button" id="share-post">SHARE</button>
                        <button type="button" id="copy-post">COPY LINK</button>
                    </div>

                    <div class="article-footer-text">
                        END OF DOCUMENT // ITSFOUR_ HUB
                    </div>

                </footer>

            </article>
        `;

        bindActions();
    }

    // ==============================
    // SHARE & COPY
    // ==============================

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

        if (!success) throw new Error("COPY_FAILED");
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

    function bindActions() {
        document.getElementById("share-post")?.addEventListener(
            "click",
            async () => {
                try {
                    if (navigator.share) {
                        await navigator.share({
                            title: document.title,
                            text: document.querySelector(
                                ".article-description"
                            )?.textContent || document.title,
                            url: location.href
                        });
                    } else {
                        await copyText(location.href);
                        showMessage("LINK COPIED");
                    }
                } catch (error) {
                    if (error.name !== "AbortError") {
                        showMessage("SHARE FAILED");
                    }
                }
            }
        );

        document.getElementById("copy-post")?.addEventListener(
            "click",
            async () => {
                try {
                    await copyText(location.href);
                    showMessage("LINK COPIED");
                } catch {
                    showMessage("COPY FAILED");
                }
            }
        );
    }

    // ==============================
    // ERROR
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

                <a href="${BASE_PATH}index.html#publications">
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
                "Invalid publication identifier."
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

            const postURL = new URL(
                `posts/${encodeURIComponent(slug)}.md`,
                BASE_PATH
            );

            console.log("[ITSFOUR HUB] Loading:", postURL.href);

            const response = await fetch(postURL.href, {
                cache: "no-store"
            });

            if (response.status === 404) {
                showError(
                    "404 // POST NOT FOUND",
                    "The requested Markdown file was not found."
                );
                return;
            }

            if (!response.ok) {
                throw new Error("HTTP_" + response.status);
            }

            const markdown = await response.text();
            const parsed = parseFrontMatter(markdown);

            renderArticle(parsed.metadata, parsed.content);

        } catch (error) {
            console.error("[ITSFOUR HUB]", error);

            showError(
                "500 // LOAD ERROR",
                "Unable to load publication. Check the browser console or try again."
            );
        }
    }

    loadPost();

})();
