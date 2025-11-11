// Configuration des APIs avec proxy CORS
const CONFERENCE_API = 'http://localhost:8082/api/conferences';
const KEYNOTE_API = 'http://localhost:8081/keynotes';

// Proxy CORS temporaire - utilisez ceci si CORS ne fonctionne pas
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
// Alternative: const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Variables globales
let currentKeynoteId = null;
let keynotes = [];

// Fonction pour construire l'URL avec proxy si nécessaire
function buildUrl(apiUrl, useProxy = false) {
    if (useProxy) {
        return CORS_PROXY + encodeURIComponent(apiUrl);
    }
    return apiUrl;
}

// Navigation entre sections
function showSection(sectionName) {
    document.getElementById('conferences-section').classList.add('d-none');
    document.getElementById('keynotes-section').classList.add('d-none');
    
    if (sectionName === 'conferences') {
        document.getElementById('conferences-section').classList.remove('d-none');
        document.querySelector('.navbar-nav .nav-link').classList.add('active');
        document.querySelectorAll('.navbar-nav .nav-link')[1].classList.remove('active');
    } else {
        document.getElementById('keynotes-section').classList.remove('d-none');
        document.querySelector('.navbar-nav .nav-link').classList.remove('active');
        document.querySelectorAll('.navbar-nav .nav-link')[1].classList.add('active');
        loadKeynotes();
    }
}

// ========== GESTION DES KEYNOTES ==========
async function loadKeynotes() {
    showKeynotesLoading();
    hideKeynotesError();

    try {
        // Essayer d'abord sans proxy
        let response = await fetchWithRetry(KEYNOTE_API);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        // Spring Data REST retourne les données dans _embedded.keynotes
        keynotes = data._embedded ? data._embedded.keynotes : [];
        displayKeynotes(keynotes);
        
    } catch (error) {
        console.error('Erreur lors du chargement des keynotes:', error);
        showKeynotesError(`
            Impossible de charger les keynotes. 
            <br><strong>Cause:</strong> ${error.message}
            <br><br>Vérifiez que:
            <ul>
                <li>Le service Keynote (port 8081) est démarré</li>
                <li>La configuration CORS est activée sur le service Keynote</li>
                <li>Vous testez depuis http://127.0.0.1:5500</li>
            </ul>
        `);
    } finally {
        hideKeynotesLoading();
    }
}

