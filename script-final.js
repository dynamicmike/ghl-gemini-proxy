// Helper functions for Step 40
function selectAll(groupName) {
    document.querySelectorAll(`input[name="${groupName}"]`).forEach(cb => cb.checked = true);
}

function clearAll(groupName) {
    document.querySelectorAll(`input[name="${groupName}"]`).forEach(cb => cb.checked = false);
}

class MultiStepForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 40;
        this.formData = {};
        this.proxyUrl = 'https://ghl-gemini-proxy.onrender.com';
        // NEW: Property to track current language
        this.currentLang = 'en'; 
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadExistingData();
        this.showStep();
    }

    bindEvents() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const form = document.getElementById('multiStepForm');
        const mainThemeSelect = document.getElementById('mainTheme');
        // NEW: Language selector logic from Manus's analysis
        const languageSelect = document.getElementById('languageSelect');

        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousStep());
        if (form) form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        if (mainThemeSelect) {
            mainThemeSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.generateAISubThemes(e.target.value);
                }
            });
        }

        // NEW: Event listener for language changes
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.applyLanguage(e.target.value);
            });
        }
    }
    
    // NEW: Function to apply language translations
    applyLanguage(lang) {
        this.currentLang = lang; // Store the selected language
        const translations = {
            es: {
                next: 'Siguiente',
                previous: 'Anterior',
                submit: 'Generar Plan'
            },
            en: {
                next: 'Next',
                previous: 'Previous',
                submit: 'Generate Content Plan'
            }
        };

        const labels = translations[lang];
        if (!labels) return;

        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (nextBtn) nextBtn.textContent = labels.next;
        if (prevBtn) prevBtn.textContent = labels.previous;
        if (submitBtn) submitBtn.textContent = labels.submit;
    }

    async nextStep() {
        if (this.validateCurrentStep()) {
            this.saveStepData();

            if (this.currentStep < this.totalSteps) {
                if (this.currentStep === 10) this.generateDraftStatement();
                
                if (this.currentStep === 11) {
                    const deepOptIn = document.querySelector('input[name="deepUnderstandingOptIn"]:checked');
                    this.currentStep = (deepOptIn && deepOptIn.value === 'No') ? 22 : 12;
                } else if (this.currentStep === 24) {
                    const includeNameChoice = document.querySelector('input[name="includeNameChoice"]:checked');
                    this.currentStep = (includeNameChoice && includeNameChoice.value === 'No') ? 26 : 25;
                } else if (this.currentStep === 38) {
                    if (!this.formData.businessType || !this.formData.primaryProduct) {
                        alert('Please complete all previous questions before generating themes.');
                        return;
                    }
                    this.currentStep++;
                    await this.generateAIThemes();
                } else {
                    this.currentStep++;
                }
                this.showStep();
            }
        }
    }

    saveStepData() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (!currentStepElement) return;

        const inputs = currentStepElement.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (!this.formData[input.name]) this.formData[input.name] = [];
                const valueExists = this.formData[input.name].includes(input.value);
                if (input.checked && !valueExists) {
                    this.formData[input.name].push(input.value);
                } else if (!input.checked && valueExists) {
                    this.formData[input.name] = this.formData[input.name].filter(val => val !== input.value);
                }
            } else if (input.type === 'radio') {
                if (input.checked) this.formData[input.name] = input.value;
            } else {
                this.formData[input.name] = input.value;
            }
        });
    }

    generateDraftStatement() {
        const businessType = this.formData.businessType || '';
        const primaryProduct = this.formData.primaryProduct || '';
        const problemSolved = this.formData.problemSolved || '';
        const uniqueSellingProposition = this.formData.uniqueSellingProposition || '';
        const clarityCustomerOutcomes = this.formData.clarityCustomerOutcomes || '';

        let draft = `We run a ${businessType} specializing in ${primaryProduct}. We solve ${problemSolved}. What makes us different: ${uniqueSellingProposition}. Our clients achieve: ${clarityCustomerOutcomes}.`;
        
        const draftTextarea = document.getElementById('clarityDraftStatement');
        if (draftTextarea) {
            draftTextarea.value = draft.trim();
            this.formData.clarityDraftStatement = draft.trim();
        }
    }

    async generateAIThemes() {
        const themeLoading = document.getElementById('themeLoading');
        const mainThemeSelect = document.getElementById('mainTheme');
        
        themeLoading.style.display = 'block';
        mainThemeSelect.style.display = 'none';

        try {
            const response = await fetch(`${this.proxyUrl}/gemini-themes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessType: this.formData.businessType,
                    primaryProduct: this.formData.primaryProduct,
                    problemSolved: this.formData.problemSolved,
                    targetAudience: this.formData.targetAudience,
                    contentGoal: this.formData.contentGoal
                })
            });

            if (!response.ok) throw new Error('Failed to fetch themes');

            const data = await response.json();
            mainThemeSelect.innerHTML = '<option value="">-- Select a Main Theme --</option>';
            data.themes.forEach(theme => {
                const option = document.createElement('option');
                option.value = theme;
                option.textContent = theme;
                mainThemeSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Error generating AI themes:', error);
            alert('Could not generate AI themes. Please try again.');
        } finally {
            themeLoading.style.display = 'none';
            mainThemeSelect.style.display = 'block';
        }
    }

    async generateAISubThemes(mainTheme) {
        const subthemeLoading = document.getElementById('subthemeLoading');
        const container = document.getElementById('weeklySubThemesContainer');
        const controls = document.getElementById('subthemeControls');

        subthemeLoading.style.display = 'block';
        container.style.display = 'none';
        controls.style.display = 'none';
        container.innerHTML = '';

        try {
            const response = await fetch(`${this.proxyUrl}/gemini-sub-themes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mainTheme })
            });

            if (!response.ok) throw new Error('Failed to fetch sub-themes');

            const data = await response.json();
            data.subthemes.forEach((subtheme, index) => {
                const id = `subtheme-${index}`;
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'weeklySubThemes';
                checkbox.value = subtheme;
                checkbox.id = id;
                label.appendChild(checkbox);
                label.append(` ${subtheme}`);
                container.appendChild(label);
            });
        } catch (error) {
            console.error('Error generating AI sub-themes:', error);
            alert('Could not generate sub-themes.');
        } finally {
            subthemeLoading.style.display = 'none';
            container.style.display = 'block';
            controls.style.display = 'block';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (!this.validateCurrentStep()) {
            alert('Please fix the errors before submitting.');
            return;
        }
        this.saveStepData();

        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        console.log('--- FINAL FORM DATA ---');
        console.log(JSON.stringify(this.formData, null, 2));
        
        alert('Form submitted! Check the console for the final data.');
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (!currentStepElement) return true;

        let isValid = true;
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        
        currentStepElement.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        currentStepElement.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        requiredFields.forEach(field => {
            let fieldValid = true;
            if (field.type === 'radio' || field.type === 'checkbox') {
                const groupName = field.name;
                const group = currentStepElement.querySelectorAll(`input[name="${groupName}"]`);
                if (!Array.from(group).some(i => i.checked)) {
                    fieldValid = false;
                }
            } else if (!field.value.trim()) {
                fieldValid = false;
            }

            if (!fieldValid) {
                isValid = false;
                const errorElement = document.getElementById(`${field.name}Error`);
                field.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'This field is required.';
                    errorElement.style.display = 'block';
                }
            }
        });
        return isValid;
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            this.saveStepData();
            
            if (this.currentStep === 26) {
                const includeNameChoice = this.formData.includeNameChoice;
                this.currentStep = (includeNameChoice === 'No') ? 24 : 25;
            } else if (this.currentStep === 22) {
                const deepOptIn = this.formData.deepUnderstandingOptIn;
                this.currentStep = (deepOptIn === 'No') ? 11 : 21;
            } else {
                this.currentStep--;
            }
            this.showStep();
            this.restoreStepData();
        }
    }

    showStep() {
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (currentStepElement) currentStepElement.classList.add('active');
        this.updateProgressBar();
        this.updateNavigation();
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        const currentStepEl = document.getElementById('currentStep');
        const totalStepsEl = document.getElementById('totalSteps');
        
        const currentQuestion = Math.max(0, this.currentStep - 1);
        const totalQuestions = 39;
        
        if (progressFill) progressFill.style.width = `${(currentQuestion / totalQuestions) * 100}%`;
        if (currentStepEl) currentStepEl.textContent = currentQuestion;
        if (totalStepsEl) totalStepsEl.textContent = totalQuestions;
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'inline-block' : 'none';
        }
        if (nextBtn) {
            nextBtn.style.display = this.currentStep < this.totalSteps ? 'inline-block' : 'none';
        }
        if (submitBtn) {
            submitBtn.style.display = this.currentStep === this.totalSteps ? 'inline-block' : 'none';
        }
        
        // MODIFIED: Always apply language to set button text
        this.applyLanguage(this.currentLang);
    }

    loadExistingData() {
        const allInputs = document.querySelectorAll('input, textarea, select');
        allInputs.forEach(input => {
            if (input.value && input.name) {
                if (input.type === 'radio' && input.checked) {
                    this.formData[input.name] = input.value;
                } else if (input.type !== 'radio' && input.type !== 'checkbox') {
                    this.formData[input.name] = input.value;
                }
            }
        });
    }

    restoreStepData() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (!currentStepElement) return;

        const inputs = currentStepElement.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (this.formData[input.name] !== undefined) {
                if (input.type === 'checkbox') {
                    input.checked = this.formData[input.name].includes(input.value);
                } else if (input.type === 'radio') {
                    input.checked = this.formData[input.name] === input.value;
                } else {
                    input.value = this.formData[input.name];
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MultiStepForm();
});
