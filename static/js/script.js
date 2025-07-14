// Global variables
let currentSearchTerm = '';
let currentResults = null;

// DOM elements
const itemInput = document.getElementById('itemInput');
const searchBtn = document.getElementById('searchBtn');
const loadingState = document.getElementById('loadingState');
const resultsSection = document.getElementById('resultsSection');
const originalItemDetails = document.getElementById('originalItemDetails');
const alternativesList = document.getElementById('alternativesList');
const comparisonModal = new bootstrap.Modal(document.getElementById('comparisonModal'));
const comparisonContent = document.getElementById('comparisonContent');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Search button click
    searchBtn.addEventListener('click', handleSearch);
    
    // Enter key press in input
    itemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Auto-focus on input
    itemInput.focus();
});

// Handle search functionality
async function handleSearch() {
    const itemName = itemInput.value.trim();
    
    if (!itemName) {
        showError('Please enter a product name');
        return;
    }
    
    currentSearchTerm = itemName;
    showLoadingState();
    
    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item_name: itemName })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            showError(data.error);
            return;
        }
        
        currentResults = data;
        displayResults(data);
        
    } catch (error) {
        console.error('Search error:', error);
        showError('Failed to search for alternatives. Please check your internet connection and try again.');
    } finally {
        hideLoadingState();
    }
}

// Show loading state
function showLoadingState() {
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Searching...</span>';
    loadingState.style.display = 'block';
    resultsSection.style.display = 'none';
}

// Hide loading state
function hideLoadingState() {
    searchBtn.disabled = false;
    searchBtn.innerHTML = '<i class="fas fa-search"></i> <span>Find Alternatives</span>';
    loadingState.style.display = 'none';
}

