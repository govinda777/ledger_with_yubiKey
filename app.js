// Application data
const appData = {
  "tutorial_steps": [
    {
      "id": 1,
      "title": "Instalar FIDO U2F App",
      "description": "Instale o aplicativo FIDO U2F no seu dispositivo Ledger",
      "details": [
        "Abra o Ledger Live no seu computador",
        "Conecte e desbloqueie sua Ledger com o PIN",
        "Vá para Manager no Ledger Live",
        "Procure por 'FIDO U2F' no catálogo de apps",
        "Clique em 'Install' e aguarde a instalação",
        "O app aparecerá no display da sua Ledger"
      ]
    },
    {
      "id": 2,
      "title": "Configurar Google",
      "description": "Configure sua conta Google para usar a Ledger como chave de segurança",
      "details": [
        "Faça login na sua conta Google",
        "Vá para 'Minha Conta' → 'Segurança'",
        "Clique em 'Verificação em duas etapas'",
        "Selecione 'Adicionar chave de segurança'",
        "Abra o app FIDO U2F na Ledger",
        "Insira a Ledger no USB e siga as instruções",
        "Pressione ambos os botões quando solicitado"
      ]
    },
    {
      "id": 3,
      "title": "Configurar GitHub", 
      "description": "Adicione sua Ledger como método 2FA no GitHub",
      "details": [
        "Faça login no GitHub",
        "Vá para Settings → Security",
        "Configure 2FA primeiro (SMS ou app)",
        "Scroll até 'Security keys'",
        "Clique em 'Register new device'",
        "Dê um nome para sua Ledger",
        "Abra FIDO U2F na Ledger e confirme"
      ]
    },
    {
      "id": 4,
      "title": "Configurar Dropbox",
      "description": "Ative verificação em duas etapas no Dropbox",
      "details": [
        "Entre na sua conta Dropbox",
        "Vá para Settings → Security",
        "Ative 'Two-step verification'",
        "Configure método backup primeiro",
        "Clique em 'Add' em Security keys",
        "Insira sua Ledger e abra FIDO U2F",
        "Confirme a operação na Ledger"
      ]
    },
    {
      "id": 5,
      "title": "Configurar Facebook",
      "description": "Adicione chave de segurança na sua conta Facebook",
      "details": [
        "Acesse Facebook → Settings & Privacy",
        "Vá para 'Security and Login'",
        "Clique em 'Use two-factor authentication'",
        "Escolha 'Security Key' como método",
        "Conecte sua Ledger e abra FIDO U2F",
        "Pressione os botões quando solicitado",
        "Guarde códigos de backup"
      ]
    }
  ],
  "supported_services": [
    {"name": "Google", "status": "Totalmente suportado", "icon": "🔍"},
    {"name": "GitHub", "status": "Totalmente suportado", "icon": "🐙"}, 
    {"name": "Dropbox", "status": "Totalmente suportado", "icon": "📁"},
    {"name": "Facebook", "status": "Totalmente suportado", "icon": "👤"},
    {"name": "Dashlane", "status": "Suportado", "icon": "🔐"},
    {"name": "Binance", "status": "Suportado", "icon": "💰"},
    {"name": "Coinbase", "status": "Suportado", "icon": "🪙"},
    {"name": "Twitter/X", "status": "Suportado", "icon": "🐦"},
    {"name": "GitLab", "status": "Suportado", "icon": "🦊"},
    {"name": "Bitbucket", "status": "Suportado", "icon": "🪣"}
  ],
  "faq": [
    {
      "question": "Qual a diferença entre FIDO U2F e Security Key app?",
      "answer": "O FIDO U2F é o app original que suporta o protocolo U2F. O Security Key é mais novo e usa FIDO2/WebAuthn, mas as credenciais não são compatíveis entre eles."
    },
    {
      "question": "Posso usar Bluetooth com FIDO U2F?",
      "answer": "Sim, se você tem uma Ledger Nano X, pode usar FIDO U2F via Bluetooth emparelhando o dispositivo como 'Nano X U2F xxxx'."
    },
    {
      "question": "E se eu perder minha Ledger?",
      "answer": "Você pode restaurar sua seed phrase em outro dispositivo Ledger e reinstalar o FIDO U2F app. Suas credenciais serão restauradas automaticamente."
    },
    {
      "question": "Posso usar a mesma Ledger em múltiplos serviços?",
      "answer": "Sim! Uma única Ledger pode ser registrada em todos os serviços compatíveis com FIDO U2F."
    },
    {
      "question": "A Ledger é melhor que YubiKey?",
      "answer": "Para uso diário, YubiKey é mais prática. Ledger como backup é uma boa estratégia, mas não ideal como dispositivo principal para 2FA."
    }
  ],
  "advantages": [
    "Usa hardware que você já possui",
    "Backup automático via seed phrase",
    "Suporte a múltiplos serviços",
    "Proteção adicional por PIN",
    "Elemento Seguro certificado"
  ],
  "limitations": [
    "Menos portável que YubiKey",
    "Durabilidade menor para uso diário", 
    "Requer Ledger Live instalado",
    "Incompatível com alguns softwares",
    "Pode ter problemas de compatibilidade"
  ]
};

// Application state
let currentStep = 0;
let completedSteps = new Set();

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderTutorialSteps();
    renderServices();
    renderFAQ();
    renderComparison();
    setupEventListeners();
    updateProgress();
    showCurrentStep();
}

