module.exports = {
  layout: "post.njk",
  tags: ["posts"],
  eleventyComputed: {
    permalink: (data) => `/p/${data.page.fileSlug}/`,
  },
};