// Fonction de réessai avec proxy
async function fetchWithRetry(url, options = {}) {
    try {
        // Premier essai - URL directe
        console.log('🔄 Premier essai - URL directe:', url);
        let response = await fetch(url, options);
        
        if (response.ok) {
            return response;
        }
        
        throw new Error(`HTTP ${response.status}`);
        
    } catch (error) {
        console.log('❌ Échec URL directe, tentative avec proxy...');
        
        // Deuxième essai - avec proxy CORS
        const proxyUrl = buildUrl(url, true);
        console.log('🔄 Essai avec proxy:', proxyUrl);
        
        const proxyOptions = {
            ...options,
            headers: {
                ...options.headers,
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
        
        return await fetch(proxyUrl, proxyOptions);
    }
}

// Afficher les keynotes
function displayKeynotes(keynotes) {
    const keynotesList = document.getElementById('keynotes-list');
    
    if (!keynotes || keynotes.length === 0) {
        keynotesList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    Aucun keynote trouvé. Cliquez sur "Nouveau Keynote" pour en ajouter un.
                </div>
            </div>
        `;
        return;
    }

    const keynotesHTML = keynotes.map(keynote => `
        <div class="col-lg-6 col-xl-4 mb-4">
            <div class="card keynote-card h-100">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="card-title mb-1">${keynote.prenom} ${keynote.nom}</h5>
                        <div class="keynote-actions">
                            <button class="btn btn-sm btn-outline-light me-1" onclick="editKeynote(${keynote.id})" title="Modifier">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-light" onclick="confirmDeleteKeynote(${keynote.id})" title="Supprimer">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="card-body">
                    <div class="mb-3">
                        <p class="mb-2">
                            <i class="bi bi-envelope me-2"></i>
                            <strong>Email:</strong> ${keynote.email}
                        </p>
                        <p class="mb-0">
                            <i class="bi bi-briefcase me-2"></i>
                            <strong>Fonction:</strong> ${keynote.fonction}
                        </p>
                    </div>
                    
                    <div class="mt-3 pt-3 border-top">
                        <small class="text-light opacity-75">
                            <i class="bi bi-info-circle me-1"></i>
                            ID: ${keynote.id}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    keynotesList.innerHTML = keynotesHTML;
}

// Sauvegarder un keynote
async function saveKeynote(event) {
    event.preventDefault();
    
    const keynoteData = {
        nom: document.getElementById('keynote-nom').value,
        prenom: document.getElementById('keynote-prenom').value,
        email: document.getElementById('keynote-email').value,
        fonction: document.getElementById('keynote-fonction').value
    };

    try {
        let response;
        const options = {
            method: currentKeynoteId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(keynoteData)
        };

        const url = currentKeynoteId ? `${KEYNOTE_API}/${currentKeynoteId}` : KEYNOTE_API;
        
        response = await fetchWithRetry(url, options);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Recharger la liste
        await loadKeynotes();
        hideKeynoteForm();
        
        // Message de succès
        showTempMessage(currentKeynoteId ? 'Keynote modifié avec succès!' : 'Keynote ajouté avec succès!', 'success');
        
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showTempMessage('Erreur lors de la sauvegarde du keynote: ' + error.message, 'danger');
    }
}

// Supprimer un keynote
async function deleteKeynote(keynoteId) {
    try {
        const options = {
            method: 'DELETE'
        };

        const response = await fetchWithRetry(`${KEYNOTE_API}/${keynoteId}`, options);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Recharger la liste
        await loadKeynotes();
        showTempMessage('Keynote supprimé avec succès!', 'success');
        
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showTempMessage('Erreur lors de la suppression du keynote: ' + error.message, 'danger');
    }
}

// Les autres fonctions restent les mêmes...
function showKeynoteForm(keynote = null) {
    const formContainer = document.getElementById('keynote-form-container');
    const formTitle = document.getElementById('keynote-form-title');
    
    if (keynote) {
        formTitle.textContent = 'Modifier le Keynote';
        document.getElementById('keynote-id').value = keynote.id;
        document.getElementById('keynote-prenom').value = keynote.prenom;
        document.getElementById('keynote-nom').value = keynote.nom;
        document.getElementById('keynote-email').value = keynote.email;
        document.getElementById('keynote-fonction').value = keynote.fonction;
        currentKeynoteId = keynote.id;
    } else {
        formTitle.textContent = 'Ajouter un Keynote';
        document.getElementById('keynote-form').reset();
        document.getElementById('keynote-id').value = '';
        currentKeynoteId = null;
    }
    
    formContainer.classList.remove('d-none');
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

function hideKeynoteForm() {
    document.getElementById('keynote-form-container').classList.add('d-none');
    currentKeynoteId = null;
}

function editKeynote(keynoteId) {
    const keynote = keynotes.find(k => k.id === keynoteId);
    if (keynote) {
        showKeynoteForm(keynote);
    }
}

function confirmDeleteKeynote(keynoteId) {
    currentKeynoteId = keynoteId;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// Confirmation de suppression
document.getElementById('confirm-delete').addEventListener('click', async function() {
    await deleteKeynote(currentKeynoteId);
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
});

// ========== GESTION DES CONFÉRENCES ==========
async function loadConferences() {
    showLoading();
    hideError();

    try {
        const response = await fetchWithRetry(`${CONFERENCE_API}/all-with-details`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const conferences = await response.json();
        displayConferences(conferences);
        
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        showError('Impossible de charger les conférences. Vérifiez que le service est démarré.');
    } finally {
        hideLoading();
    }
}

function displayConferences(conferences) {
    if (!conferences || conferences.length === 0) {
        document.getElementById('conferences').innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    Aucune conférence trouvée.
                </div>
            </div>
        `;
        return;
    }

    const conferencesHTML = conferences.map(conference => `
        <div class="col-lg-6 col-xl-4 mb-4">
            <div class="card conference-card h-100">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="card-title mb-1">${conference.titre}</h5>
                        <span class="badge ${conference.type === 'Académique' ? 'bg-success' : 'bg-primary'}">
                            ${conference.type}
                        </span>
                    </div>
                </div>
                
                <div class="card-body">
                    <div class="mb-3">
                        <div class="row text-muted small mb-2">
                            <div class="col-6">
                                <i class="bi bi-calendar"></i> ${formatDate(conference.date)}
                            </div>
                            <div class="col-6 text-end">
                                <i class="bi bi-clock"></i> ${conference.duree}
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="conference-score">Score: ${conference.score}/5</span>
                            <small class="text-muted">${conference.reviews ? conference.reviews.length : 0} avis</small>
                        </div>
                    </div>

                    ${conference.keynote ? `
                    <div class="card mb-3 border-primary">
                        <div class="card-body py-3">
                            <h6 class="card-title mb-2 text-primary">🎤 Keynote Speaker</h6>
                            <p class="card-text mb-1">
                                <strong>${conference.keynote.prenom} ${conference.keynote.nom}</strong>
                            </p>
                            <p class="card-text mb-1 small">${conference.keynote.fonction}</p>
                            <p class="card-text mb-0 small">
                                <i class="bi bi-envelope"></i> ${conference.keynote.email}
                            </p>
                        </div>
                    </div>
                    ` : `
                    <div class="alert alert-warning py-2 mb-3">
                        <small>Aucun keynote assigné</small>
                    </div>
                    `}

                    <h6 class="mt-3 mb-2">📝 Avis des participants:</h6>
                    ${conference.reviews && conference.reviews.length > 0 ? 
                        conference.reviews.map(review => `
                            <div class="review-card p-3 mb-2">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <span class="rating">
                                        ${generateStars(review.note)}
                                    </span>
                                    <small class="text-muted">${formatDate(review.date)}</small>
                                </div>
                                <p class="mb-0 small">"${review.text}"</p>
                            </div>
                        `).join('') 
                        : '<p class="text-muted small">Aucun avis pour le moment.</p>'
                    }
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('conferences').innerHTML = conferencesHTML;
}

// ========== FONCTIONS UTILITAIRES ==========
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Date invalide';
    }
}

function generateStars(rating) {
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));
    return `<span style="color: #ffc107; font-size: 1.1em;">${fullStars}${emptyStars}</span>`;
}

function showTempMessage(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Gestion du chargement/erreurs
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('conferences').style.display = 'none';
    document.getElementById('error').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('conferences').style.display = 'flex';
}

function showError(message) {
    document.getElementById('error').innerHTML = message;
    document.getElementById('error').classList.remove('d-none');
    document.getElementById('error').style.display = 'block';
}

function hideError() {
    document.getElementById('error').classList.add('d-none');
}

function showKeynotesLoading() {
    document.getElementById('keynotes-loading').style.display = 'block';
    document.getElementById('keynotes-list').style.display = 'none';
    document.getElementById('keynotes-error').style.display = 'none';
}

function hideKeynotesLoading() {
    document.getElementById('keynotes-loading').style.display = 'none';
    document.getElementById('keynotes-list').style.display = 'flex';
}

function showKeynotesError(message) {
    document.getElementById('keynotes-error').innerHTML = message;
    document.getElementById('keynotes-error').classList.remove('d-none');
    document.getElementById('keynotes-error').style.display = 'block';
}

function hideKeynotesError() {
    document.getElementById('keynotes-error').classList.add('d-none');
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadConferences();
});