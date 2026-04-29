"use strict";
const categories = [
  {
    slug: "Banking",
    title: "Banking",
    //description: "Contas digitais, beneficios de abertura e indicacoes para novos clientes.",
    //color: "#0078d7",
    color: "#EE1111",
    size: "small",
    icon: "🏦",
    links: [
      {
        name: "CIBC",
        description: "Earn CAD$75 after a CAD$100 deposit",
        url: "https://www.cibconline.cibc.com/ebm-resources/public/cibc-referral-app/client/index.html#/welcome?locale=en&xref=11117111617910455564&utrc=E2358:1"
      },
    ]
  },
  {
    slug: "Exchange",
    title: "Exchange",
    //description: "Cash Exchange",
    //color: "#d83b01",
    color: "#1E7145",
    size: "medium",
    icon: "💸",
    links: [
      {
        name: "Instarem",
        description: "Earn CAD$5 after transfer of CAD$500",
        url: "https://referral-link.onelink.me/gbf1/a43c48ca?deep_link_sub1=referral&deep_link_value=6KdPJz"      },
      {
        name: "Wise",
        description: "Your first international transfer up to CAD$3000 is completely free (must be within 30 days of signup)",
        url: "https://wise.com/invite/ihpc/ewerton1"
      }
    ]
  },
  {
    slug: "Trading",
    title: "Trading",
    //description: "Trading and Investiments",
    //color: "#107c10",
    color: "#2B5797",
    size: "large",
    icon: "📈",
    links: [
      {
	      name: "NDAX",
        description: "Earn between CAD$10-CAD$20 after deposit a minimum of CAD$100",
        url: "https://ref.ndax.io/NLZU/55z8m6zl"
      },
      {
        name: "Wealthsimple",
        description: "Earn CAD$25 after a CAD$100 deposit",
        url: "https://wealthsimple.com/invite/XWQAMS"
      },
      {
        name: "Interactive Brokers",
        description: "For each $300 in net deposits during the first year following the date of the first deposit will receive $1 worth of Class A common stock of Interactive Brokers Group",
        url: "https://ibkr.com/referral/ewerton562"
      }
    ]
  },
  {
    slug: "Telecom",
    title: "Telecom",
    //description: "Phone and Internet Services",
    //color: "#5c2d91",
    color: "#FFC40D",
    size: "small",
    icon: "📱",
    links: [
      {
        name: "Koodoo",
        description: "CAD$50 off on your next bill",
        url: "https://referme.to/ewertonf-115"
      },
    ]
  },
  {
    slug: "Cash Back",
    title: "Cash Back",
    //description: "Cash Back on online purchases",
    //color: "#e81123",
    color: "#9f00a7",
    size: "medium",
    icon: "🛒",
    links: [
      {
        name: "Rakuten Canada",
        description: "Join and get CAD$5 bonus",
        url: "https://www.rakuten.ca/r/ewerton"
      },
      {
        name: "Great Canadian Rebates",
        description: "Online shopping website that pays you Cash Back Rebates on online",
        url: "https://www.greatcanadianrebates.ca/register/278302/"
      },
    ]
  },
  {
    slug: "Credit Card",
    title: "Credit Card",
    //description: "Credit Card",
    //color: "#e81123",
    color: "#1D1D1D",
    size: "small",
    icon: "💳",
    links: [
      {
        name: "American Express",
        description: "Earn 1,250 Membership Rewards points (~CAD$12) for each monthly billing period in which spend CAD$750 in purchases on their Card in their first year",
        url: "https://americanexpress.com/en-ca/referral/cobalt?ref=eWeRTFUEsA"
      },
    ]
  }
];

const tileGrid = document.querySelector("#tileGrid");
const overlay = document.querySelector("#categoryOverlay");
const overlayPanel = document.querySelector(".overlay-panel");
const overlayTitle = document.querySelector("#overlayTitle");
const overlayDescription = document.querySelector("#overlayDescription");
const overlayIcon = document.querySelector("#overlayIcon");
const linksList = document.querySelector("#linksList");
const closeOverlayButton = document.querySelector("#closeOverlay");

