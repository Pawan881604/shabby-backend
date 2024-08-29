exports.url_formet = async (slug) => {
  let url = slug.replace(/[^\w\s]/gi, "-");
  url = url.toLowerCase();
  url = url.replace(/\s+/g, "-");
  url = url.replace(/-+/g, "-");
  url = url.replace(/^-+|-+$/g, "");

  return url;
};
