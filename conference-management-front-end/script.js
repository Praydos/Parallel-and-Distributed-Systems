// Configuration des APIs
const CONFERENCE_API = 'http://localhost:8082/api/conferences';
const CONFERENCE_CRUD_API = 'http://localhost:8082/conferences';
const REVIEW_API = 'http://localhost:8082/reviews';
const KEYNOTE_API = 'http://localhost:8081/keynotes';

// Variables globales
let currentConferenceId = null;
let currentKeynoteId = null;
let currentReviewId = null;
let conferences = [];
let keynotes = [];
let allKeynotes = [];

// Navigation entre sections
function showSection(sectionName) {
    document.getElementById('conferences-section').classList.add('d-none');
    document.getElementById('keynotes-section').classList.add('d-none');
    
    if (sectionName === 'conferences') {
        document.getElementById('conferences-section').classList.remove('d-none');
        updateNavActive(0);
        loadConferences();
    } else {
        document.getElementById('keynotes-section').classList.remove('d-none');
        updateNavActive(1);
        loadKeynotes();
    }
}

function updateNavActive(index) {
    document.querySelectorAll('.navbar-nav .nav-link').forEach((link, i) => {
        if (i === index) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========== GESTION DES CONFÉRENCES ==========
async function loadConferences() {
    showLoading();
    hideError();

    try {
        const response = await fetch(`${CONFERENCE_API}/all-with-details`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        conferences = await response.json();
        displayConferences(conferences);
        
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        showError('Impossible de charger les conférences. Vérifiez que le service est démarré.');
    } finally {
        hideLoading();
    }
}

function displayConferences(conferences) {
    const conferencesContainer = document.getElementById('conferences');
    
    if (!conferences || conferences.length === 0) {
        conferencesContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    Aucune conférence trouvée. Cliquez sur "Nouvelle Conférence" pour en ajouter une.
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
                        <div class="conference-actions">
                            <button class="btn btn-sm btn-outline-light me-1" onclick="editConference(${conference.id})" title="Modifier">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-light" onclick="confirmDeleteConference(${conference.id})" title="Supprimer">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
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

    conferencesContainer.innerHTML = conferencesHTML;
}

// Formulaire Conférence
async function showConferenceForm(conference = null) {
    await loadAllKeynotes(); // Charger les keynotes pour la liste déroulante
    
    const formContainer = document.getElementById('conference-form-container');
    const formTitle = document.getElementById('conference-form-title');
    const keynoteSelect = document.getElementById('conference-keynote');
    
    // Peupler la liste déroulante des keynotes
    keynoteSelect.innerHTML = '<option value="">Aucun keynote</option>' +
        allKeynotes.map(k => `<option value="${k.id}">${k.prenom} ${k.nom} - ${k.fonction}</option>`).join('');
    
    if (conference) {
        // Mode édition
        formTitle.textContent = 'Modifier la Conférence';
        document.getElementById('conference-id').value = conference.id;
        document.getElementById('conference-titre').value = conference.titre;
        document.getElementById('conference-type').value = conference.type;
        document.getElementById('conference-duree').value = conference.duree;
        document.getElementById('conference-score').value = conference.score;
        
        // Convertir la date pour l'input datetime-local
        const date = new Date(conference.date);
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        document.getElementById('conference-date').value = localDate;
        
        // Sélectionner le keynote
        document.getElementById('conference-keynote').value = conference.keynoteId || '';
        
        currentConferenceId = conference.id;
        
        // Afficher la section des reviews
        showReviewsSection(conference);
    } else {
        // Mode création
        formTitle.textContent = 'Ajouter une Conférence';
        document.getElementById('conference-form').reset();
        document.getElementById('conference-id').value = '';
        currentConferenceId = null;
        
        // Cacher la section des reviews
        hideReviewsSection();
    }
    
    formContainer.classList.remove('d-none');
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

function hideConferenceForm() {
    document.getElementById('conference-form-container').classList.add('d-none');
    hideReviewsSection();
    currentConferenceId = null;
}

function showReviewsSection(conference) {
    const reviewsSection = document.getElementById('reviews-section');
    const reviewsList = document.getElementById('reviews-list');
    
    document.getElementById('review-conference-id').value = conference.id;
    
    // Afficher les reviews existantes
    if (conference.reviews && conference.reviews.length > 0) {
        const reviewsHTML = conference.reviews.map(review => `
            <div class="review-item p-3 border rounded mb-2">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-1">
                            <span class="rating me-2">${generateStars(review.note)}</span>
                            <small class="text-muted">${formatDate(review.date)}</small>
                        </div>
                        <p class="mb-0">${review.text}</p>
                    </div>
                    <button class="btn btn-sm btn-outline-danger ms-2" onclick="confirmDeleteReview(${review.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        reviewsList.innerHTML = reviewsHTML;
    } else {
        reviewsList.innerHTML = '<p class="text-muted">Aucun avis pour cette conférence.</p>';
    }
    
    reviewsSection.classList.remove('d-none');
}

function hideReviewsSection() {
    document.getElementById('reviews-section').classList.add('d-none');
}

async function saveConference(event) {
    event.preventDefault();
    
    const conferenceData = {
        titre: document.getElementById('conference-titre').value,
        type: document.getElementById('conference-type').value,
        date: new Date(document.getElementById('conference-date').value).toISOString(),
        duree: document.getElementById('conference-duree').value,
        score: parseInt(document.getElementById('conference-score').value),
        keynoteId: document.getElementById('conference-keynote').value || null
    };

    try {
        let response;
        let url = CONFERENCE_CRUD_API;
        let method = 'POST';
        
        if (currentConferenceId) {
            // Modification - utiliser l'endpoint standard
            url = `${CONFERENCE_CRUD_API}/${currentConferenceId}`;
            method = 'PUT';
        }
        
        response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(conferenceData)
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Recharger la liste
        await loadConferences();
        hideConferenceForm();
        
        // Message de succès
        showTempMessage(currentConferenceId ? 'Conférence modifiée avec succès!' : 'Conférence ajoutée avec succès!', 'success');
        
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showTempMessage('Erreur lors de la sauvegarde de la conférence: ' + error.message, 'danger');
    }
}

async function addReview(event) {
    event.preventDefault();
    
    const conferenceId = document.getElementById('review-conference-id').value;
    const reviewData = {
        text: document.getElementById('review-text').value,
        note: parseInt(document.getElementById('review-note').value),
        conference: `${CONFERENCE_CRUD_API}/${conferenceId}`
    };

    try {
        const response = await fetch(REVIEW_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData)
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Recharger les conférences pour mettre à jour les reviews
        await loadConferences();
        
        // Recharger le formulaire d'édition pour mettre à jour la section reviews
        const conference = conferences.find(c => c.id == conferenceId);
        if (conference) {
            showConferenceForm(conference);
        }
        
        // Réinitialiser le formulaire de review
        document.getElementById('review-form').reset();
        
        showTempMessage('Avis ajouté avec succès!', 'success');
        
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'avis:', error);
        showTempMessage('Erreur lors de l\'ajout de l\'avis: ' + error.message, 'danger');
    }
}

function editConference(conferenceId) {
    const conference = conferences.find(c => c.id === conferenceId);
    if (conference) {
        showConferenceForm(conference);
    }
}

function confirmDeleteConference(conferenceId) {
    currentConferenceId = conferenceId;
    const modal = new bootstrap.Modal(document.getElementById('deleteConferenceModal'));
    modal.show();
}

// Confirmation de suppression conférence
document.getElementById('confirm-delete-conference').addEventListener('click', async function() {
    await deleteConference(currentConferenceId);
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConferenceModal'));
    modal.hide();
});

async function deleteConference(conferenceId) {
    try {
        const response = await fetch(`${CONFERENCE_CRUD_API}/${conferenceId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Recharger la liste
        await loadConferences();
        showTempMessage('Conférence supprimée avec succès!', 'success');
        
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showTempMessage('Erreur lors de la suppression de la conférence: ' + error.message, 'danger');
    }
}

function confirmDeleteReview(reviewId) {
    currentReviewId = reviewId;
    const modal = new bootstrap.Modal(document.getElementById('deleteReviewModal'));
    modal.show();
}

// Confirmation de suppression review
document.getElementById('confirm-delete-review').addEventListener('click', async function() {
    await deleteReview(currentReviewId);
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteReviewModal'));
    modal.hide();
});

async function deleteReview(reviewId) {
    try {
        const response = await fetch(`${REVIEW_API}/${reviewId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Recharger les conférences
        await loadConferences();
        
        // Si on est en mode édition, mettre à jour l'affichage
        if (currentConferenceId) {
            const conference = conferences.find(c => c.id == currentConferenceId);
            if (conference) {
                showConferenceForm(conference);
            }
        }
        
        showTempMessage('Avis supprimé avec succès!', 'success');
        
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'avis:', error);
        showTempMessage('Erreur lors de la suppression de l\'avis: ' + error.message, 'danger');
    }
}

// ========== GESTION DES KEYNOTES ==========
async function loadKeynotes() {
    showKeynotesLoading();
    hideKeynotesError();

    try {
        const response = await fetch(KEYNOTE_API);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        // Spring Data REST retourne les données dans _embedded.keynotes
        keynotes = data._embedded ? data._embedded.keynotes : [];
        displayKeynotes(keynotes);
        
    } catch (error) {
        console.error('Erreur lors du chargement des keynotes:', error);
        showKeynotesError('Impossible de charger les keynotes. Vérifiez que le service Keynote est démarré.');
    } finally {
        hideKeynotesLoading();
    }
}

async function loadAllKeynotes() {
    if (allKeynotes.length === 0) {
        try {
            const response = await fetch(KEYNOTE_API);
            const data = await response.json();
            allKeynotes = data._embedded ? data._embedded.keynotes : [];
        } catch (error) {
            console.error('Erreur lors du chargement des keynotes:', error);
        }
    }
    return allKeynotes;
}

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

// CRUD Keynotes
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
        
        if (currentKeynoteId) {
            // Modification
            response = await fetch(`${KEYNOTE_API}/${currentKeynoteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(keynoteData)
            });
        } else {
            // Création
            response = await fetch(KEYNOTE_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(keynoteData)
            });
        }

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
    const modal = new bootstrap.Modal(document.getElementById('deleteKeynoteModal'));
    modal.show();
}

// Confirmation de suppression keynote
document.getElementById('confirm-delete-keynote').addEventListener('click', async function() {
    await deleteKeynote(currentKeynoteId);
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteKeynoteModal'));
    modal.hide();
});

async function deleteKeynote(keynoteId) {
    try {
        const response = await fetch(`${KEYNOTE_API}/${keynoteId}`, {
            method: 'DELETE'
        });

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