document.addEventListener('DOMContentLoaded', () => {
    // ------------------- CONFIGURATION -------------------
    // Replace this with your own Google Sheet CSV link
    // How to get the link: In Google Sheets, go to File > Share > Publish to web.
    // In the dialog, select the sheet you want to publish, and choose "Comma-separated values (.csv)".
    // Click "Publish" and copy the generated link here.
    const googleSheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS_R8A5X_4Q4Z_1A2B3C4D5E6F7G8H9I0J/pub?output=csv';

    // Replace this with your WhatsApp number, including the country code, without '+' or spaces.
    // For example: '1234567890' for a US number.
    const whatsappNumber = '12345678900';
    // -----------------------------------------------------

    const productGrid = document.getElementById('product-grid');
    const searchBar = document.getElementById('search-bar');
    const categoryFiltersContainer = document.getElementById('category-filters');
    let allProducts = [];

    // Simple CSV parser
    const parseCSV = (text) => {
        const lines = text.split('\n');
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
            if (!product.name) return; // Skip empty rows

            const card = document.createElement('div');
            card.className = 'product-card';

            const isComingSoon = product.status === 'Coming Soon' || !product.price;
            const priceDisplay = isComingSoon
                ? `<p class="coming-soon">Coming Soon</p>`
                : `<p class="product-price">$${product.price}</p>`;

            const orderMessage = encodeURIComponent(`I'd like to order ${product.name} for $${product.price}`);
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${orderMessage}`;

            card.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}">
                <div class="product-info">
                    <h2 class="product-name">${product.name}</h2>
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
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || (product.description && product.description.toLowerCase().includes(searchTerm));
            return matchesCategory && matchesSearch;
        });

        renderProducts(filtered);
    };

    const fetchProducts = async () => {
        try {
            // A placeholder for the actual fetch call.
            // Using dummy data to avoid making a real network request in this environment
            // In a real scenario, this would be:
            // const response = await fetch(googleSheetCsvUrl);
            // if (!response.ok) throw new Error('Network response was not ok');
            // const csvText = await response.text();

            const csvText = `Name,Description,Price,Image URL,Category,Status
MoonMist Tea,A calming herbal tea blend,5.99,https://images.unsplash.com/photo-1597318181433-2c529b3b0805?w=400,Tea,Available
Galaxy Grind,Rich and dark coffee beans,12.50,https://images.unsplash.com/photo-1511920183359-32b934a0649e?w=400,Coffee,Available
StarGazer Soda,A bubbly and sweet soda,3.00,https://images.unsplash.com/photo-1554866585-CD94860890b7?w=400,Soda,Available
Comet Pop,A fizzy drink with a pop, ,https://images.unsplash.com/photo-1541857754-555a68138536?w=400,Soda,Coming Soon
Nebula Nectar,A sweet and tangy juice,4.50,https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400,Juice,Available`;

            allProducts = parseCSV(csvText);
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
