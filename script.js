// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.getElementById('galleryGrid');
    const filterTags = document.querySelectorAll('.filter-tag');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    let currentFilter = 'all';
    let searchTerm = '';

    // Initialize gallery
    renderGallery();

    // Filter functionality
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all tags
            filterTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            this.classList.add('active');
            
            // Get category
            currentFilter = this.getAttribute('data-category');
            
            // Render filtered gallery
            renderGallery();
        });
    });

    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        searchTerm = searchInput.value.toLowerCase().trim();
        renderGallery();
    }

    // Render gallery with filters
    function renderGallery() {
        // Filter projects
        let filteredProjects = projectsData;

        // Apply category filter
        if (currentFilter !== 'all') {
            filteredProjects = filteredProjects.filter(project => 
                project.category.includes(currentFilter)
            );
        }

        // Apply search filter
        if (searchTerm) {
            filteredProjects = filteredProjects.filter(project => 
                project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                project.category.some(cat => cat.toLowerCase().includes(searchTerm))
            );
        }

        // Clear gallery
        galleryGrid.innerHTML = '';

        // Check if no results
        if (filteredProjects.length === 0) {
            galleryGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No projects found matching your criteria.</p>
                    <p style="font-size: 14px; margin-top: 10px;">Try adjusting your filters or search term.</p>
                </div>
            `;
            return;
        }

        // Render filtered projects
        filteredProjects.forEach(project => {
            const galleryItem = createGalleryItem(project);
            galleryGrid.appendChild(galleryItem);
        });

        // Add fade-in animation
        setTimeout(() => {
            document.querySelectorAll('.gallery-item').forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.transition = 'opacity 0.5s, transform 0.5s';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 50);
            });
        }, 10);
    }

    // Create gallery item element
    function createGalleryItem(project) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.setAttribute('data-id', project.id);
        
        div.innerHTML = `
            <img src="${project.image}" alt="${project.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <div class="gallery-item-title">${project.title}</div>
                <div class="gallery-item-category">${formatCategories(project.category)}</div>
            </div>
            <div class="gallery-item-arrow">
                <i class="fas fa-arrow-right"></i>
            </div>
        `;

        // Add click event to open modal or navigate
        div.addEventListener('click', function() {
            openProjectDetails(project);
        });

        return div;
    }

    // Format categories for display
    function formatCategories(categories) {
        return categories
            .slice(0, 2)
            .map(cat => cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' '))
            .join(' • ');
    }

    // Open project details (you can customize this)
    function openProjectDetails(project) {
        // For now, just log the project
        console.log('Opening project:', project);
        
        // You can implement a modal here or navigate to a detail page
        alert(`Project: ${project.title}\n\nDescription: ${project.description}\n\nCategories: ${project.category.join(', ')}`);
        
        // Example: Open in modal
        // showModal(project);
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to navbar
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }

        lastScroll = currentScroll;
    });
});

// Optional: Modal functionality for project details
function showModal(project) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <img src="${project.image}" alt="${project.title}">
            <div class="modal-info">
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                <div class="modal-categories">
                    ${project.category.map(cat => `<span class="category-badge">${cat}</span>`).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add modal styles dynamically if not in CSS
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.9);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: fadeIn 0.3s;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .modal-content {
                background: #fff;
                border-radius: 12px;
                max-width: 900px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                animation: slideUp 0.3s;
            }

            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .modal-content img {
                width: 100%;
                height: 400px;
                object-fit: cover;
                border-radius: 12px 12px 0 0;
            }

            .modal-info {
                padding: 30px;
            }

            .modal-info h2 {
                margin-bottom: 15px;
            }

            .modal-categories {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                margin-top: 20px;
            }

            .category-badge {
                background: #f0f0f0;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 14px;
            }

            .modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 32px;
                color: #fff;
                cursor: pointer;
                width: 40px;
                height: 40px;
                background: rgba(0,0,0,0.5);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
                z-index: 1;
            }

            .modal-close:hover {
                background: rgba(0,0,0,0.8);
            }
        `;
        document.head.appendChild(style);
    }

    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.remove();
        }
    });
}