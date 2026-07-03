(function () {
  var storageKey = "advisory-theme";
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  if (!toggle) {
    return;
  }

  function setTheme(theme) {
    var isLight = theme === "light";
    root.setAttribute("data-theme", isLight ? "light" : "dark");
    toggle.setAttribute("aria-pressed", isLight ? "true" : "false");

    var label = toggle.querySelector(".theme-toggle-label");
    if (label) {
      label.textContent = isLight ? "Light" : "Dark";
    }
  }

  var current = root.getAttribute("data-theme");
  if (current !== "light" && current !== "dark") {
    current = "dark";
  }
  setTheme(current);

  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch (err) {
      // Ignore localStorage write errors and still apply selected theme.
    }
  });
})();
