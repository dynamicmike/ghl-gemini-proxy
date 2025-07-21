class MultiStepForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 40; // 1 contact step + 39 question steps
        this.formData = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadExistingData(); // Load any existing form data from DOM
        this.showStep(); // Initial setup
        
        // Defer translation until after DOM and translations object are ready
        setTimeout(() => {
            const languageSelect = document.getElementById('languageSelect');
            const initialLang = languageSelect ? languageSelect.value : 'en';
            if (window.translations) {
                mySecretTranslatePage(initialLang);
            }
        }, 100);
    }

    bindEvents() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const form = document.getElementById('multiStepForm');
        const languageSelect = document.getElementById('languageSelect');

        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousStep());
        if (form) form.addEventListener('submit', (e) => this.handleSubmit(e));
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                mySecretTranslatePage(e.target.value);
            });
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            // Always save step data before proceeding
            this.saveStepData();
            
            if (this.currentStep < this.totalSteps) {
                // Special logic for Q9 - auto-populate draft statement (step 10 in HTML)
                if (this.currentStep === 10) {
                    this.generateDraftStatement();
                }
                
                // Special logic for Q10 - handle deep understanding opt-in
                if (this.currentStep === 11) {
                    const deepOptIn = document.querySelector('input[name="deepUnderstandingOptIn"]:checked');
                    if (deepOptIn && deepOptIn.value === 'No') {
                        // Skip deep understanding questions (steps 12-21) - jump to step 22
                        this.currentStep = 22;
                    } else {
                        this.currentStep++;
                    }
                }
                // Special logic for Q23 - handle include name choice (step 24 in HTML)
                else if (this.currentStep === 24) {
                    const includeNameChoice = document.querySelector('input[name="includeNameChoice"]:checked');
                    if (includeNameChoice && includeNameChoice.value === 'No') {
                        // Skip Q24 (step 25) and go to step 26  
                        this.currentStep = 26;
                    } else {
                        this.currentStep++;
                    }
                }
                // Special logic for Q38 - generate AI themes before showing step 39
                else if (this.currentStep === 38) {
                    // Validate we have required business data before AI generation
                    if (!this.formData.businessType || !this.formData.primaryProduct) {
                        const lang = document.getElementById('languageSelect')?.value || 'en';
                        const message = lang === 'es' ? 
                            'Por favor complete todas las preguntas anteriores antes de generar temas.' :
                            'Please complete all previous questions before generating themes.';
                        alert(message);
                        return;
                    }
                    this.currentStep++;
                    this.generateAIThemes();
                } else {
                    this.currentStep++;
                }
                this.showStep();
            } else {
                // Final step - submit to GHL
                this.handleSubmit();
            }
        }
    }

    saveStepData() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (!currentStepElement) return;

        // Save all form inputs from current step
        const inputs = currentStepElement.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (!this.formData[input.name]) this.formData[input.name] = [];
                if (input.checked && !this.formData[input.name].includes(input.value)) {
                    this.formData[input.name].push(input.value);
                } else if (!input.checked) {
                    this.formData[input.name] = this.formData[input.name].filter(val => val !== input.value);
                }
            } else if (input.type === 'radio') {
                if (input.checked) {
                    this.formData[input.name] = input.value;
                }
            } else {
                this.formData[input.name] = input.value;
            }
        });
        
        console.log('Saved step data:', this.formData);
    }

    generateDraftStatement() {
        // Collect responses from Q1-Q8 using formData (already saved)
        const businessType = this.formData.businessType || '';
        const primaryProduct = this.formData.primaryProduct || '';
        const problemSolved = this.formData.problemSolved || '';
        const uniqueSellingProposition = this.formData.uniqueSellingProposition || '';
        const claritySentence = this.formData.claritySentence || '';
        const clarityKidExplanation = this.formData.clarityKidExplanation || '';
        const clarityCustomerOutcomes = this.formData.clarityCustomerOutcomes || '';
        const clarityMisunderstanding = this.formData.clarityMisunderstanding || '';

        // Generate a simple draft statement
        let draft = '';
        if (businessType && primaryProduct) {
            draft += `We run a ${businessType} specializing in ${primaryProduct}. `;
        }
        if (problemSolved) {
            draft += `We solve ${problemSolved}. `;
        }
        if (uniqueSellingProposition) {
            draft += `What makes us different: ${uniqueSellingProposition}. `;
        }
        if (clarityCustomerOutcomes) {
            draft += `Our clients achieve: ${clarityCustomerOutcomes}.`;
        }

        // Auto-populate the draft statement textarea and save to formData
        const draftTextarea = document.getElementById('clarityDraftStatement');
        if (draftTextarea && draft) {
            draftTextarea.value = draft.trim();
            this.formData.clarityDraftStatement = draft.trim();
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (!currentStepElement) return true;

        // Get all required fields in current step
        const requiredFields = currentStepElement.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        // Clear all previous errors first
        currentStepElement.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        currentStepElement.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });

        requiredFields.forEach(field => {
            const errorElement = document.getElementById(`${field.name}Error`);

            // Check validation
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                if (errorElement) {
                    const lang = document.getElementById('languageSelect')?.value || 'en';
                    const errorMsg = lang === 'es' ? 'Este campo es obligatorio.' : 'This field is required.';
                    errorElement.textContent = errorMsg;
                    errorElement.style.display = 'block';
                }
            }

            // Special validation for radio buttons
            if (field.type === 'radio') {
                const radioGroup = currentStepElement.querySelectorAll(`input[name="${field.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) {
                    isValid = false;
                    radioGroup.forEach(radio => radio.classList.add('error'));
                    const radioError = document.getElementById(`${field.name}Error`);
                    if (radioError) {
                        const lang = document.getElementById('languageSelect')?.value || 'en';
                        const errorMsg = lang === 'es' ? 'Por favor seleccione una opción.' : 'Please select an option.';
                        radioError.textContent = errorMsg;
                        radioError.style.display = 'block';
                    }
                }
            }
        });

        // Additional validation for checkbox groups that require at least one selection
        const checkboxGroups = currentStepElement.querySelectorAll('.checkbox-group');
        checkboxGroups.forEach(group => {
            const checkboxes = group.querySelectorAll('input[type="checkbox"]');
            if (checkboxes.length > 0) {
                const isAnyChecked = Array.from(checkboxes).some(cb => cb.checked);
                const groupName = checkboxes[0]?.name;
                if (groupName) {
                    // Special validation for weeklySubThemes - requires exactly 4
                    if (groupName === 'weeklySubThemes') {
                        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
                        if (checkedCount !== 4) {
                            isValid = false;
                            checkboxes.forEach(cb => cb.classList.add('error'));
                            const groupError = document.getElementById(`${groupName}Error`);
                            if (groupError) {
                                const lang = document.getElementById('languageSelect')?.value || 'en';
                                const errorMsg = lang === 'es' ? 
                                    'Por favor seleccione exactamente 4 subtemas semanales.' : 
                                    'Please select exactly 4 weekly sub-themes.';
                                groupError.textContent = errorMsg;
                                groupError.style.display = 'block';
                            }
                        }
                    }
                    // Regular validation for other groups - at least one
                    else if (!isAnyChecked) {
                        const requiredGroups = ['contentFocus', 'interactionStyles'];
                        if (requiredGroups.includes(groupName)) {
                            isValid = false;
                            checkboxes.forEach(cb => cb.classList.add('error'));
                            const groupError = document.getElementById(`${groupName}Error`);
                            if (groupError) {
                                const lang = document.getElementById('languageSelect')?.value || 'en';
                                const errorMsg = lang === 'es' ? 'Por favor seleccione al menos una opción.' : 'Please select at least one option.';
                                groupError.textContent = errorMsg;
                                groupError.style.display = 'block';
                            }
                        }
                    }
                }
            }
        });

        return isValid;
    }

    previousStep() {
        if (this.currentStep > 1) {
            // Always save current step data before going back
            this.saveStepData();
            
            // Special logic for going back from content planning section  
            if (this.currentStep === 26) {
                // Check if user had selected "No" for deep understanding
                const deepOptIn = document.querySelector('input[name="deepUnderstandingOptIn"]:checked');
                if (deepOptIn && deepOptIn.value === 'No') {
                    // Go back to Q11 (step 11) 
                    this.currentStep = 11;
                } else {
                    // Go back to last deep understanding question (step 25)
                    this.currentStep = 25;
                }
            } else {
                this.currentStep--;
            }
            this.showStep();
            this.restoreStepData(); // Restore data for the step we're going to
        }
    }

    showStep() {
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        this.updateProgressBar();
        this.updateNavigation();
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        const currentStepEl = document.getElementById('currentStep');
        const totalStepsEl = document.getElementById('totalSteps');
        
        // Step 1 is contact info, actual questions start at step 2
        const currentQuestion = Math.max(0, this.currentStep - 1);
        const totalQuestions = 39; // 39 actual questions (steps 2-40)
        
        if (progressFill) progressFill.style.width = `${(currentQuestion / totalQuestions) * 100}%`;
        if (currentStepEl) currentStepEl.textContent = currentQuestion;
        if (totalStepsEl) totalStepsEl.textContent = totalQuestions;
    }

    updateNavigation() {
        const lang = document.getElementById('languageSelect')?.value || 'en';
        // Safe access to translations object
        const t = (window.translations && window.translations[lang]) ? 
                  window.translations[lang] : 
                  (window.translations ? window.translations.en : null);
        
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if(prevBtn && t) {
            prevBtn.textContent = t.previous;
            prevBtn.style.display = this.currentStep > 1 ? 'inline-block' : 'none';
        }
        if(nextBtn && t) {
            nextBtn.textContent = t.next;
            nextBtn.style.display = this.currentStep < this.totalSteps ? 'inline-block' : 'none';
        }
        if(submitBtn && t) {
            submitBtn.textContent = t.generateContent;
            submitBtn.style.display = this.currentStep === this.totalSteps ? 'inline-block' : 'none';
        }
    }

    loadExistingData() {
        // Load any existing data from form fields into formData object
        const allInputs = document.querySelectorAll('input, textarea, select');
        allInputs.forEach(input => {
            if (input.value && input.name) {
                if (input.type === 'checkbox') {
                    if (!this.formData[input.name]) this.formData[input.name] = [];
                    if (input.checked && !this.formData[input.name].includes(input.value)) {
                        this.formData[input.name].push(input.value);
                    }
                } else if (input.type === 'radio') {
                    if (input.checked) {
                        this.formData[input.name] = input.value;
                    }
                } else {
                    this.formData[input.name] = input.value;
                }
            }
        });
    }

    restoreStepData() {
        // Restore form data for the current step from formData object
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (!currentStepElement) return;

        const inputs = currentStepElement.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.name && this.formData[input.name] !== undefined) {
                if (input.type === 'checkbox') {
                    const values = Array.isArray(this.formData[input.name]) ? 
                                   this.formData[input.name] : [this.formData[input.name]];
                    input.checked = values.includes(input.value);
                } else if (input.type === 'radio') {
                    input.checked = this.formData[input.name] === input.value;
                } else {
                    input.value = this.formData[input.name] || '';
                }
            }
        });
    }
}