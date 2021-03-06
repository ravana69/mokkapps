const md = require("markdown-it")({
  html: true, // Enable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
});
const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();

const feedUrl = "https://www.mokkapps.de/rss.xml";
const websiteUrl = "https://www.mokkapps.de";
const twitterUrl = "https://www.twitter.com/mokkapps";
const linkedInUrl = "https://www.linkedin.com/in/michael-hoffmann-3b8933b1";
const blogPostLimit = 5;

(async () => {
  let blogPosts = "";
  try {
    blogPosts = await loadBlogPosts();
  } catch (e) {
    console.error(`Failed to load blog posts from ${websiteUrl}`, e);
  }

  const twitterImage = `<img src="https://github.com/mokkapps/mokkapps/blob/master/tweet.png" width="600">`;

  text = `My name is Michael Hoffmann. I am a freelance software engineer from Germany with focus on Angular. Welcome to my GitHub page!\n\n# Latest Blog Posts\n${blogPosts}\n# Last Tweet\n${twitterImage}\n\n[Follow me on Twitter](${twitterUrl}) | [Connect me on LinkedIn](${linkedInUrl}) | [Check out my website](${websiteUrl})`;

  const result = md.render(text);

  fs.writeFile("README.md", result, function (err) {
    if (err) return console.log(err);
    console.log(`${result} > README.md`);
  });
})();

async function loadBlogPosts() {
  const feed = await parser.parseURL(feedUrl);

  let links = "";

  feed.items.slice(0, blogPostLimit).forEach((item) => {
    links += `<li><a href=${item.link}>${item.title}</a></li>`;
  });

  return `
  <ul>
    ${links}
  </ul>
  <a href=${websiteUrl}/blog>More blog posts</a>
  `;
}
