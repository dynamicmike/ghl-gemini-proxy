// Helper functions for Step 40
function selectAll(groupName) {
    document.querySelectorAll(`input[name="${groupName}"]`).forEach(cb => cb.checked = true);
}

function clearAll(groupName) {
    document.querySelectorAll(`input[name="${groupName}"]`).forEach(cb => cb.checked = false);
}
// This large translations object contains all the text for the form in both languages.

const translations = {

    en: {
next: "Next",
previous: "Previous",

        title: "✨ ContentPromptPro", subtitle: "AI Social Media Content Generator", progress_question: "Question", progress_of: "of", submit: "Generate Content Plan", yes: "Yes", no: "No", select_option: "Select an option...", error_required: "This field is required.", error_invalid_email: "Please enter a valid email address.", error_invalid_phone: "Please include a country code (e.g., +1).", error_password_mismatch: "Passwords do not match.", final_message_h2: "Thank You!", final_message_p: "Your submission has been received.", submitting_h2: "Submitting...", submitting_p: "Please wait...", edit_answers: "Edit Answers", copy_summary: "Copy Summary", download_summary: "Download Summary",

        step0_h2: "Welcome!", step0_p_login: "Please log in to continue.", login: "Login", register_prompt: "Don't have an account? Register Here", forgot_password: "Forgot Password?", step0_email_label: "Email", step0_password_label: "Password", step0_confirm_password_label: "Confirm Password", step0_label1: "First Name *", step0_label2: "Last Name *", step0_label4: "Phone Number (with country code) *",

        auth_fail: "Invalid email or password.", auth_reg_fail: "User with this email already exists.", auth_success: "Registration successful! Please log in.",

        step1_h2: "Q1: What is your business type?", step1_p: "e.g., \"Coaching,\" \"Consulting,\" \"E-commerce,\" \"Local Service\"",

        step2_h2: "Q2: What is your primary product or service?", step2_p: "Be specific. e.g., \"1-on-1 business coaching for startups,\"",

        step3_h2: "Q3: What specific problem do you solve for your customers?", step3_p: "Describe the pain point you eliminate.",

        step4_h2: "Q4: What is your unique selling proposition (USP)?", step4_p: "What makes you different from competitors? (Optional)",

        step5_h2: "Q5: Complete this sentence: 'We help [ideal customer] to [achieve result] by [your method].'", step5_p: "This is your core value proposition.",

        step6_h2: "Q6: How would you explain what you do to a 10-year-old?", step6_p: "This helps simplify your message. (Optional)",

        step7_h2: "Q7: What are the tangible outcomes or results your customers achieve?", step7_p: "e.g., \"Double their monthly revenue,\" \"Lose 20 pounds in 3 months.\"",

        step8_h2: "Q8: What's a common misunderstanding about your industry or service?", step8_p: "This is great for creating myth-busting content. (Optional)",

        step9_h2: "Q9: Here is a draft of your clarity statement. Feel free to edit it.", step9_p: "We'll generate this based on your previous answers.",

        step10_h2: "Q10: Would you like to answer more detailed questions for a deeper brand analysis?", step10_p: "This will help the AI create more nuanced content. Choosing 'No' will skip to the Brand Voice section.", step10_option1: "Yes, let's go deeper", step10_option2: "No, let's keep it simple",

        step11_h2: "Q11: What are your unique frameworks or methodologies?", step11_p: "e.g., \"The 5-P Profit System,\" \"My proprietary 'Mindful Eating' technique.\"",

        step12_h2: "Q12: What are common objections or hesitations from potential customers?", step12_p: "e.g., \"It's too expensive,\" \"I don't have enough time.\"",

        step13_h2: "Q13: Describe the 'before' and 'after' scenario for your ideal client.", step13_p: "What is their state before your service, and what is their transformed state after?",

        step14_h2: "Q14: Describe your target audience in detail.", step14_p: "Think about their demographics, interests, values, and online behavior.",

        step15_h2: "Q15: What is the emotional impact you want to have on your audience?", step15_p: "e.g., \"Inspired and motivated,\" \"Confident and empowered.\"",

        step16_h2: "Q16: What is the core motivation behind why you do what you do?", step16_p: "This helps build an authentic connection.",

        step17_h2: "Q17: What are the biggest pain points of your target audience?", step17_p: "What keeps them up at night?",

        step18_h2: "Q18: What are their biggest aspirations or dreams?", step18_p: "What do they ultimately want to achieve?",

        step19_h2: "Q19: What challenges do they face in reaching those aspirations?", step19_p: "What obstacles are in their way?",

        step20_h2: "Q20: How does your service bridge the gap between their challenges and aspirations?", step20_p: "Describe the transformation you provide.",

        step21_h2: "Q21: Describe your brand voice.", step21_p: "e.g., \"Professional and authoritative,\" \"Playful and witty,\" \"Calm and empathetic.\"",

        step22_h2: "Q22: If your brand were a person, what three words would describe their vibe?", step22_p: "e.g., \"Confident, approachable, wise.\"",

        step23_h2: "Q23: Should the AI-generated content address you or your company by name?", step23_p: "",

        step24_h2: "Q24: What name should be used in the content?", step24_p: "e.g., \"I,\" \"we,\" \"the team at [Your Company],\" or your personal name.",

        step25_h2: "Q25: What is the primary goal of your content?", step25_p: "Choose the main objective for this content plan.", step25_opt1: "Increase Engagement", step25_opt2: "Generate Leads", step25_opt3: "Build Brand Awareness", step25_opt4: "Drive Sales", step25_opt5: "Educate Audience", step25_opt6: "Build Community",

        step26_h2: "Q26: How do you want your audience to feel after consuming your content?", step26_p: "e.g., \"Inspired,\" \"Informed,\" \"Entertained,\" \"Understood.\"",

        step27_h2: "Q27: What is your primary call-to-action (CTA)?", step27_p: "What is the main action you want users to take?", step27_opt1: "Visit our website", step27_opt2: "Book a consultation", step27_opt3: "Download our guide", step27_opt4: "Sign up for newsletter", step27_opt5: "Contact us", step27_opt6: "Learn more", step27_opt7: "Get started",

        step28_h2: "Q28: If you chose 'Other' for your CTA, please specify it here.", step28_p: "(Optional)",

        step29_h2: "Q29: What types of content should we focus on?", step29_p: "Select all that apply.", step29_opt1: "Educational/Informative", step29_opt2: "Promotional/Sales", step29_opt3: "Behind-the-scenes", step29_opt4: "Customer Stories/Testimonials", step29_opt5: "Industry Insights/News", step29_opt6: "Tips and Tutorials", step29_opt7: "Product/Service Updates", select_all: "Select All", clear_all: "Clear All",

        step30_h2: "Q30: Are there any topics, words, or phrases to absolutely avoid?", step30_p: "e.g., \"Avoid mentioning political topics,\" \"Don't use industry jargon like 'synergy'.\"",

        step31_h2: "Q31: What styles of interaction do you prefer to use?", step31_p: "How should the posts encourage engagement? Select all that apply.", step31_opt1: "Ask direct questions", step31_opt2: "Run polls and surveys", step31_opt3: "Use strong call-to-action prompts", step31_opt4: "Start discussions", step31_opt5: "Encourage sharing experiences", step31_opt6: "Give actionable tips and advice",

        step32_h2: "Q32: What is the primary format for the output?", step32_p: "How should the content be structured?", step32_opt1: "Social Media Posts", step32_opt2: "Blog Articles", step32_opt3: "Email Newsletter", step32_opt4: "Video Scripts", step32_opt5: "Podcast Topics",

        step33_h2: "Q33: Which platforms will you be posting on?", step33_p: "This helps tailor the content length and style. Select all that apply.",

        step34_h2: "Q34: What is the desired duration of this content plan?", step34_p: "",

        step35_h2: "Q35: When should the content plan start?", step35_p: "",

        step36_h2: "Q36: Is your business tied to a specific location?", step36_p: "If so, please specify the city, state, or country. (Optional)",

        step37_h2: "Q37: Are there any specific types of posts to exclude?", step37_p: "e.g., \"No memes,\" \"No posts about competitors.\"",

        step38_h2: "Q38: Let's generate some core content themes.", step38_p: "Based on your answers, we'll suggest some themes. Please select one to build upon.", theme_loading: "🧠 Generating themes with AI...",

        step39_h2: "Q39: Choose your weekly sub-themes.", step39_p: "Select four sub-themes for the month, or select a few and add your own.", subtheme_loading: "💡 Generating sub-themes...", step39_custom_label: "Or, add a custom sub-theme:"

    },

    es: {
next: "Siguiente",
previous: "Anterior",

    title: "✨ ContentPromptPro", subtitle: "Generador de Contenido IA para Redes Sociales", progress_question: "Pregunta", progress_of: "de", submit: "Generar Plan de Contenido", yes: "Sí", no: "No", select_option: "Selecciona una opción...", error_required: "Este campo es obligatorio.", error_invalid_email: "Por favor, introduce un correo electrónico válido.", error_invalid_phone: "Por favor, incluye un código de país (ej. +1).", error_password_mismatch: "Las contraseñas no coinciden.", final_message_h2: "¡Gracias!", final_message_p: "Hemos recibido tu información.", submitting_h2: "Enviando...", submitting_p: "Por favor, espera...", edit_answers: "Editar Respuestas", copy_summary: "Copiar Resumen", download_summary: "Descargar Resumen",
    step0_h2: "¡Bienvenido!", step0_p_login: "Por favor, inicia sesión para continuar.", login: "Iniciar Sesión", register_prompt: "¿No tienes una cuenta? Regístrate aquí", forgot_password: "¿Olvidaste tu contraseña?", step0_email_label: "Correo Electrónico", step0_password_label: "Contraseña", step0_confirm_password_label: "Confirmar Contraseña", step0_label1: "Nombre *", step0_label2: "Apellido *", step0_label4: "Número de Teléfono (con código de país) *",
    auth_fail: "Correo electrónico o contraseña no válidos.", auth_reg_fail: "Un usuario con este correo ya existe.", auth_success: "¡Registro exitoso! Por favor, inicia sesión.",
    step1_h2: "P1: ¿Cuál es tu tipo de negocio?", step1_p: "Ej: \"Coaching\", \"Consultoría\", \"E-commerce\", \"Servicio Local\"",
    step2_h2: "P2: ¿Cuál es tu producto o servicio principal?", step2_p: "Sé específico. Ej: \"Coaching empresarial 1 a 1 para startups,\"",
    step3_h2: "P3: ¿Qué problema específico resuelves para tus clientes?", step3_p: "Describe el punto de dolor que eliminas.",
    step4_h2: "P4: ¿Cuál es tu propuesta única de venta (PUV)?", step4_p: "¿Qué te diferencia de la competencia? (Opcional)",
    step5_h2: "P5: Completa esta frase: 'Ayudamos a [cliente ideal] a [lograr resultado] mediante [tu método].'", step5_p: "Esta es tu propuesta de valor principal.",
    step6_h2: "P6: ¿Cómo le explicarías lo que haces a un niño de 10 años?", step6_p: "Esto ayuda a simplificar tu mensaje. (Opcional)",
    step7_h2: "P7: ¿Cuáles son los resultados tangibles que logran tus clientes?", step7_p: "Ej: \"Duplicar sus ingresos mensuales\", \"Perder 10 kilos en 3 meses.\"",
    step8_h2: "P8: ¿Cuál es un malentendido común sobre tu industria o servicio?", step8_p: "Esto es ideal para crear contenido que desmienta mitos. (Opcional)",
    step9_h2: "P9: Aquí tienes un borrador de tu declaración de claridad. Siéntete libre de editarla.", step9_p: "La generaremos basándonos en tus respuestas anteriores.",
    step10_h2: "P10: ¿Te gustaría responder preguntas más detalladas para un análisis de marca más profundo?", step10_p: "Esto ayudará a la IA a crear contenido más matizado. Elegir 'No' saltará a la sección de Voz de Marca.", step10_option1: "Sí, profundicemos", step10_option2: "No, mantengámoslo simple",
    step11_h2: "P11: ¿Cuáles son tus marcos o metodologías únicas?", step11_p: "Ej: \"El Sistema de Ganancias de 5 P\", \"Mi técnica patentada de 'Alimentación Consciente'.\"",
    step12_h2: "P12: ¿Cuáles son las objeciones o dudas comunes de los clientes potenciales?", step12_p: "Ej: \"Es demasiado caro\", \"No tengo suficiente tiempo.\"",
    step13_h2: "P13: Describe el escenario 'antes' y 'después' para tu cliente ideal.", step13_p: "¿Cuál es su estado antes de tu servicio y cuál es su estado transformado después?",
    step14_h2: "P14: Describe a tu público objetivo en detalle.", step14_p: "Piensa en sus datos demográficos, intereses, valores y comportamiento en línea.",
    step15_h2: "P15: ¿Cuál es el impacto emocional que quieres tener en tu audiencia?", step15_p: "Ej: \"Inspirada y motivada\", \"Segura y empoderada.\"",
    step16_h2: "P16: ¿Cuál es la motivación principal detrás de por qué haces lo que haces?", step16_p: "Esto ayuda a construir una conexión auténtica.",
    step17_h2: "P17: ¿Cuáles son los mayores puntos de dolor de tu público objetivo?", step17_p: "¿Qué les quita el sueño por la noche?",
    step18_h2: "P18: ¿Cuáles son sus mayores aspiraciones o sueños?", step18_p: "¿Qué es lo que finalmente quieren lograr?",
    step19_h2: "P19: ¿Qué desafíos enfrentan para alcanzar esas aspiraciones?", step19_p: "¿Qué obstáculos se interponen en su camino?",
    step20_h2: "P20: ¿Cómo tu servicio cierra la brecha entre sus desafíos y aspiraciones?", step20_p: "Describe la transformación que proporcionas.",
    step21_h2: "P21: Describe la voz de tu marca.", step21_p: "Ej: \"Profesional y autoritaria\", \"Juguetona e ingeniosa\", \"Tranquila y empática.\"",
    step22_h2: "P22: Si tu marca fuera una persona, ¿qué tres palabras describirían su vibra?", step22_p: "Ej: \"Segura, accesible, sabia.\"",
    step23_h2: "P23: ¿Debería el contenido generado por IA dirigirse a ti o a tu empresa por su nombre?", step23_p: "",
    step24_h2: "P24: ¿Qué nombre se debe usar en el contenido?", step24_p: "Ej: \"Yo\", \"nosotros\", \"el equipo de [Tu Empresa]\", o tu nombre personal.",
    step25_h2: "P25: ¿Cuál es el objetivo principal de tu contenido?", step25_p: "Elige el objetivo principal para este plan de contenido.", step25_opt1: "Aumentar la Interacción", step25_opt2: "Generar Prospectos", step25_opt3: "Crear Conciencia de Marca", step25_opt4: "Impulsar las Ventas", step25_opt5: "Educar a la Audiencia", step25_opt6: "Construir una Comunidad",
    step26_h2: "P26: ¿Cómo quieres que se sienta tu audiencia después de consumir tu contenido?", step26_p: "Ej: \"Inspirada\", \"Informada\", \"Entretenida\", \"Comprendida.\"",
    step27_h2: "P27: ¿Cuál es tu llamada a la acción (CTA) principal?", step27_p: "¿Cuál es la acción principal que quieres que los usuarios realicen?", step27_opt1: "Visita nuestro sitio web", step27_opt2: "Agenda una consulta", step27_opt3: "Descarga nuestra guía", step27_opt4: "Suscríbete al boletín", step27_opt5: "Contáctanos", step27_opt6: "Saber más", step27_opt7: "Comenzar",
    step28_h2: "P28: Si elegiste 'Otro' para tu CTA, por favor especifícalo aquí.", step28_p: "(Opcional)",
    step29_h2: "P29: ¿En qué tipos de contenido deberíamos centrarnos?", step29_p: "Selecciona todo lo que aplique.", step29_opt1: "Educativo/Informativo", step29_opt2: "Promocional/Ventas", step29_opt3: "Detrás de cámaras", step29_opt4: "Historias de Clientes/Testimonios", step29_opt5: "Perspectivas de la Industria/Noticias", step29_opt6: "Consejos y Tutoriales", step29_opt7: "Actualizaciones de Producto/Servicio", select_all: "Seleccionar Todo", clear_all: "Limpiar Todo",
    step30_h2: "P30: ¿Hay algún tema, palabra o frase que se deba evitar absolutamente?", step30_p: "Ej: \"Evitar mencionar temas políticos\", \"No usar jerga de la industria como 'sinergia'.\"",
    step31_h2: "P31: ¿Qué estilos de interacción prefieres usar?", step31_p: "¿Cómo deberían las publicaciones fomentar la interacción? Selecciona todo lo que aplique.", step31_opt1: "Hacer preguntas directas", step31_opt2: "Realizar encuestas y sondeos", step31_opt3: "Usar fuertes llamadas a la acción", step31_opt4: "Iniciar debates", step31_opt5: "Fomentar el intercambio de experiencias", step31_opt6: "Dar consejos y sugerencias prácticas",
    step32_h2: "P32: ¿Cuál es el formato principal para el resultado?", step32_p: "¿Cómo debería estructurarse el contenido?", step32_opt1: "Publicaciones en Redes Sociales", step32_opt2: "Artículos de Blog", step32_opt3: "Boletín por Correo Electrónico", step32_opt4: "Guiones de Video", step32_opt5: "Temas de Podcast",
    step33_h2: "P33: ¿En qué plataformas vas a publicar?", step33_p: "Esto ayuda a adaptar la longitud y el estilo del contenido. Selecciona todo lo que aplique.",
    step34_h2: "P34: ¿Cuál es la duración deseada de este plan de contenido?", step34_p: "",
    step35_h2: "P35: ¿Cuándo debería comenzar el plan de contenido?", step35_p: "",
    step36_h2: "P36: ¿Tu negocio está vinculado a una ubicación específica?", step36_p: "Si es así, por favor especifica la ciudad, estado o país. (Opcional)",
    step37_h2: "P37: ¿Hay algún tipo específico de publicaciones que excluir?", step37_p: "Ej: \"No memes\", \"No publicaciones sobre la competencia.\"",
    step38_h2: "P38: Generemos algunos temas de contenido principales.", step38_p: "Basado en tus respuestas, sugeriremos algunos temas. Por favor, selecciona uno para desarrollar.", theme_loading: "🧠 Generando temas con IA...",
    step39_h2: "P39: Elige tus sub-temas semanales.", step39_p: "Selecciona cuatro sub-temas para el mes, o selecciona algunos y añade el tuyo.", subtheme_loading: "💡 Generando sub-temas...", step39_custom_label: "O, añade un sub-tema personalizado:"
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
this.applyLanguage(this.currentLang);
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
    this.currentLang = lang;
    const langData = translations[lang];
    if (!langData) return;

    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (langData[key] !== undefined) {
            el.textContent = langData[key];
        } else {
            // If a key is missing in the new language, keep the English text.
            el.textContent = translations['en'][key] || '';
        }
    });
}

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

    // --- ADDED SAFETY CHECK ---
    const type = response.headers.get('Content-Type') || '';
    if (!response.ok || !type.includes('application/json')) {
        console.error('Fetch for themes failed or returned non-JSON:', response.status, type);
        alert('Could not generate AI themes.');
        // Make sure to hide loading indicators in case of failure
        document.getElementById('themeLoading').style.display = 'none';
        document.getElementById('mainTheme').style.display = 'block'; // Show the select box again
        return;
    }
    // --- END OF SAFETY CHECK ---

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
