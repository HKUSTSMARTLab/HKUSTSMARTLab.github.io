/**
 * Citation manager - handles DOM manipulation and user interactions
 */
class CitationsManager {
    constructor(citations, containerId) {
      this.citations = citations;
      this.container = document.getElementById(containerId);
      this.init();
    }
    
    /**
     * Initialize the citations accordion
     */
    init() {
      const accordionElem = document.getElementById('citationAccordion');
      if (!accordionElem) return;
      
      // Populate with citation cards
      this.citations.forEach((citation, index) => {
        const citationCard = this.createCitationCard(citation, index);
        accordionElem.appendChild(citationCard);
      });
      
      // Add event listeners for copy buttons
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', this.handleCopy.bind(this));
      });
    }
    
    /**
     * Create HTML for a citation card
     */
    createCitationCard(citation, index) {
      const card = document.createElement('div');
      card.className = 'card citation-card';
      
      // Create header
      const header = document.createElement('div');
      header.className = 'card-header citation-header';
      header.id = `heading-${citation.id}`;
      
      // Create title button
      const titleButton = document.createElement('h6');
      titleButton.className = 'mb-0';
      titleButton.innerHTML = `
        <button class="btn btn-link btn-block text-left text-decoration-none citation-title" type="button" 
                data-toggle="collapse" data-target="#collapse-${citation.id}" 
                aria-expanded="false" aria-controls="collapse-${citation.id}">
          <span>${citation.title}</span>
          <i class="fas fa-chevron-down small"></i>
        </button>
      `;
      
      // Create collapsible content
      const collapse = document.createElement('div');
      collapse.id = `collapse-${citation.id}`;
      collapse.className = 'collapse';
      collapse.setAttribute('aria-labelledby', `heading-${citation.id}`);
      collapse.setAttribute('data-parent', '#citationAccordion');
      
      // Create content body
      const body = document.createElement('div');
      body.className = 'card-body p-0';
      body.innerHTML = `
        <div class="citation-container">
          <pre class="citation-content"><code>${citation.bibtex}</code></pre>
          <button class="btn copy-btn" data-citation-id="${citation.id}">
            <i class="far fa-copy"></i> Copy Citation
          </button>
        </div>
      `;
      
      // Assemble the card
      header.appendChild(titleButton);
      collapse.appendChild(body);
      card.appendChild(header);
      card.appendChild(collapse);
      
      return card;
    }
    
    /**
     * Handle copy button click event
     */
    handleCopy(event) {
      const btn = event.currentTarget;
      const citationId = btn.getAttribute('data-citation-id');
      
      // Find the citation text
      const citation = this.citations.find(c => c.id === citationId);
      if (!citation) return;
      
      // Copy to clipboard
      navigator.clipboard.writeText(citation.bibtex).then(() => {
        // Show feedback
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        // Reset after 1.5 seconds
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 1500);
      });
      
      // Prevent event bubbling (to avoid accordion toggle)
      event.stopPropagation();
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const citationsManager = new CitationsManager(citationsData, 'citations-container');
  });