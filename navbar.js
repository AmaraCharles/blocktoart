let searchTimeout = null;

/* =========================
   SEARCH SETUP
========================= */

function setupSearch(inputId, dropdownId) {

    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    if (!input || !dropdown) return;

    input.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value, dropdown);
        }, 300);
    });

    input.addEventListener("focus", () => {
        if (input.value.length >= 2) {
            dropdown.classList.add("show");
        }
    });

    document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });

    document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            input.focus();
        }
    });
}

/* =========================
   SEARCH LOGIC
========================= */

async function performSearch(query, dropdown) {

    if (query.length < 2) {
        dropdown.classList.remove("show");
        return;
    }

    try {
        const res = await fetch(
            `https://changes-sample.onrender.com/api/marketplace/search?q=${encodeURIComponent(query)}`
        );

        if (!res.ok) throw new Error("Search failed");

        const results = await res.json();

        if (!results.length) {
            dropdown.innerHTML =
                '<div class="p-3 text-muted text-center">No results found</div>';
        } else {

            const uniqueArtists = [...new Set(
                results.map(nft => nft.creator).filter(Boolean)
            )];

            let html = "";

            html += '<div class="vx-search-section-label">Artists</div>';
            html += uniqueArtists.slice(0, 3).map(artist => `
                <a href="artist.html?name=${encodeURIComponent(artist)}"
                   class="vx-search-result">
                    <div>${artist.charAt(0).toUpperCase()}</div>
                    <div>${artist}</div>
                </a>
            `).join("");

            html += '<div class="vx-search-section-label">Artworks</div>';
            html += results.slice(0, 6).map(nft => `
                <a href="artwork.html?id=${nft._id}" class="vx-search-result">
                    <img src="${nft.imageUrl}" alt="${nft.name}">
                    <div>
                        <strong>${nft.name}</strong><br>
                        <small>${nft.creator || "Unknown"}</small>
                    </div>
                </a>
            `).join("");

            dropdown.innerHTML = html;
        }

        dropdown.classList.add("show");

    } catch (err) {
        console.error(err);
    }
}

/* =========================
   MOBILE MODAL
========================= */

function toggleSearch() {
    document.getElementById("searchModal").classList.toggle("active");
}

function closeSearchIfOutside(e) {
    if (e.target.id === "searchModal") {
        toggleSearch();
    }
}

/* =========================
   CATEGORY REDIRECT
========================= */

document.addEventListener("DOMContentLoaded", () => {

    setupSearch("searchInput", "searchDropdown");
    setupSearch("searchInput2", "searchDropdown2");

    const categoryLinks = document.querySelectorAll(".categoryItem");

    categoryLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const categoryName = link.textContent.trim();
            window.location.href =
                `category.html?category=${encodeURIComponent(categoryName)}`;
        });
    });

});