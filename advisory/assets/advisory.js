(function () {
  var storageKey = "advisory-theme";
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  var pdfLink = document.getElementById("downloadPdfLink");
  if (!toggle) {
    return;
  }

  function updatePdfLink(theme) {
    if (!pdfLink) {
      return;
    }
    var pdfFile = theme === "light" ? "courtney-driver-advisory-light.pdf" : "courtney-driver-advisory-dark.pdf";
    pdfLink.setAttribute("href", pdfFile);
    pdfLink.setAttribute("download", pdfFile);
  }

  function setTheme(theme) {
    var isLight = theme === "light";
    root.setAttribute("data-theme", isLight ? "light" : "dark");
    toggle.setAttribute("aria-pressed", isLight ? "true" : "false");

    var label = toggle.querySelector(".theme-toggle-label");
    if (label) {
      label.textContent = isLight ? "Light" : "Dark";
    }

    updatePdfLink(isLight ? "light" : "dark");
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
