import themes from "devtools-themes";

window.updateTheme = function(theme) {
  const root = document.body.parentNode;
  const appRoot = document.querySelector(".launchpad-root");

  root.className = "";
  appRoot.className = "launchpad-root";

  root.classList.add(`theme-${theme}`);
  appRoot.classList.add(`theme-${theme}`);
};

window.themeNames = Object.keys(themes);
window.updateThemes = function() {
  window.themeNames.forEach((theme, i) =>
    setTimeout(() => window.updateTheme(theme), i * 1000)
  );
};

window.setTimeout(() => {
  // remove the stylesheet where the original variables are defined
  // because we'll be assigning the variables to base16 definitions
  // e.g. :root .dark-theme { --theme-comment: #fff }
  document.styleSheets[2].ownerNode.remove();
  window.updateTheme("dracula");
}, 1000);
