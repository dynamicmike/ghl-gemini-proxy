// ContentPromptPro - Fixed Language Switching Version
class ContentPromptPro {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 37; // FIXED: Reduced from 38 since Q9 is removed
        this.language = 'en';
        this.isAuthenticated = false;
        this.formData = {};
        this.API_BASE_URL = 'https://ghl-gemini-proxy.onrender.com';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateDynamicSteps();
        // CRITICAL FIX: Update language after all content is created
        this.updateLanguageElements();
        this.showStep(0);
    }

    setupEventListeners() {
        // Language selector - CRITICAL FIX
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                console.log('Language change event triggered:', e.target.value);
                this.setLanguage(e.target.value);
            });
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousStep());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());

        // Checkbox controls
        const selectAll = document.getElementById('selectAll');
        const clearAll = document.getElementById('clearAll');
        
        if (selectAll) selectAll.addEventListener('click', () => this.selectAllContentTypes());
        if (clearAll) clearAll.addEventListener('click', () => this.clearAllContentTypes());

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
    }

    setLanguage(lang) {
        console.log(`🌍 LANGUAGE CHANGE: ${this.language} → ${lang}`);
        this.language = lang;
        
        // Update language selector to reflect change
        const selector = document.getElementById('languageSelect');
        if (selector && selector.value !== lang) {
            selector.value = lang;
        }
        
        // IMMEDIATE LANGUAGE UPDATE with multiple attempts
        this.updateLanguageElements();
        
        // Force update for current step content
        setTimeout(() => {
            this.updateLanguageElements();
        }, 50);
        
        setTimeout(() => {
            this.updateLanguageElements();
        }, 150);
    }

    updateLanguageElements() {
        console.log(`🔧 UPDATING LANGUAGE TO: ${this.language}`);
        
        // Force a small delay to ensure DOM is ready
        setTimeout(() => {
            // Get ALL elements with language attributes (fresh query every time)
            const allElements = document.querySelectorAll('[data-en], [data-es]');
            const allPlaceholders = document.querySelectorAll('[data-en-placeholder], [data-es-placeholder]');
            
            console.log(`Found ${allElements.length} text elements and ${allPlaceholders.length} placeholder elements`);
            
            // Update text content
            allElements.forEach((element, index) => {
                const text = element.getAttribute(`data-${this.language}`);
                if (text && text !== element.textContent) {
                    console.log(`Updating element ${index}: "${element.textContent}" → "${text}"`);
                    element.textContent = text;
                }
            });
            
            // Update placeholders
            allPlaceholders.forEach((input, index) => {
                const placeholder = input.getAttribute(`data-${this.language}-placeholder`);
                if (placeholder && placeholder !== input.placeholder) {
                    console.log(`Updating placeholder ${index}: "${input.placeholder}" → "${placeholder}"`);
                    input.placeholder = placeholder;
                }
            });
            
            // Update navigation buttons
            this.updateNavigationLanguage();
            
            console.log('✅ Language update complete');
        }, 50); // Small delay to ensure DOM is ready
    }

    updateNavigationLanguage() {
        const translations = {
            en: { previous: "Previous", next: "Next", submit: "Generate Content Plan" },
            es: { previous: "Anterior", next: "Siguiente", submit: "Generar Plan de Contenido" }
        };
        
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.textContent = translations[this.language].previous;
        }
        
        if (nextBtn) {
            if (this.currentStep === this.totalSteps - 1) {
                nextBtn.textContent = translations[this.language].submit;
            } else {
                nextBtn.textContent = translations[this.language].next;
            }
        }
    }

    showStep(stepNumber) {
        console.log(`🔄 SHOWING STEP: ${stepNumber}`);
        
        // Hide all steps
        document.querySelectorAll('.step').forEach(step => {
            step.style.display = 'none';
            step.classList.remove('active');
        });
        
        // Show target step
        const targetStep = document.getElementById(`step${stepNumber}`);
        if (targetStep) {
            targetStep.style.display = 'block';
            targetStep.classList.add('active');
            console.log(`✅ Step ${stepNumber} is now visible`);
        } else {
            console.error(`❌ Step ${stepNumber} not found!`);
        }
        
        this.currentStep = stepNumber;
        this.updateProgressBar();
        this.updateNavigation();
        
        // CRITICAL: Update language AFTER step is shown and DOM is ready
        // Use multiple calls to ensure translation works
        this.updateLanguageElements();
        
        // Additional backup calls for dynamic content
        setTimeout(() => {
            console.log(`🌐 Backup language update for step ${stepNumber}`);
            this.updateLanguageElements();
        }, 100);
        
        setTimeout(() => {
            console.log(`🌐 Final language update for step ${stepNumber}`);
            this.updateLanguageElements();
        }, 200);
        
        // Handle special steps
        if (stepNumber === 36) { // FIXED: Changed from 37 to 36 (Q37 becomes Q36)
            this.generateThemes();
        } else if (stepNumber === 37) { // FIXED: Changed from 38 to 37 (Q38 becomes Q37)
            this.generateSubThemes();
        }
    }

    updateProgressBar() {
        if (this.currentStep === 0) {
            const progressContainer = document.getElementById('progressContainer');
            if (progressContainer) progressContainer.style.display = 'none';
            return;
        }
        
        const progressContainer = document.getElementById('progressContainer');
        const currentQuestion = document.getElementById('currentQuestion');
        const progressFill = document.getElementById('progressFill');
        
        if (progressContainer) progressContainer.style.display = 'block';
        if (currentQuestion) currentQuestion.textContent = this.currentStep;
        if (progressFill) {
            // FIXED: Adjust progress calculation for skipped questions
            let adjustedProgress;
            if (this.currentStep <= 10) {
                adjustedProgress = (this.currentStep / this.totalSteps) * 100;
            } else if (this.currentStep >= 28) {
                // Map Q28-Q37 to progress positions
                const mappedStep = 11 + (this.currentStep - 28);
                adjustedProgress = (mappedStep / this.totalSteps) * 100;
            } else {
                adjustedProgress = (this.currentStep / this.totalSteps) * 100;
            }
            progressFill.style.width = `${adjustedProgress}%`;
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const navigation = document.getElementById('navigation');
        
        if (this.currentStep === 0) {
            if (navigation) navigation.style.display = 'none';
            return;
        }
        
        if (navigation) navigation.style.display = 'flex';
        if (prevBtn) prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-block';
        
        this.updateNavigationLanguage();
    }

    async handleLogin() {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        
        if (!email || !password || !email.value.trim() || !password.value.trim()) {
            this.showError('Please fill in all fields.');
            return;
        }
        
        try {
            // Simulate login
            await this.delay(1000);
            this.isAuthenticated = true;
            
            // Show user menu
            const userMenu = document.getElementById('userMenu');
            const userName = document.getElementById('userName');
            if (userMenu) userMenu.style.display = 'flex';
            if (userName) userName.textContent = email.value;
            
            // Go to first question
            this.showStep(1);
            
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Login failed. Please try again.');
        }
    }

    logout() {
        this.isAuthenticated = false;
        this.currentStep = 0;
        this.formData = {};
        
        const userMenu = document.getElementById('userMenu');
        if (userMenu) userMenu.style.display = 'none';
        
        this.showStep(0);
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            
            let nextStepNumber = this.currentStep + 1;
            
            // FIXED: Special case - Skip Q11-Q27, go directly to Q28
            if (this.currentStep === 10) { // After Q10
                nextStepNumber = 28; // Jump to Q28
            }
            
            if (nextStepNumber < this.totalSteps - 1) {
                this.showStep(nextStepNumber);
            } else {
                this.submitForm();
            }
        }
    }

    previousStep() {
        let prevStepNumber = this.currentStep - 1;
        
        // FIXED: Special case - If coming back from Q28, go to Q10
        if (this.currentStep === 28) {
            prevStepNumber = 10; // Go back to Q10
        }
        
        if (prevStepNumber > 0) {
            this.showStep(prevStepNumber);
        }
    }

    validateCurrentStep() {
        // Add validation logic for required fields
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (!currentStepElement) return true;
        
        const requiredInputs = currentStepElement.querySelectorAll('input[required], textarea[required]');
        for (let input of requiredInputs) {
            if (!input.value.trim()) {
                this.showError(`Please fill in all required fields.`);
                return false;
            }
        }
        return true;
    }

    saveCurrentStepData() {
        // Save form data - can be expanded
        console.log('Saving step data for step:', this.currentStep);
    }

    selectAllContentTypes() {
        document.querySelectorAll('input[name="contentTypes"]').forEach(cb => cb.checked = true);
    }

    clearAllContentTypes() {
        document.querySelectorAll('input[name="contentTypes"]').forEach(cb => cb.checked = false);
    }

    generateDynamicSteps() {
        console.log('🔧 Generating dynamic steps Q6-Q8, Q10, Q28-Q35...');
        
        const questions = [
            // Q6: Tangible outcomes
            { 
                type: 'textarea', 
                question: { en: 'What are the tangible outcomes or results your customers achieve?', es: '¿Cuáles son los resultados tangibles que logran tus clientes?' }, 
                placeholder: { en: 'e.g., Double their monthly revenue, Lose 20 pounds in 3 months...', es: 'Ej: Duplicar sus ingresos mensuales, Perder 20 libras en 3 meses...' }
            },
            // Q7: Common misunderstanding  
            { 
                type: 'textarea', 
                question: { en: "What's a common misunderstanding about your industry or service?", es: '¿Cuál es un malentendido común sobre tu industria o servicio?' }, 
                placeholder: { en: "What's a common myth or misunderstanding about your industry...", es: 'Cuál es un mito o malentendido común sobre tu industria...' }
            },
            // Q8: Unique approach
            { 
                type: 'textarea', 
                question: { en: 'What makes your approach unique?', es: '¿Qué hace único tu enfoque?' }, 
                placeholder: { en: 'Describe what sets you apart...', es: 'Describe lo que te distingue...' }
            },
            // Q10: Target audience (Skip Q9 as requested)
            { 
                type: 'textarea', 
                question: { en: 'What is your target audience demographic?', es: '¿Cuál es la demografía de tu audiencia objetivo?' }, 
                placeholder: { en: 'Describe your ideal customer...', es: 'Describe tu cliente ideal...' }
            },
            // Q28: Customer pain points
            { 
                type: 'textarea', 
                question: { en: 'What are the biggest pain points your customers face?', es: '¿Cuáles son los mayores puntos de dolor que enfrentan tus clientes?' }, 
                placeholder: { en: 'Describe the main challenges your customers experience...', es: 'Describe los principales desafíos que experimentan tus clientes...' }
            },
            // Q29: Success stories
            { 
                type: 'textarea', 
                question: { en: 'Can you share a specific success story or case study?', es: '¿Puedes compartir una historia de éxito específica o caso de estudio?' }, 
                placeholder: { en: 'Tell us about a client transformation...', es: 'Cuéntanos sobre una transformación de cliente...' }
            },
            // Q30: Industry trends
            { 
                type: 'textarea', 
                question: { en: 'What trends do you see in your industry?', es: '¿Qué tendencias ves en tu industria?' }, 
                placeholder: { en: 'Describe emerging trends or changes...', es: 'Describe tendencias emergentes o cambios...' }
            },
            // Q31: Common objections
            { 
                type: 'textarea', 
                question: { en: 'What are common objections or hesitations from potential customers?', es: '¿Cuáles son las objeciones o dudas comunes de clientes potenciales?' }, 
                placeholder: { en: 'What concerns do prospects typically have...', es: 'Qué preocupaciones suelen tener los prospectos...' }
            },
            // Q32: Value proposition
            { 
                type: 'textarea', 
                question: { en: 'How do you communicate your value proposition?', es: '¿Cómo comunicas tu propuesta de valor?' }, 
                placeholder: { en: 'Explain how you present your unique value...', es: 'Explica cómo presentas tu valor único...' }
            },
            // Q33: Customer journey
            { 
                type: 'textarea', 
                question: { en: 'What does the typical customer journey look like?', es: '¿Cómo se ve el viaje típico del cliente?' }, 
                placeholder: { en: 'Describe the steps from awareness to purchase...', es: 'Describe los pasos desde la conciencia hasta la compra...' }
            },
            // Q34: Content goals
            { 
                type: 'textarea', 
                question: { en: 'What specific goals do you want to achieve with your content?', es: '¿Qué objetivos específicos quieres lograr con tu contenido?' }, 
                placeholder: { en: 'Define your content marketing objectives...', es: 'Define tus objetivos de marketing de contenido...' }
            },
            // Q35: Brand personality
            { 
                type: 'textarea', 
                question: { en: 'How would you describe your brand personality?', es: '¿Cómo describirías la personalidad de tu marca?' }, 
                placeholder: { en: 'Describe your brand voice and tone...', es: 'Describe la voz y tono de tu marca...' }
            }
        ];

        const container = document.querySelector('.form-content');
        const step36 = document.getElementById('step36'); // FIXED: Changed from step37 to step36
        
        questions.forEach((q, index) => {
            // FIXED: Handle Q9 skip - Q6=6, Q7=7, Q8=8, Q10=10, Q28=28, etc.
            let stepNumber;
            if (index < 3) {
                stepNumber = 6 + index; // Q6, Q7, Q8
            } else if (index === 3) {
                stepNumber = 10; // Q10 (skip Q9)
            } else {
                stepNumber = 24 + index; // Q28, Q29, Q30, Q31, Q32, Q33, Q34, Q35
            }
            
            const step = document.createElement('div');
            step.className = 'step';
            step.id = `step${stepNumber}`;
            step.style.display = 'none';

            let content = `
                <div class="step-content">
                    <h2 data-en="Q${stepNumber}: ${q.question.en}" data-es="P${stepNumber}: ${q.question.es}">Q${stepNumber}: ${q.question.en}</h2>
            `;

            if (q.type === 'textarea') {
                content += `
                    <textarea id="q${stepNumber}" class="form-textarea" 
                        data-en-placeholder="${q.placeholder.en}" 
                        data-es-placeholder="${q.placeholder.es}" 
                        placeholder="${q.placeholder.en}"></textarea>
                `;
            }

            content += `
                    <div class="error-message" id="error${stepNumber}"></div>
                </div>
            `;

            step.innerHTML = content;
            container.insertBefore(step, step36);
        });
        
        // Update language after dynamic steps are created
        this.updateLanguageElements();
    }

    async generateThemes() {
        console.log('Generating themes...');
        const loadingDiv = document.getElementById('themeLoading');
        const optionsDiv = document.getElementById('themeOptions');
        
        if (loadingDiv) loadingDiv.style.display = 'block';
        if (optionsDiv) optionsDiv.style.display = 'none';
        
        try {
            // Simulate AI call - replace with real API
            await this.delay(2000);
            
            const themes = [
                { en: "Authority & Expertise Builder", es: "Constructor de Autoridad y Experiencia" },
                { en: "Customer Success Stories", es: "Historias de Éxito de Clientes" },
                { en: "Behind-the-Scenes Insights", es: "Perspectivas Detrás de Escenas" }
            ];
            
            if (optionsDiv) {
                optionsDiv.innerHTML = themes.map((theme, index) => `
                    <label class="radio-option">
                        <input type="radio" name="selectedTheme" value="${index}">
                        <span data-en="${theme.en}" data-es="${theme.es}">${theme.en}</span>
                    </label>
                `).join('');
                
                optionsDiv.style.display = 'block';
            }
            
            if (loadingDiv) loadingDiv.style.display = 'none';
            
            // Update language for new elements
            this.updateLanguageElements();
            
        } catch (error) {
            console.error('Theme generation error:', error);
            this.showError('Failed to generate themes. Please try again.');
        }
    }

    async generateSubThemes() {
        console.log('Generating sub-themes...');
        const loadingDiv = document.getElementById('subthemeLoading');
        const optionsDiv = document.getElementById('subthemeOptions');
        
        if (loadingDiv) loadingDiv.style.display = 'block';
        if (optionsDiv) optionsDiv.style.display = 'none';
        
        try {
            // Simulate AI call
            await this.delay(2000);
            
            const subthemes = [
                { en: "Week 1: Industry Insights", es: "Semana 1: Perspectivas de la Industria" },
                { en: "Week 2: Client Transformations", es: "Semana 2: Transformaciones de Clientes" },
                { en: "Week 3: Behind the Process", es: "Semana 3: Detrás del Proceso" },
                { en: "Week 4: Future Trends", es: "Semana 4: Tendencias Futuras" }
            ];
            
            if (optionsDiv) {
                optionsDiv.innerHTML = subthemes.map((subtheme, index) => `
                    <label class="checkbox-option">
                        <input type="checkbox" name="selectedSubthemes" value="${index}">
                        <span data-en="${subtheme.en}" data-es="${subtheme.es}">${subtheme.en}</span>
                    </label>
                `).join('');
                
                optionsDiv.style.display = 'block';
            }
            
            if (loadingDiv) loadingDiv.style.display = 'none';
            
            // Update language for new elements
            this.updateLanguageElements();
            
        } catch (error) {
            console.error('Sub-theme generation error:', error);
            this.showError('Failed to generate sub-themes. Please try again.');
        }
    }

    async submitForm() {
        console.log('Submitting form...');
        try {
            // Collect all form data
            const formData = this.collectFormData();
            
            // Send to API (replace with real endpoint)
            const response = await fetch(`${this.API_BASE_URL}/api/submit-form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                console.log('Form submitted successfully');
                // Handle success - redirect or show success message
            } else {
                throw new Error('Form submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Failed to submit form. Please try again.');
        }
    }

    collectFormData() {
        // Collect all form data from steps
        const data = {};
        
        // Add logic to collect data from all form fields
        document.querySelectorAll('input, textarea, select').forEach(field => {
            if (field.name && field.value) {
                data[field.name] = field.value;
            }
        });
        
        return data;
    }

    showError(message) {
        // Show error message to user
        console.error(message);
        // Add UI error display logic here
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContentPromptPro();
});

