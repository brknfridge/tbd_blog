module.exports = {
  layout: "post.njk",
  tags: ["posts"],
  eleventyComputed: {
    permalink: (data) => `/blog/p/${data.page.fileSlug}/`,
  },
};