let lastFocusedElement = null;

function createTile(category, index) {
  const tile = document.createElement("a");
  const size = ["small", "medium", "large"].includes(category.size) ? category.size : "medium";
  const slug = getCategorySlug(category);

  tile.className = `tile tile-${size}`;
  tile.id = `tile-${slug}`;
  tile.href = `#${slug}`;
  tile.style.backgroundColor = category.color;
  tile.setAttribute("aria-label", `Abrir categoria ${category.title}`);

  tile.innerHTML = `
    <span class="tile-top">
      <span class="tile-icon" aria-hidden="true">${category.icon || "□"}</span>
      <span class="tile-count">${category.links.length} link${category.links.length === 1 ? "" : "s"}</span>
    </span>
    <span>
      <span class="tile-title">${category.title}</span>
      ${category.description ? `<span class="tile-description">${category.description}</span>` : ""}
    </span>
  `;

  tile.addEventListener("click", (event) => {
    event.preventDefault();
    openCategory(category, tile, true);
  });

  tile.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      event.preventDefault();
      openCategory(category, tile, true);
    }
  });

  tile.style.animationDelay = `${index * 45}ms`;
  return tile;
}

function renderTiles() {
  const fragment = document.createDocumentFragment();
  categories.forEach((category, index) => fragment.appendChild(createTile(category, index)));
  tileGrid.replaceChildren(fragment);
}

function getCategorySlug(category) {
  if (category.slug) {
    return category.slug;
  }

  return category.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function findCategoryByHash() {
  const hash = decodeURIComponent(window.location.hash.replace("#", ""));
  return categories.find((category) => getCategorySlug(category) === hash);
}

function findTileByCategory(category) {
  const slug = getCategorySlug(category);
  return Array.from(tileGrid.children).find((tile) => tile.getAttribute("href") === `#${slug}`);
}

function updateCategoryHash(category) {
  const slug = getCategorySlug(category);

  if (window.location.hash !== `#${slug}`) {
    history.pushState(null, "", `#${slug}`);
  }
}

function openCategory(category, tile, shouldUpdateHash = false) {
  lastFocusedElement = document.activeElement;
  tile?.classList.add("is-flipping");

  if (shouldUpdateHash) {
    updateCategoryHash(category);
  }

  window.setTimeout(() => {
    overlayPanel.style.setProperty("--overlay-color", category.color);
    overlayTitle.textContent = category.title;
    overlayDescription.textContent = category.description || "";
    overlayIcon.textContent = category.icon || "□";
    renderLinks(category.links);

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("overlay-open");
    overlayPanel.focus();
    tile?.classList.remove("is-flipping");
  }, 160);
}

function renderLinks(links) {
  const fragment = document.createDocumentFragment();

  links.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.className = "referral-link";
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.innerHTML = `
      <span>
        <h3>${link.name}</h3>
        <p>${link.description}</p>
      </span>
      <span class="open-icon" aria-hidden="true">↗</span>
    `;
    anchor.setAttribute("aria-label", `Abrir ${link.name} em nova aba`);
    fragment.appendChild(anchor);
  });

  linksList.replaceChildren(fragment);
}

function closeOverlay(shouldClearHash = true) {
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("overlay-open");

  if (shouldClearHash && window.location.hash) {
    history.pushState(null, "", window.location.pathname + window.location.search);
  }

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function openCategoryFromHash() {
  const category = findCategoryByHash();

  if (category) {
    openCategory(category, findTileByCategory(category));
  } else if (overlay.classList.contains("is-open")) {
    closeOverlay(false);
  }
}

function trapFocus(event) {
  if (!overlay.classList.contains("is-open") || event.key !== "Tab") {
    return;
  }

  const focusableElements = overlay.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])");
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

renderTiles();
openCategoryFromHash();

closeOverlayButton.addEventListener("click", closeOverlay);

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeOverlay();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && overlay.classList.contains("is-open")) {
    closeOverlay();
  }

  trapFocus(event);
});

window.addEventListener("hashchange", openCategoryFromHash);
window.addEventListener("popstate", openCategoryFromHash);
