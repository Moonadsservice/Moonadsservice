document.addEventListener('DOMContentLoaded', () => {
    // ------------------- CONFIGURATION -------------------
    // This is the link to your Google Sheet.
    const googleSheetCsvUrl = 'https://docs.google.com/spreadsheets/d/1oBFs0i1oazG94dFu0Loa5vQIh4p1J5K7U2fOGf7h0so/export?format=csv';

    // Replace this with your WhatsApp number, including the country code, without '+' or spaces.
    // For example: '1234567890' for a US number.
    const whatsappNumber = '2348063924891';
    // -----------------------------------------------------

    const productGrid = document.getElementById('product-grid');
    const searchBar = document.getElementById('search-bar');
    const categoryFiltersContainer = document.getElementById('category-filters');
    let allProducts = [];

    const parseCSV = (text) => {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1).map(line => {
            const data = line.split(',').map(d => d.trim());
            let obj = {};
            headers.forEach((header, i) => {
                obj[header.toLowerCase().replace(/\s+/g, '_')] = data[i];
            });
            return obj;
        });
        return rows;
    };

    const renderProducts = (products) => {
        productGrid.innerHTML = '';
        products.forEach(product => {
            if (!product.product_name) return; // Skip empty rows

            const card = document.createElement('div');
            card.className = 'product-card';

            const isComingSoon = product.status === 'Coming Soon' || !product.price;
            const priceDisplay = isComingSoon
                ? `<p class="coming-soon">Coming Soon</p>`
                : `<p class="product-price">$${product.price}</p>`;

            const orderMessage = encodeURIComponent(`I'd like to order ${product.product_name} for $${product.price}`);
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${orderMessage}`;

            card.innerHTML = `
                <img src="${product.image_url}" alt="${product.product_name}">
                <div class="product-info">
                    <h2 class="product-name">${product.product_name}</h2>
                    <p>${product.description || ''}</p>
                    ${priceDisplay}
                    ${!isComingSoon ? `<a href="${whatsappLink}" target="_blank" class="whatsapp-button">Order on WhatsApp</a>` : ''}
                </div>
            `;
            productGrid.appendChild(card);
        });
    };

    const renderCategoryFilters = (products) => {
        const categories = ['All', ...new Set(products.map(p => p.category).filter(c => c))];
        categoryFiltersContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-button';
            button.textContent = category;
            if (category === 'All') button.classList.add('active');
            button.addEventListener('click', () => {
                document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterProducts();
            });
            categoryFiltersContainer.appendChild(button);
        });
    };

    const filterProducts = () => {
        const searchTerm = searchBar.value.toLowerCase();
        const activeCategory = document.querySelector('.category-button.active').textContent;

        const filtered = allProducts.filter(product => {
            const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
            const matchesSearch = product.product_name.toLowerCase().includes(searchTerm) || (product.description && product.description.toLowerCase().includes(searchTerm));
            return matchesCategory && matchesSearch;
        });

        renderProducts(filtered);
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(googleSheetCsvUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const csvText = await response.text();

            allProducts = parseCSV(csvText);
            // Check if there are any products after parsing
            if(allProducts.length === 0 || !allProducts[0].product_name) {
                productGrid.innerHTML = '<p>No products found. Check your Google Sheet data and make sure it is not empty.</p>';
                return;
            }

            renderProducts(allProducts);
            renderCategoryFilters(allProducts);

        } catch (error) {
            console.error('Failed to fetch or process products:', error);
            productGrid.innerHTML = '<p>Could not load products. Please check the Google Sheet link and make sure it\'s published correctly.</p>';
        }
    };

    searchBar.addEventListener('input', filterProducts);
    fetchProducts();
});
