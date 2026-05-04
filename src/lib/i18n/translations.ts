export type Locale = "es" | "en";

export const translations = {
  // ─── Navbar ───
  navbar: {
    coaches: { es: "Coaches", en: "Coaches" },
    masterclass: { es: "Masterclass", en: "Masterclass" },
    howItWorks: { es: "Cómo funciona", en: "How it works" },
    testimonials: { es: "Testimonios", en: "Testimonials" },
    login: { es: "Iniciar sesión", en: "Log in" },
    findYourCoach: { es: "Encuentra tu coach", en: "Find your coach" },
    openMenu: { es: "Abrir menú", en: "Open menu" },
    soon: { es: "Pronto", en: "Soon" },
    viewAllGames: { es: "Ver todos los juegos", en: "View all games" },
  },

  // ─── Hero ───
  hero: {
    badge: { es: "Nuevo: Coaching de League of Legends disponible", en: "New: League of Legends Coaching available" },
    title1: { es: "Domina el juego.", en: "Master the game." },
    title2: { es: "Escala tu elo.", en: "Climb your elo." },
    subtitle: {
      es: "Entrena 1 a 1 con jugadores profesionales y ex-competidores. Coaching personalizado para subir de elo de verdad, no promesas vacías.",
      en: "Train 1-on-1 with professional players and former competitors. Personalized coaching to truly climb elo, no empty promises.",
    },
    cta: { es: "Encuentra tu coach", en: "Find your coach" },
  },

  // ─── Benefits ───
  benefits: {
    label: { es: "¿Por qué coaching?", en: "Why coaching?" },
    title1: { es: "Juega como un pro, ", en: "Play like a pro, " },
    title2: { es: "con un pro a tu lado", en: "with a pro by your side" },
    subtitle: {
      es: "Recibe un acompañamiento totalmente personalizado diseñado para tus necesidades específicas, tus debilidades y tus metas. No es una guía genérica; es un plan de entrenamiento hecho a medida para que subas de nivel.",
      en: "Receive fully personalized guidance designed for your specific needs, weaknesses and goals. It's not a generic guide; it's a custom training plan made to level you up.",
    },
    card1Title: { es: "Aprende con los mejores", en: "Learn from the best" },
    card1Desc: {
      es: "Conecta con coaches verificados, expertos en tu rol, que te guiarán con métodos probados para elevar tu nivel de juego. Tu camino al éxito, respaldado por profesionales.",
      en: "Connect with verified coaches, experts in your role, who will guide you with proven methods to elevate your gameplay. Your path to success, backed by professionals.",
    },
    card2Title: { es: "Formatos flexibles", en: "Flexible formats" },
    card2Desc: {
      es: "Elige cómo quieres aprender: sesiones individuales para un enfoque total, o entrenamientos en dúo y equipo para mejorar la coordinación y sinergia con tus compañeros. Se adapta a tu forma de jugar.",
      en: "Choose how you want to learn: individual sessions for total focus, or duo and team training to improve coordination and synergy with your teammates. It adapts to your playstyle.",
    },
    card3Title: { es: "Elige con seguridad", en: "Choose with confidence" },
    card3Desc: {
      es: "Filtra por rango, especialidad y precio para encontrar al coach que encaje contigo sin sorpresas. Elige basándote en valoraciones reales y un sistema de reputación totalmente transparente.",
      en: "Filter by rank, specialty and price to find the coach that fits you with no surprises. Choose based on real reviews and a fully transparent reputation system.",
    },
  },

  // ─── HowItWorks ───
  howItWorks: {
    label: { es: "Así de simple", en: "That simple" },
    title1: { es: "De cero a coaching en ", en: "Zero to coaching in " },
    title2: { es: "menos de 2 minutos", en: "less than 2 minutes" },
    subtitle: {
      es: "Sin complicaciones. Encuentra al coach perfecto, reserva cuando te venga bien, y empieza a subir de nivel.",
      en: "No hassle. Find the perfect coach, book when it suits you, and start leveling up.",
    },
    step1Title: { es: "Elige tu videojuego", en: "Choose your game" },
    step1Desc: { es: "Empieza con League of Legends. Pronto más videojuegos.", en: "Start with League of Legends. More games coming soon." },
    step2Title: { es: "Encuentra tu coach", en: "Find your coach" },
    step2Desc: { es: "Aplica diferentes filtros y encuentra el coach que más se adapta a ti.", en: "Apply different filters and find the coach that best fits you." },
    step3Title: { es: "Reserva tu sesión", en: "Book your session" },
    step3Desc: { es: "Elige horario, tipo de coaching y duración.", en: "Choose time, coaching type and duration." },
    step4Title: { es: "Mejora tu rendimiento", en: "Improve your performance" },
    step4Desc: {
      es: "Sesiones de coaching adaptadas a tus metas, desde análisis de partidas hasta entrenamiento avanzado en tiempo real.",
      en: "Coaching sessions tailored to your goals, from match analysis to advanced real-time training.",
    },
  },

  // ─── FeaturedCoaches ───
  featuredCoaches: {
    label: { es: "Coaches destacados", en: "Featured Coaches" },
    title1: { es: "Los mejores, ", en: "The best, " },
    title2: { es: "a tu alcance", en: "within reach" },
    subtitle: {
      es: "Jugadores verificados y listos para ayudarte a alcanzar tu verdadero potencial.",
      en: "Verified players ready to help you reach your true potential.",
    },
    sessions: { es: "sesiones", en: "sessions" },
    perSession: { es: " /sesión", en: " /session" },
    checkPrice: { es: "Consultar precio", en: "Check price" },
    viewProfile: { es: "Ver perfil", en: "View profile" },
    viewAllCoaches: { es: "Ver todos los coaches →", en: "View all coaches →" },
  },

  // ─── Testimonials ───
  testimonials: {
    label: { es: "Testimonios", en: "Testimonials" },
    title1: { es: "No lo decimos nosotros, ", en: "We don't say it, " },
    title2: { es: "lo dicen ellos", en: "they do" },
    t1Text: {
      es: "De Oro IV a Platino I en 3 semanas. Mi coach me hizo ver errores de positioning que ni sabía que cometía. Cada partida ahora se siente diferente.",
      en: "From Gold IV to Platinum I in 3 weeks. My coach showed me positioning mistakes I didn't even know I was making. Every game feels different now.",
    },
    t1Meta: { es: "Mid main · 3 sesiones", en: "Mid main · 3 sessions" },
    t2Text: {
      es: "Llevaba 2 años estancado en Plata. En 5 sesiones de jungle pathing subí a Oro III. Lo mejor es que ahora entiendo POR QUÉ hago lo que hago.",
      en: "I was stuck in Silver for 2 years. In 5 jungle pathing sessions I climbed to Gold III. The best part is now I understand WHY I do what I do.",
    },
    t2Meta: { es: "Jungle main · 5 sesiones", en: "Jungle main · 5 sessions" },
    t3Text: {
      es: "No es solo mejorar mecánicamente. Mi coach me enseñó a leer el mapa, a trackear al jungler enemigo y a tomar decisiones macro. El elo vino solo.",
      en: "It's not just about improving mechanically. My coach taught me to read the map, track the enemy jungler and make macro decisions. The elo came naturally.",
    },
    t3Meta: { es: "Top main · 8 sesiones", en: "Top main · 8 sessions" },
  },

  // ─── FAQ ───
  faq: {
    label: { es: "Preguntas frecuentes", en: "Frequently asked questions" },
    title1: { es: "Resolvemos tus ", en: "We answer your " },
    title2: { es: "dudas", en: "questions" },
    subtitle: {
      es: "Todo lo que necesitas saber antes de empezar a mejorar tu juego con un coach profesional.",
      en: "Everything you need to know before you start improving your game with a professional coach.",
    },
    q1: { es: "¿Es legal contratar un coach de videojuegos?", en: "Is hiring a gaming coach legal?" },
    a1: {
      es: "Sí, al 100%. El coaching de videojuegos es completamente legal y está reconocido por la industria. No modificamos archivos del juego, no usamos hacks ni scripts. Nuestros coaches te enseñan a mejorar tus habilidades y tu comprensión del juego, exactamente igual que un entrenador de cualquier otro deporte. Empresas como Riot Games fomentan activamente el coaching como parte del ecosistema competitivo.",
      en: "Yes, 100%. Gaming coaching is completely legal and recognized by the industry. We don't modify game files, we don't use hacks or scripts. Our coaches teach you to improve your skills and understanding of the game, just like a coach in any other sport. Companies like Riot Games actively encourage coaching as part of the competitive ecosystem.",
    },
    q2: { es: "¿Qué pasa si el coach no me convence?", en: "What if the coach doesn't convince me?" },
    a2: {
      es: "Cada coach tiene un perfil público con valoraciones reales de otros alumnos, así que puedes tomar una decisión informada antes de reservar. Si tras tu sesión sientes que la experiencia no fue la esperada, puedes dejar tu valoración honesta para ayudar a otros jugadores. Nuestro sistema de reputación incentiva a los coaches a dar siempre lo mejor de sí mismos, y aquellos con valoraciones bajas dejan de ser recomendados.",
      en: "Every coach has a public profile with real reviews from other students, so you can make an informed decision before booking. If after your session you feel the experience wasn't as expected, you can leave an honest review to help other players. Our reputation system incentivizes coaches to always give their best, and those with low ratings stop being recommended.",
    },
    q3: { es: "¿Cómo sé qué coach es el adecuado para mi nivel?", en: "How do I know which coach is right for my level?" },
    a3: {
      es: "Cada coach tiene un perfil detallado con su rango, roles que domina, especialidades y campeones favoritos. Puedes filtrar por rol, rango y especialidad para encontrar al coach perfecto para ti. Tenemos coaches especializados en todos los niveles: desde iniciación para jugadores que quieren salir de Iron/Bronce, hasta nivel semiprofesional para jugadores Diamond+ que buscan llegar a Challenger. Lee las reviews de otros alumnos con niveles similares al tuyo para elegir mejor.",
      en: "Every coach has a detailed profile with their rank, roles they master, specialties and favorite champions. You can filter by role, rank and specialty to find the perfect coach for you. We have coaches specialized at all levels: from beginner for players looking to escape Iron/Bronze, to semi-professional level for Diamond+ players aiming for Challenger. Read reviews from students at similar levels to make a better choice.",
    },
    q4: { es: "¿Cómo funciona el precio? ¿Hay comisiones ocultas?", en: "How does pricing work? Are there hidden fees?" },
    a4: {
      es: "Total transparencia. El precio que ves en el perfil del coach es lo que él cobra por la sesión. Al reservar, se añade una pequeña comisión de plataforma (5%) que cubre los costes de infraestructura, pasarela de pago y soporte. Verás el desglose completo antes de pagar: precio del coach + comisión = total. Sin sorpresas, sin letra pequeña.",
      en: "Total transparency. The price you see on the coach's profile is what they charge per session. When booking, a small platform fee (5%) is added to cover infrastructure, payment gateway and support costs. You'll see the full breakdown before paying: coach price + fee = total. No surprises, no fine print.",
    },
    q5: { es: "¿Qué incluye una sesión de coaching?", en: "What does a coaching session include?" },
    a5: {
      es: "Depende del tipo de sesión que reserves. En una sesión de Coaching en Vivo, el coach te observa jugar en tiempo real y te da feedback instantáneo. En un VOD Review, el coach analiza una partida grabada tuya y te explica errores y mejoras con calma. Todas las sesiones se realizan a través de nuestra plataforma con videollamada integrada, y muchos coaches comparten materiales adicionales tras la sesión.",
      en: "It depends on the type of session you book. In a Live Coaching session, the coach watches you play in real time and gives instant feedback. In a VOD Review, the coach analyzes a recorded game of yours and calmly explains mistakes and improvements. All sessions take place through our platform with integrated video calls, and many coaches share additional materials after the session.",
    },
    q6: { es: "¿Puedo cancelar o reprogramar una sesión?", en: "Can I cancel or reschedule a session?" },
    a6: {
      es: "Sí. Puedes cancelar o reprogramar tu sesión desde tu panel de control antes de que comience. Entendemos que los imprevistos existen, y queremos que tu experiencia sea lo más flexible posible.",
      en: "Yes. You can cancel or reschedule your session from your dashboard before it starts. We understand that unexpected things happen, and we want your experience to be as flexible as possible.",
    },
    q7: { es: "¿Los coaches son verificados?", en: "Are the coaches verified?" },
    a7: {
      es: "Sí. Todos nuestros coaches pasan por un proceso de verificación donde comprobamos su rango, experiencia y credenciales. Los coaches con el badge de verificado (✓) han demostrado su identidad y rango de forma verificable. Además, nuestro sistema de valoraciones por alumnos reales garantiza que solo los mejores coaches se mantienen activos en la plataforma.",
      en: "Yes. All our coaches go through a verification process where we check their rank, experience and credentials. Coaches with the verified badge (✓) have proven their identity and rank in a verifiable way. Additionally, our rating system by real students ensures that only the best coaches remain active on the platform.",
    },
  },

  // ─── CTASection ───
  cta: {
    title1: { es: "Tu siguiente victoria ", en: "Your next victory " },
    title2: { es: "empieza aquí", en: "starts here" },
    subtitle: {
      es: "Del rango Hierro al Challenger, cada nivel exige una nueva estrategia. No dejes tu progresión al azar: domina el juego y marca la diferencia en cada partida.",
      en: "From Iron to Challenger, every level demands a new strategy. Don't leave your progression to chance: master the game and make a difference in every match.",
    },
    button: { es: "Encuentra tu coach →", en: "Find your coach →" },
    note: {
      es: "Sin suscripciones · Paga solo por sesión · Cancela cuando quieras",
      en: "No subscriptions · Pay per session only · Cancel anytime",
    },
  },

  // ─── Footer ───
  footer: {
    brandDescription: {
      es: "La plataforma de coaching gaming donde los mejores jugadores profesionales te ayudan a alcanzar tu verdadero potencial competitivo.",
      en: "The gaming coaching platform where the best professional players help you reach your true competitive potential.",
    },
    games: { es: "Juegos", en: "Games" },
    valorantSoon: { es: "Valorant (pronto)", en: "Valorant (coming soon)" },
    tftSoon: { es: "TFT (pronto)", en: "TFT (coming soon)" },
    viewAll: { es: "Ver todos", en: "View all" },
    platform: { es: "Plataforma", en: "Platform" },
    howItWorks: { es: "Cómo funciona", en: "How it works" },
    coaches: { es: "Coaches", en: "Coaches" },
    becomeCoach: { es: "Hazte coach", en: "Become a coach" },
    masterclass: { es: "Masterclass", en: "Masterclass" },
    contact: { es: "Contacto", en: "Contact" },
    allRights: { es: "Todos los derechos reservados.", en: "All rights reserved." },
    terms: { es: "Términos de servicio", en: "Terms of service" },
    privacy: { es: "Política de privacidad", en: "Privacy policy" },
    cookies: { es: "Cookies", en: "Cookies" },
  },

  // ─── CoachFilters ───
  coachFilters: {
    lineRole: { es: "Línea / Rol", en: "Lane / Role" },
    rank: { es: "Rango", en: "Rank" },
    specialty: { es: "Especialidad", en: "Specialty" },
    clearFilters: { es: "Limpiar filtros", en: "Clear filters" },
    coachFound: { es: "coach encontrado", en: "coach found" },
    coachesFound: { es: "coaches encontrados", en: "coaches found" },
    bestRated: { es: "Mejor valorados", en: "Best rated" },
    mostSessions: { es: "Más sesiones", en: "Most sessions" },
    priceLowHigh: { es: "Precio: menor a mayor", en: "Price: low to high" },
    priceHighLow: { es: "Precio: mayor a menor", en: "Price: high to low" },
    noResults: { es: "No hay coaches con esos filtros. Prueba con otros criterios.", en: "No coaches match those filters. Try different criteria." },
    sessions: { es: "sesiones", en: "sessions" },
    from: { es: " desde", en: " from" },
    viewProfile: { es: "Ver perfil", en: "View profile" },
  },

  // ─── Login ───
  login: {
    title: { es: "Inicia sesión", en: "Log in" },
    subtitle: { es: "Accede para reservar sesiones de coaching y ver tu historial.", en: "Sign in to book coaching sessions and view your history." },
    google: { es: "Continuar con Google", en: "Continue with Google" },
    orEmail: { es: "o con email", en: "or with email" },
    email: { es: "Email", en: "Email" },
    password: { es: "Contraseña", en: "Password" },
    submitting: { es: "Entrando...", en: "Signing in..." },
    submit: { es: "Iniciar sesión", en: "Log in" },
    forgot: { es: "¿Olvidaste tu contraseña?", en: "Forgot your password?" },
    createAccount: { es: "Crear cuenta", en: "Create account" },
    legal: { es: "Al iniciar sesión, aceptas nuestros ", en: "By logging in, you accept our " },
    termsLink: { es: "Términos de Servicio", en: "Terms of Service" },
    and: { es: " y ", en: " and " },
    privacyLink: { es: "Política de Privacidad", en: "Privacy Policy" },
    errNotFound: { es: "No existe una cuenta con este email.", en: "No account exists with this email." },
    errWrongPassword: { es: "Email o contraseña incorrectos.", en: "Incorrect email or password." },
    errInvalidEmail: { es: "Email no válido.", en: "Invalid email." },
    errTooMany: { es: "Demasiados intentos. Espera unos minutos.", en: "Too many attempts. Wait a few minutes." },
    errDefault: { es: "Error al iniciar sesión. Inténtalo de nuevo.", en: "Login error. Please try again." },
  },

  // ─── Register ───
  register: {
    title: { es: "Crear cuenta", en: "Create account" },
    subtitle: { es: "Regístrate para reservar sesiones con los mejores coaches.", en: "Sign up to book sessions with the best coaches." },
    google: { es: "Registrarse con Google", en: "Sign up with Google" },
    orEmail: { es: "o con email", en: "or with email" },
    username: { es: "Nombre de usuario", en: "Username" },
    passwordMin: { es: "Contraseña (min. 6 caracteres)", en: "Password (min. 6 characters)" },
    confirmPassword: { es: "Confirmar contraseña", en: "Confirm password" },
    submitting: { es: "Creando cuenta...", en: "Creating account..." },
    submit: { es: "Crear cuenta", en: "Create account" },
    hasAccount: { es: "¿Ya tienes cuenta?", en: "Already have an account?" },
    loginLink: { es: "Iniciar sesión", en: "Log in" },
    wantCoach: { es: "¿Quieres ser coach?", en: "Want to be a coach?" },
    coachRegister: { es: "🏆 Registrarse como coach", en: "🏆 Register as a coach" },
    legal: { es: "Al registrarte, aceptas nuestros ", en: "By registering, you accept our " },
    errPasswordMatch: { es: "Las contraseñas no coinciden.", en: "Passwords don't match." },
    errPasswordLength: { es: "La contraseña debe tener al menos 6 caracteres.", en: "Password must be at least 6 characters." },
    errName: { es: "Introduce tu nombre.", en: "Enter your name." },
    errEmailInUse: { es: "Ya existe una cuenta con este email.", en: "An account already exists with this email." },
    errInvalidEmail: { es: "Email no válido.", en: "Invalid email." },
    errWeakPassword: { es: "La contraseña es demasiado débil. Usa al menos 6 caracteres.", en: "Password is too weak. Use at least 6 characters." },
    errDefault: { es: "Error al crear la cuenta. Inténtalo de nuevo.", en: "Error creating account. Please try again." },
  },

  // ─── Forgot Password ───
  forgotPassword: {
    title: { es: "Recuperar contraseña", en: "Reset password" },
    subtitle: { es: "Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.", en: "Enter your email and we'll send you a link to reset your password." },
    emailPlaceholder: { es: "Email de tu cuenta", en: "Your account email" },
    submitting: { es: "Enviando...", en: "Sending..." },
    submit: { es: "Enviar enlace de recuperación", en: "Send recovery link" },
    success: { es: "✅ Email enviado. Revisa tu bandeja de entrada (y la carpeta de spam) para restablecer tu contraseña.", en: "✅ Email sent. Check your inbox (and spam folder) to reset your password." },
    back: { es: "← Volver a iniciar sesión", en: "← Back to login" },
    errNotFound: { es: "No existe una cuenta con este email.", en: "No account exists with this email." },
    errInvalidEmail: { es: "Email no válido.", en: "Invalid email." },
    errTooMany: { es: "Demasiados intentos. Espera unos minutos.", en: "Too many attempts. Wait a few minutes." },
    errDefault: { es: "Error al enviar el email. Inténtalo de nuevo.", en: "Error sending email. Please try again." },
  },

  // ─── MasterclassNotify ───
  masterclassNotify: {
    title: { es: "🔔 Avísame cuando haya una masterclass", en: "🔔 Notify me when there's a masterclass" },
    text: { es: "Déjanos tu nombre y email y te avisaremos en cuanto tengamos la primera masterclass lista.", en: "Leave us your name and email and we'll notify you as soon as the first masterclass is ready." },
    namePlaceholder: { es: "Tu nombre", en: "Your name" },
    emailPlaceholder: { es: "Tu email", en: "Your email" },
    submitting: { es: "Enviando...", en: "Sending..." },
    submit: { es: "Avísame", en: "Notify me" },
    successTitle: { es: "¡Te avisaremos!", en: "We'll notify you!" },
    successText: { es: "Cuando lancemos la primera masterclass, serás el primero en enterarte.", en: "When we launch the first masterclass, you'll be the first to know." },
    error: { es: "Ha ocurrido un error. Inténtalo de nuevo.", en: "An error occurred. Please try again." },
  },

  // ─── CoachRequestCTA ───
  coachRequestCTA: {
    title: { es: "¿Buscas algo más?", en: "Looking for something else?" },
    text: { es: "Apúntate a nuestra lista de novedades y te avisaremos en cuanto incorporemos nuevos coaches. ¡Sé el primero en elegir!", en: "Sign up for our updates list and we'll notify you when we add new coaches. Be the first to choose!" },
    button: { es: "Quiero que me aviséis", en: "Notify me" },
    namePlaceholder: { es: "Tu nombre", en: "Your name" },
    emailPlaceholder: { es: "Tu email", en: "Your email" },
    roleLabel: { es: "¿Qué tipo de coach buscas?", en: "What type of coach are you looking for?" },
    specLabel: { es: "Especificaciones (opcional)", en: "Specifications (optional)" },
    specPlaceholder: { es: "¿Hay algo específico que busques? Rango, idioma, horarios...", en: "Anything specific? Rank, language, schedule..." },
    submitting: { es: "Enviando...", en: "Sending..." },
    submit: { es: "Enviar solicitud", en: "Send request" },
    successTitle: { es: "¡Solicitud enviada!", en: "Request sent!" },
    successText: { es: "Te avisaremos en cuanto incorporemos nuevos coaches que encajen con lo que buscas. ¡Sé el primero en elegir!", en: "We'll notify you as soon as we add new coaches that match what you're looking for. Be the first to choose!" },
    error: { es: "Ha ocurrido un error. Inténtalo de nuevo.", en: "An error occurred. Please try again." },
  },

  // ─── Games Page ───
  gamesPage: {
    title: { es: "Elige tu juego", en: "Choose your game" },
    subtitle: { es: "Selecciona el juego en el que quieres mejorar y encuentra al coach perfecto para ti.", en: "Select the game you want to improve at and find the perfect coach for you." },
    findCoaches: { es: "Encuentra coaches profesionales", en: "Find professional coaches" },
    viewCoaches: { es: "Ver coaches →", en: "View coaches →" },
    comingSoon: { es: "Próximamente", en: "Coming soon" },
  },

  // ─── Masterclass Page ───
  masterclassPage: {
    badge: { es: "🎓 Aprende de los mejores", en: "🎓 Learn from the best" },
    subtitle: { es: "Sesiones en vivo con coaches profesionales sobre temas específicos del juego. Aprende wave management, jungle pathing, macro de equipo y mucho más.", en: "Live sessions with professional coaches on specific game topics. Learn wave management, jungle pathing, team macro and much more." },
    comingSoonTitle: { es: "Próximamente", en: "Coming soon" },
    comingSoonText: { es: "Estamos preparando masterclasses increíbles con los mejores coaches de la plataforma. Sesiones en vivo donde podrás aprender temas avanzados como:", en: "We're preparing incredible masterclasses with the best coaches on the platform. Live sessions where you can learn advanced topics like:" },
    topic1Title: { es: "Wave Management Avanzado", en: "Advanced Wave Management" },
    topic1Desc: { es: "Domina las olas como un pro", en: "Master waves like a pro" },
    topic2Title: { es: "Macro de Equipo", en: "Team Macro" },
    topic2Desc: { es: "Rotaciones y objetivos coordinados", en: "Coordinated rotations and objectives" },
    topic3Title: { es: "Jungle Pathing Óptimo", en: "Optimal Jungle Pathing" },
    topic3Desc: { es: "Rutas eficientes para cada situación", en: "Efficient routes for every situation" },
    topic4Title: { es: "Trading en Lane", en: "Lane Trading" },
    topic4Desc: { es: "Gana todos los intercambios", en: "Win every trade" },
    topic5Title: { es: "Control de Visión", en: "Vision Control" },
    topic5Desc: { es: "Wardea como un profesional", en: "Ward like a professional" },
    topic6Title: { es: "Mentalidad Competitiva", en: "Competitive Mindset" },
    topic6Desc: { es: "Gestiona el tilt y mejora tu foco", en: "Manage tilt and improve your focus" },
    slots: { es: "plazas", en: "slots" },
    bookSlot: { es: "Reservar plaza", en: "Book a slot" },
  },

  // ─── Language selector ───
  langSelector: {
    es: { es: "ES", en: "ES" },
    en: { es: "EN", en: "EN" },
  },
} as const;

export type TranslationKeys = typeof translations;
