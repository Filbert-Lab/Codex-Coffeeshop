const { getHomeSnapshot } = require("../services/ssrHomeService");
const viewHelpers = require("../helpers/ssrViewHelpers");
const path = require("path");

function shouldRenderSsr(pathname) {
  return !pathname.startsWith("/api") && !path.extname(pathname);
}

async function renderApp(req, res, next) {
  if (!shouldRenderSsr(req.path)) return next();

  try {
    const isHome = req.path === "/";
    let homeData = null;

    if (isHome) {
      try {
        homeData = await getHomeSnapshot();
      } catch (error) {
        console.error("[SSR] Failed to load home snapshot:", error.message);
      }
    }

    res.set("Cache-Control", "no-store");
    return res.status(200).render("pages/app", {
      pathname: req.path,
      isHome,
      homeData,
      initialData: { home: isHome ? homeData : null },
      helpers: viewHelpers,
    });
  } catch (error) {
    console.error("[SSR] Failed to render app:", error.message);
    return next(error);
  }
}

module.exports = {
  renderApp,
  shouldRenderSsr,
};