function setupEventListeners() {
    // Start tutorial button
    const startTutorialBtn = document.getElementById('startTutorial');
    if (startTutorialBtn) {
        startTutorialBtn.addEventListener('click', () => {
            const tutorialSection = document.getElementById('tutorial');
            if (tutorialSection) {
                tutorialSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Navigation buttons
    const prevStepBtn = document.getElementById('prevStep');
    const nextStepBtn = document.getElementById('nextStep');
    
    if (prevStepBtn) {
        prevStepBtn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showCurrentStep();
                updateNavigation();
            }
        });
    }

    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', () => {
            if (currentStep < appData.tutorial_steps.length - 1) {
                currentStep++;
                showCurrentStep();
                updateNavigation();
            } else {
                // Go to services section when tutorial is complete
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
}

function renderTutorialSteps() {
    const tutorialStepsContainer = document.getElementById('tutorialSteps');
    if (!tutorialStepsContainer) return;
    
    tutorialStepsContainer.innerHTML = '';
    
    appData.tutorial_steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = `step ${index === 0 ? 'active' : ''}`;
        stepElement.innerHTML = `
            <div class="step__header">
                <div class="step__number">${step.id}</div>
                <h3 class="step__title">${step.title}</h3>
            </div>
            <p class="step__description">${step.description}</p>
            <ol class="step__details">
                ${step.details.map(detail => `<li>${detail}</li>`).join('')}
            </ol>
            <div class="step__checkbox">
                <input type="checkbox" id="step${step.id}" data-step-id="${step.id}">
                <label for="step${step.id}">✅ Etapa concluída</label>
            </div>
        `;
        tutorialStepsContainer.appendChild(stepElement);
        
        // Add event listener to checkbox
        const checkbox = stepElement.querySelector(`#step${step.id}`);
        if (checkbox) {
            checkbox.addEventListener('change', () => toggleStepCompletion(step.id));
        }
    });
}

function renderServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = '';
    
    appData.supported_services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card fade-in';
        serviceCard.innerHTML = `
            <div class="service-card__icon">${service.icon}</div>
            <div class="service-card__name">${service.name}</div>
            <div class="service-card__status">${service.status}</div>
        `;
        servicesGrid.appendChild(serviceCard);
    });
}

function renderFAQ() {
    const faqContainer = document.getElementById('faqContainer');
    if (!faqContainer) return;
    
    faqContainer.innerHTML = '';
    
    appData.faq.forEach((item, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.innerHTML = `
            <button class="faq-question" aria-expanded="false" data-faq-index="${index}">
                <span>${item.question}</span>
                <span class="faq-toggle">+</span>
            </button>
            <div class="faq-answer" id="faq-answer-${index}">
                <p>${item.answer}</p>
            </div>
        `;
        faqContainer.appendChild(faqItem);
        
        // Add event listener to FAQ question
        const questionBtn = faqItem.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => toggleFAQ(index));
        }
    });
}

function renderComparison() {
    // Render advantages
    const advantagesList = document.getElementById('advantagesList');
    if (advantagesList) {
        advantagesList.innerHTML = '';
        appData.advantages.forEach(advantage => {
            const li = document.createElement('li');
            li.textContent = advantage;
            advantagesList.appendChild(li);
        });
    }

    // Render limitations
    const limitationsList = document.getElementById('limitationsList');
    if (limitationsList) {
        limitationsList.innerHTML = '';
        appData.limitations.forEach(limitation => {
            const li = document.createElement('li');
            li.textContent = limitation;
            limitationsList.appendChild(li);
        });
    }
}

function showCurrentStep() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index === currentStep) {
            step.classList.add('active');
            step.classList.add('fade-in');
            setTimeout(() => step.classList.remove('fade-in'), 300);
        } else {
            step.classList.remove('active');
        }
    });
    updateNavigation();
}

function updateNavigation() {
    const prevStepBtn = document.getElementById('prevStep');
    const nextStepBtn = document.getElementById('nextStep');
    
    if (prevStepBtn) {
        prevStepBtn.disabled = currentStep === 0;
    }
    
    if (nextStepBtn) {
        if (currentStep === appData.tutorial_steps.length - 1) {
            nextStepBtn.textContent = 'Ver Serviços 🌐';
        } else {
            nextStepBtn.textContent = 'Próximo ➡️';
        }
    }
}

function toggleStepCompletion(stepId) {
    const checkbox = document.getElementById(`step${stepId}`);
    
    if (checkbox && checkbox.checked) {
        completedSteps.add(stepId);
    } else {
        completedSteps.delete(stepId);
    }
    
    updateProgress();
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
        const totalSteps = appData.tutorial_steps.length;
        const completed = completedSteps.size;
        const percentage = (completed / totalSteps) * 100;
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${completed}/${totalSteps}`;
    }
}

function toggleFAQ(index) {
    const questions = document.querySelectorAll('.faq-question');
    const answers = document.querySelectorAll('.faq-answer');
    
    if (index >= questions.length || index >= answers.length) return;
    
    const question = questions[index];
    const answer = answers[index];
    const toggle = question.querySelector('.faq-toggle');
    
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    
    // Close all other FAQ items
    questions.forEach((q, i) => {
        if (i !== index) {
            q.setAttribute('aria-expanded', 'false');
            const otherToggle = q.querySelector('.faq-toggle');
            if (otherToggle) otherToggle.textContent = '+';
            if (answers[i]) answers[i].classList.remove('open');
        }
    });
    
    // Toggle current item
    question.setAttribute('aria-expanded', !isExpanded);
    if (toggle) {
        toggle.textContent = !isExpanded ? '×' : '+';
    }
    answer.classList.toggle('open', !isExpanded);
}

// Smooth scroll for internal links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.advantage-card, .service-card, .info-card, .comparison__column');
    animateElements.forEach(el => observer.observe(el));
});

// Add some interactive feedback
document.addEventListener('DOMContentLoaded', () => {
    // Add click feedback to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add hover effects to cards
    document.querySelectorAll('.card, .advantage-card, .service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});