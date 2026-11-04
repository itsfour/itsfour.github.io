---
title: Markdown Publishing Guide
date: 2026-11-05
category: GUIDE
---

# Publishing with Markdown

ITSFOUR_ HUB uses Markdown files to create publications.

## Step 1: Create a Markdown file

For example:

`my-first-post.md`

## Step 2: Add metadata

At the beginning of the file:

```yaml
---
title: My First Post
date: 2026-11-05
category: TUTORIAL
---
```

## Step 3: Write your content

You can use Markdown syntax:

```markdown
# Hello World

This is my first publication.

- HTML
- CSS
- JavaScript
```

## Step 4: Register the post

Open `posts/index.json` and add this object:

```json
{
    "slug": "my-first-post",
    "title": "My First Post",
    "description": "My first publication.",
    "category": "TUTORIAL",
    "date": "2026-11-05",
    "tags": ["tutorial"]
}
```

Remember to add a comma between objects if the JSON file already contains other publications.

## Step 5: Publish

Commit your changes to GitHub.

Your article will appear automatically on the homepage.

Its URL will look like:

`post.html?slug=my-first-post`

---

**ITSFOUR_ HUB**  
Markdown-powered publishing.