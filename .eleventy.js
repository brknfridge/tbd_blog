const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("_ds");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addCollection("posts", function (api) {
    return api.getFilteredByGlob("blogs/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("dateDisplay", function (date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("readTime", function (content) {
    if (!content) return 5;
    const words = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  });

  eleventyConfig.addFilter("initials", function (name) {
    if (!name) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  });

  eleventyConfig.addFilter("padNum", function (n) {
    return String(n).padStart(2, "0");
  });

  eleventyConfig.addFilter("limit", function (arr, n) {
    return Array.isArray(arr) ? arr.slice(0, n) : [];
  });

  eleventyConfig.addFilter("excludeUrl", function (arr, url) {
    return Array.isArray(arr) ? arr.filter((p) => p.url !== url) : [];
  });

  eleventyConfig.addFilter("uniqueAuthors", function (posts) {
    const seen = new Set();
    return (posts || []).filter((p) => {
      const k = p.data && p.data.author;
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  });

  const md = markdownIt({ html: true, linkify: true, typographer: true });
  eleventyConfig.setLibrary("md", md);

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