// Display search results
function displayResults(data) {
    if (!data.original_item || !data.alternatives) {
        showError('Invalid response format from server');
        return;
    }
    
    // Display original item details
    displayOriginalItem(data.original_item);
    
    // Display alternatives
    displayAlternatives(data.alternatives);
    
    // Show results section with animation
    resultsSection.style.display = 'block';
    
    // Add staggered animations
    setTimeout(() => {
        addStaggeredAnimations();
    }, 100);
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Display original item details
function displayOriginalItem(item) {
    const detailsHTML = `
        <div class="original-details">
            <div class="detail-item">
                <div class="detail-label">Product Name</div>
                <div class="detail-value">${escapeHtml(item.name)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value">${escapeHtml(item.category || 'N/A')}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Price (INR)</div>
                <div class="detail-value">${escapeHtml(item.price_inr || 'N/A')}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Availability</div>
                <div class="detail-value">${escapeHtml(item.availability || 'N/A')}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Performance</div>
                <div class="detail-value">${escapeHtml(item.performance || 'N/A')}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Primary Usage</div>
                <div class="detail-value">${escapeHtml(item.usage || 'N/A')}</div>
            </div>
        </div>
        ${item.description ? `
            <div class="mt-4">
                <h6><i class="fas fa-info-circle"></i> Description</h6>
                <p class="text-muted">${escapeHtml(item.description)}</p>
            </div>
        ` : ''}
    `;
    
    originalItemDetails.innerHTML = detailsHTML;
}

// Display alternatives
function displayAlternatives(alternatives) {
    if (!alternatives || alternatives.length === 0) {
        alternativesList.innerHTML = '<p class="text-center text-muted">No alternatives found.</p>';
        return;
    }
    
    const alternativesHTML = alternatives.map(alt => `
        <div class="alternative-item" onclick="handleAlternativeClick('${escapeHtml(alt.name)}')">
            <div class="alternative-header">
                <h5 class="alternative-name">${escapeHtml(alt.name)}</h5>
                <span class="alternative-category">${escapeHtml(alt.category || 'General')}</span>
            </div>
            <p class="alternative-description">${escapeHtml(alt.description || 'No description available')}</p>
            <div class="alternative-details">
                <div class="alternative-detail">
                    <strong>Price:</strong> ${escapeHtml(alt.price_inr || 'N/A')}
                </div>
                <div class="alternative-detail">
                    <strong>Availability:</strong> ${escapeHtml(alt.availability || 'N/A')}
                </div>
                <div class="alternative-detail">
                    <strong>Performance:</strong> ${escapeHtml(alt.performance || 'N/A')}
                </div>
                <div class="alternative-detail">
                    <strong>Compatibility:</strong> ${escapeHtml(alt.compatibility || 'N/A')}
                </div>
            </div>
            <button class="compare-btn" onclick="event.stopPropagation(); handleCompareClick('${escapeHtml(alt.name)}')">
                <i class="fas fa-balance-scale"></i>
                Compare with Original
            </button>
        </div>
    `).join('');
    
    alternativesList.innerHTML = alternativesHTML;
}

// Handle alternative item click
function handleAlternativeClick(alternativeName) {
    handleCompareClick(alternativeName);
}

// Handle compare button click
async function handleCompareClick(alternativeName) {
    if (!currentSearchTerm) {
        showError('Original item not found');
        return;
    }
    
    showComparisonLoading();
    
    try {
        const response = await fetch('/api/compare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                original_item: currentSearchTerm,
                alternative_item: alternativeName
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            showError(data.error);
            return;
        }
        
        displayComparison(data);
        comparisonModal.show();
        
    } catch (error) {
        console.error('Comparison error:', error);
        showError('Failed to generate comparison. Please try again.');
    }
}

// Show comparison loading
function showComparisonLoading() {
    comparisonContent.innerHTML = `
        <div class="text-center p-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Generating detailed comparison...</p>
        </div>
    `;
}

// Display comparison
function displayComparison(data) {
    if (!data.original || !data.alternative || !data.comparison) {
        showError('Invalid comparison data received');
        return;
    }
    
    const comparisonHTML = `
        <div class="comparison-content">
            <div class="comparison-item">
                <div class="comparison-header">
                    <h5 class="comparison-title">${escapeHtml(data.original.name)}</h5>
                    <p class="comparison-subtitle">Original Product</p>
                </div>
                
                <div class="comparison-section">
                    <h6><i class="fas fa-info-circle"></i> Description</h6>
                    <p>${escapeHtml(data.original.description || 'No description available')}</p>
                </div>
                
                <div class="comparison-section">
                    <h6><i class="fas fa-thumbs-up"></i> Advantages</h6>
                    <ul class="comparison-list">
                        ${(data.original.pros || []).map(pro => `
                            <li><i class="fas fa-check"></i> ${escapeHtml(pro)}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="comparison-section">
                    <h6><i class="fas fa-thumbs-down"></i> Disadvantages</h6>
                    <ul class="comparison-list">
                        ${(data.original.cons || []).map(con => `
                            <li><i class="fas fa-times"></i> ${escapeHtml(con)}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="comparison-section">
                    <h6><i class="fas fa-star"></i> Performance Score</h6>
                    <p>${escapeHtml(data.original.performance_score || 'N/A')}/10</p>
                </div>
                
                <div class="comparison-section">
                    <h6><i class="fas fa-rupee-sign"></i> Price</h6>
                    <p>${escapeHtml(data.original.price_inr || 'N/A')}</p>
                </div>
            </div>
            
            <div class="comparison-item alternative">
                <div class="comparison-header">
                    <h5 class="comparison-title">${escapeHtml(data.alternative.name)}</h5>
                    <p class="comparison-subtitle">Alternative Product</p>
                </div>
                
                <div class="comparison-section">
                    <h6><i class="fas fa-info-circle"></i> Description</h6>
                    <p>${escapeHtml(data.alternative.description || 'No description available')}</p>
                </div>
                
                <div class="comparison-section">
                    <h6><i class="fas fa-thumbs-up"></i> Advantages</h6>
                    <ul class="comparison-list">
                        ${(data.alternative.pros || []).map(pro => `
                            <li><i class="fas fa-check"></i> ${escapeHtml(pro)}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="comparison-section">
                    <h6><i class="fas fa-thumbs-down"></i> Disadvantages</h6>
                    <ul class="comparison-list">
                        ${(data.alternative.cons || []).map(con => `
                            <li><i class="fas fa-times"></i> ${escapeHtml(con)}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="comparison-section">
                    <h6><i class="fas fa-star"></i> Performance Score</h6>
                    <p>${escapeHtml(data.alternative.performance_score || 'N/A')}/10</p>
                </div>
                
                <div class="comparison-section">
                    <h6><i class="fas fa-rupee-sign"></i> Price</h6>
                    <p>${escapeHtml(data.alternative.price_inr || 'N/A')}</p>
                </div>
            </div>
        </div>
        
        <div class="comparison-analysis">
            <h5><i class="fas fa-chart-line"></i> Analysis</h5>
            
            <div class="comparison-grid">
                <div class="comparison-point">
                    <h6>Cost Comparison</h6>
                    <p>${escapeHtml(data.comparison.cost_difference || 'No cost comparison available')}</p>
                </div>
                
                <div class="comparison-point">
                    <h6>Performance Comparison</h6>
                    <p>${escapeHtml(data.comparison.performance_difference || 'No performance comparison available')}</p>
                </div>
                
                <div class="comparison-point">
                    <h6>Availability Comparison</h6>
                    <p>${escapeHtml(data.comparison.availability_difference || 'No availability comparison available')}</p>
                </div>
                
                <div class="comparison-point">
                    <h6>Compatibility Analysis</h6>
                    <p>${escapeHtml(data.comparison.compatibility_analysis || 'No compatibility analysis available')}</p>
                </div>
            </div>
            
            ${data.comparison.key_differences && data.comparison.key_differences.length > 0 ? `
                <div class="comparison-section">
                    <h6><i class="fas fa-list"></i> Key Differences</h6>
                    <ul class="comparison-list">
                        ${data.comparison.key_differences.map(diff => `
                            <li><i class="fas fa-arrow-right"></i> ${escapeHtml(diff)}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${data.comparison.recommendation ? `
                <div class="recommendation">
                    <h6><i class="fas fa-lightbulb"></i> Recommendation</h6>
                    <p>${escapeHtml(data.comparison.recommendation)}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    comparisonContent.innerHTML = comparisonHTML;
}

// Show error message
function showError(message) {
    const errorHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Error:</strong> ${escapeHtml(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Insert error at the top of the container
    const container = document.querySelector('.container');
    const firstChild = container.firstElementChild;
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = errorHTML;
    container.insertBefore(errorDiv, firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = errorDiv.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Add smooth scrolling behavior and enhanced animations
document.documentElement.style.scrollBehavior = 'smooth';

// Add staggered animations to result cards
function addStaggeredAnimations() {
    const resultCards = document.querySelectorAll('.result-card, .alternative-item');
    resultCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Enhanced loading animations
function enhanceLoadingAnimation() {
    const spinner = document.querySelector('.spinner-border');
    if (spinner) {
        spinner.style.animation = 'spin 1s linear infinite, glow 2s ease-in-out infinite';
    }
}
