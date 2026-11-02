# Birthday scrapbook starter

A small, free-to-run birthday website made with plain HTML, CSS and JavaScript. No accounts, paid tools, or subscriptions are needed to preview it.

## Open it

Open `index.html` in a web browser. The page also works on a phone-sized screen.

## Add photos later

The three labeled spaces are grouped as **Her**, **Family**, and **Memories**. When you are ready, make a folder named `photos` beside `index.html`, copy selected pictures there, and replace each `.photo-placeholder` block in `index.html` with an image such as:

```html
<img class="photo-placeholder" src="photos/her-01.jpg" alt="A short description of the photo">
```

Keep the pictures you choose in `photos`, and update the file name and alt text for each image. You can add more `<article class="photo-group">…</article>` blocks for more pictures.

## Personalise the words

Edit the welcome text, date, photo captions, and the text inside `#letter-note` in `index.html`. The square-bracket text is a reminder to add your own details; there are no invented personal memories.

## Files

- `index.html` — the page structure and editable words
- `styles.css` — colours, spacing, layout, and mobile styling
- `script.js` — opens and closes the surprise note

The optional display fonts load from Google Fonts when internet is available. The site uses system fallback fonts if it is offline.

## Publishing

This starter is not published. If you later choose to put it online, GitHub Pages has a free option; publishing can be a separate step.
