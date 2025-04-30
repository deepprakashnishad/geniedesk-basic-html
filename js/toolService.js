// toolService.js
// API Configuration
let BASE_URL = 'http://localhost:1337'; // Replace with your actual API URL

if (window.location.hostname === 'localhost') {
  BASE_URL = 'http://localhost:3000';
} else if (window.location.hostname === 'geniedesk.netlify.app') {
  BASE_URL = 'https://goodact.onrender.com';
} else {
  BASE_URL = 'https://goodact-staging.onrender.com';
}
/**
 * Fetches tools from API with retry logic
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<Array>} - Array of tools
 */
export async function fetchToolsListWithRetry(retries = 3) {
  try {
    const response = await fetch(`${BASE_URL}/tool/list`);
    
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    
    if (data && data.success && Array.isArray(data.tools)) {
      return data.tools;
    }
    throw new Error('Invalid API response structure');
  } catch (error) {
    console.error('Failed to fetch tools:', error);
    if (retries > 0) {
      return fetchToolsListWithRetry(retries - 1);
    }
    return []; // Return empty array if all retries fail
  }
}

/**
 * Groups tools by category
 * @param {Array} tools - Array of tool objects
 * @returns {Object} - Tools grouped by category
 */
export function groupToolsByCategory(tools) {
  return tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {});
}

/**
 * Renders tools to the DOM
 * @param {Object} groupedTools - Tools grouped by category
 * @param {string} filter - Search filter term
 * @param {string} category - Selected category filter
 */
export function renderTools(groupedTools, filter = '', category = 'all') {
  const accordion = document.getElementById('toolsAccordion');
  if (!accordion) return;
  
  accordion.innerHTML = '';
  
  let filteredCategories = Object.keys(groupedTools);
  let hasResults = false;

  if (category !== 'all') {
    filteredCategories = filteredCategories.filter(cat => cat === category);
  }

  filteredCategories.forEach((category, catIndex) => {
    let tools = groupedTools[category];
    
    // Apply search filter
    if (filter) {
      const searchTerm = filter.toLowerCase();
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) || 
        tool.description.toLowerCase().includes(searchTerm));
    }

    if (tools.length > 0) {
      hasResults = true;
      
      // Create accordion item for each category
      const accordionItem = document.createElement('div');
      accordionItem.className = 'accordion-item';
      accordionItem.innerHTML = `
        <h2 class="accordion-header" id="heading${catIndex}">
          <button class="accordion-button category-header ${catIndex > 0 ? 'collapsed' : ''}" 
                  type="button" data-bs-toggle="collapse" 
                  data-bs-target="#collapse${catIndex}" 
                  aria-expanded="${catIndex === 0 ? 'true' : 'false'}" 
                  aria-controls="collapse${catIndex}">
            ${category} <span class="badge bg-primary ms-2">${tools.length} tools</span>
          </button>
        </h2>
        <div id="collapse${catIndex}" class="accordion-collapse collapse ${catIndex === 0 ? 'show' : ''}" 
             aria-labelledby="heading${catIndex}" 
             data-bs-parent="#toolsAccordion">
          <div class="accordion-body">
            <div class="row">
              ${tools.map(tool => `
                <div class="col-md-6 col-lg-4 mb-4">
                  <div class="tool-card card h-100">
                    <div class="card-body">
                      <div class="card-icon mb-3">
                        <i class="${tool.icon} fa-3x" style="color: var(--primary-color);"></i>
                      </div>
                      <h3 class="card-title">${tool.name}</h3>
                      <p class="card-text">${tool.description}</p>
                      <div class="popularity mb-3">
                        ${Array(tool.popularity).fill('<i class="fas fa-star"></i>').join('')}
                        ${Array(5 - tool.popularity).fill('<i class="far fa-star"></i>').join('')}
                      </div>
                      <a target="_blank" href="${tool.link}" class="btn btn-primary">Try Tool</a>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      accordion.appendChild(accordionItem);
    }
  });

  // Show no results message if no tools match the search
  if (!hasResults) {
    accordion.innerHTML = `
      <div class="no-results text-center py-5">
        <i class="fas fa-search fa-4x mb-4" style="color: var(--primary-color);"></i>
        <h3>No Tools Found</h3>
        <p class="text-muted">Try adjusting your search or filter criteria</p>
        <button class="btn btn-primary mt-3" id="resetSearch">Reset Search</button>
      </div>
    `;

    document.getElementById('resetSearch').addEventListener('click', () => {
      document.getElementById('toolSearch').value = '';
      document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.remove('active');
        if (tag.dataset.category === 'all') {
          tag.classList.add('active');
        }
      });
      renderTools(groupedTools);
    });
  }
}

/**
 * Initializes event listeners for search and filter functionality
 * @param {Object} groupedTools - Tools grouped by category
 */
export function initEventListeners(groupedTools) {
  // Search functionality
  document.getElementById('searchButton')?.addEventListener('click', function() {
    const searchTerm = document.getElementById('toolSearch').value;
    const activeCategory = document.querySelector('.filter-tag.active').dataset.category;
    renderTools(groupedTools, searchTerm, activeCategory);
  });
  
  document.getElementById('toolSearch')?.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
      const searchTerm = document.getElementById('toolSearch').value;
      const activeCategory = document.querySelector('.filter-tag.active').dataset.category;
      renderTools(groupedTools, searchTerm, activeCategory);
    }
  });
  
  // Filter by category
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', function() {
      document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const searchTerm = document.getElementById('toolSearch').value;
      renderTools(groupedTools, searchTerm, this.dataset.category);
    });
  });
}

/**
 * Main initialization function
 */
export async function initToolsPage() {
  try {
    // Fetch tools from API
    const tools = await fetchToolsListWithRetry(2);
    const groupedTools = groupToolsByCategory(tools);
    
    // Initial render
    renderTools(groupedTools);
    
    // Set up event listeners
    initEventListeners(groupedTools);
  } catch (error) {
    console.error('Error initializing tools page:', error);
  }
}