
    document.getElementById("themeToggle").addEventListener("change", function () {
        if (this.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }
    });

    window.onload = function () {
        let theme = localStorage.getItem("theme");
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
            document.getElementById("themeToggle").checked = true;
        }
        loadCategory("all");
    };

    let scrollInterval;
    async function loadCategory(category) {
        showLoader();

        let res = await fetch(`/news?category=${category}`);
        let data = await res.json();

        let container = document.getElementById("news-container");
        container.innerHTML = "";

        if (!data.results || data.results.length === 0) {
            container.innerHTML = "<p>No news found.</p>";
            hideLoader();
            return;
        }

        data.results.forEach((item, index) => {
            container.innerHTML += `
                <div class="news-card">
                    ${item.image_url ? `<img src="${item.image_url}" class="news-img">` : ""}
                    <div class="news-content">
                        <h2 class="news-title">${item.title} ${index === 0 ? '<span class="new-badge">NEW</span>' : ''}</h2>
                        <p class="news-desc">${item.description || ""}</p>
                        <a href="${item.link}" target="_blank" class="read-more">Read More →</a>
                    </div>
                </div>
            `;
        });

        hideLoader();
        startAutoScroll();
    }

    function showLoader() { document.getElementById("loader").classList.remove("hidden"); }
    function hideLoader() { setTimeout(() => { document.getElementById("loader").classList.add("hidden"); }, 600); }

    function reloadNews() { loadCategory("all"); }

    function startAutoScroll() {
        const scrollContainer = document.getElementById("news-scroll-container");
        clearInterval(scrollInterval);

        scrollInterval = setInterval(() => {
            if ((scrollContainer.scrollTop + scrollContainer.clientHeight) >= scrollContainer.scrollHeight) {
                scrollContainer.scrollTop = 0; // loop to top
            } else {
                scrollContainer.scrollTop += 1; // scroll 1px per interval
            }
        }, 40); // adjust speed

        // pause scroll on hover
        scrollContainer.onmouseenter = () => clearInterval(scrollInterval);
        scrollContainer.onmouseleave = startAutoScroll;
    }