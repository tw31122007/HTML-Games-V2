import Constants from './constants.js'

export let lang = undefined

export const SUPPORTED_LANGUAGES = {
    'en': 'ENGLISH',
    'es': 'ESPAÑOL',
    'it': 'ITALIANO',
    'de': 'DEUTSCH',
    'pt': 'PORTUGUÊS',
}

updateLanguage(localStorage.getItem('lang') || navigator.language)

export function fontFolder() {
    return {
        en: 'europe',
        es: 'europe',
        it: 'europe',
        de: 'europe',
        pt: 'europe',
        fr: 'europe',
        ru: 'russia'
    }[lang]
}

export function updateLanguage(langKey) {
    let found = false
    for (const supportedLang in SUPPORTED_LANGUAGES) {
        if (langKey.toLowerCase().includes(supportedLang)) {
            lang = supportedLang
            found = true
        }
    }
    if (!found) {
        lang = 'en'
    }
    localStorage.setItem('lang', lang)
}

export function getText(checkString) {
    if (checkString in GAME_TEXT && lang in GAME_TEXT[checkString])
        return GAME_TEXT[checkString][lang]
    return checkString
}

const GAME_TEXT = {
    title: {
        en: 'THE GAME ABOUT THE MAD YEAR 2020',
        es: 'EL JUEGO DEL 2020, UN AÑO DE LOCOS',
        it: 'IL GIOCO DEL PAZZO ANNO 2020',
        de: 'EIN SPIEL ÜBER DAS VERRÜCKTE JAHR 2020',
        pt: 'O JOGO SOBRE O ANO LOUCO DE 2020',
    },
    description: {
        en: 'PLAY THROUGH ALL THE MAJOR EVENTS OF 2020: THE AUSTRALIA WILDFIRES, COVID-19, THE STOCK MARKET CRASH, QUARANTINE, THE RISE OF TIKTOK, THE USA ELECTIONS, ETC.',
        es: 'JUEGA A TRAVÉS DE LOS MAYORES ACONTECIMIENTOS DEL 2020: LOS INCENDIOS DE AUSTRALIA, LA COVID-19, EL COLAPSO DEL MERCADO DE VALORES, LA CUARENTENA, EL AUGE DE TIKTOK, LAS ELECCIONES EN EEUU, ETC.',
        it: "RIVIVI GLI EVENTI DEL 2020: GLI INCENDI BOSCHIVI IN AUSTRALIA, IL COVID-19, IL CROLLO DEI MERCATI, LA QUARANTENA, L'ASCESA DI TIKTOK, LE ELEZIONI USA ECC.",
        de: 'SPIELE DICH DURCH ALLE WICHTIGEN EREIGNISSE AUS 2020: DIE AUSTRALISCHEN WALDBRÄNDE, COVID-19, DER BÖRSENCRASH, QUARANTÄNE, DER AUFSTIEG VON TIKTOK, DIE US-PRÄSIDENTSCHAFTSWAHL, U.V.M.',
        pt: 'JOGUE ATRAVÉS DOS PRINCIPAIS EVENTOS DE 2020: OS INCÊNDIOS NA AUSTRÁLIA, A COVID-19, A QUEDA DO MERCADO DE AÇÕES, A QUARENTENA, O CRESCIMENTO DO TIKTOK, AS ELEIÇÕES NOS EUA, ETC.',
    },
    shareText: {
        en: 'SHARE WITH FRIENDS',
        es: 'COMPÁRTELO CON AMIGOS',
        it: 'CONDIVIDI CON I TUOI AMICI',
        de: 'MIT FREUNDEN TEILEN',
        pt: 'PARTILHE COM AMIGOS',
    },
    emailMe: {
        en: 'EMAIL ME',
        es: 'ESCRÍBEME',
        it: 'SCRIVIMI',
        de: 'E-MAIL AN MICH',
        pt: 'ENVIE-ME UM E-MAIL',
    },
    pressKit: {
        en: 'PRESS KIT',
        es: 'KIT DE PRENSA',
        it: 'PRESS KIT',
        de: 'PRESS KIT',
        pt: 'PRESS KIT',
    },
    warningRotate: {
        en: 'PLEASE ROTATE YOUR DEVICE',
        es: 'POR FAVOR, GIRA LA PANTALLA',
        it: 'RUOTA IL DISPOSITIVO',
        de: 'BITTE DREHE DEIN GERÄT',
        pt: 'POR FAVOR, RODE O SEU DISPOSITIVO',
    },
    loading: {
        en: 'LOADING',
        es: 'CARGANDO',
        it: 'CARICAMENTO',
        de: 'LÄDT',
        pt: 'A CARREGAR',
    },
    warningDesktop: {
        en: 'FOR BEST EXPERIENCE PLAY ON DESKTOP',
        es: 'PARA UNA MEJOR EXPERIENCIA, JUEGA CON TU ORDENADOR',
        it: 'GIOCA DA PC PER UNA MIGLIORE ESPERIENZA DI GIOCO',
        de: 'FÜR DIE BESTE ERFAHRUNG AUF DEM PC SPIELEN',
        pt: 'PARA UMA MELHOR EXPERIÊNCIA, JOGUE NO COMPUTADOR',
    },
    tutorial1: {
        en: 'PRESS ARROW KEYS',
        es: 'USA LAS FLECHAS PARA',
        it: 'PREMI I TASTI FRECCIA PER',
        de: 'PFEILTASTEN DRÜCKEN ZUM',
        pt: 'CARREGUE NAS SETAS',
    },
    tutorial2: {
        en: 'TO RUN AND JUMP',
        es: 'CORRER Y SALTAR',
        it: 'CORRERE E SALTARE',
        de: 'RENNEN UND SPRINGEN',
        pt: 'PARA CORRER E SALTAR',
    },
    gameOver: {
        en: 'GAME OVER',
        es: 'GAME OVER',
        it: 'GAME OVER',
        de: 'GAME OVER',
        pt: 'GAME OVER',
    },
    checkpoint: {
        en: 'START FROM CHECKPOINT',
        es: 'EMPIEZA DESDE EL PUNTO DE CONTROL',
        it: 'CARICA ULTIMO CHECKPOINT',
        de: 'LETZTEN SPEICHERPUNKT LADEN?',
        pt: 'COMECE DO ÚLTIMO CHECKPOINT',
    },
    australia: {
        en: 'AUSTRALIA',
        es: 'AUSTRALIA',
        it: 'AUSTRALIA',
        de: 'AUSTRALIEN',
        pt: 'AUSTRÁLIA',
    },
    survive: {
        en: 'SURVIVE!',
        es: '¡SOBREVIVE!',
        it: 'SOPRAVVIVI!',
        de: 'ÜBERLEBE!',
        pt: 'SOBREVIVA!',
    },
    stockMarketCrash1: {
        en: 'STOCK MARKET CRASH',
        es: 'COLAPSO DEL MERCADO',
        it: 'CROLLO DEI MERCATI',
        de: 'BÖRSENCRASH',
        pt: 'QUEDA DO MERCADO',
    },
    stockMarketCrash2: {
        en: '',
        es: 'DE VALORES',
        it: '',
        de: '',
        pt: 'DE AÇÕES',
    },
    quarantine: {
        en: 'QUARANTINE',
        es: 'CUARENTENA',
        it: 'QUARANTENA',
        de: 'QUARANTÄNE',
        pt: 'QUARENTENA',
    },
    natureClearing1: {
        en: 'LOCKDOWNS CLEAR NATURE',
        es: 'LA NATURALEZA RECUPERA',
        it: 'IL LOCKDOWN SALVA',
        de: 'LOCKDOWNS HELFEN',
        pt: 'CONFINAMENTO LIMPA',
    },
    natureClearing2: {
        en: '',
        es: 'LO QUE ES SUYO',
        it: "L'AMBIENTE",
        de: 'DER NATUR',
        pt: 'A NATUREZA',
    },
    zoom1: {
        en: 'ZOOM CALL',
        es: 'LLAMADA DE ZOOM',
        it: 'CALL SU ZOOM',
        de: 'ZOOM CALL',
        pt: 'CHAMADA ZOOM',
    },
    zoom2_1: {
        en: 'YOU ARE',
        es: 'ESTÁS',
        it: 'MICROFONO',
        de: 'DU BIST STUMM',
        pt: 'VOCÊ ESTÁ',
    },
    zoom2_2: {
        en: 'ON MUTE',
        es: 'SILENCIADO',
        it: 'DISATTIVATO',
        de: 'GESCHALTET',
        pt: 'SEM SOM',
    },
    zoom3_1: {
        en: 'CAN YOU SEE',
        es: '¿VES MI',
        it: 'VEDI IL MIO',
        de: 'KANNST DU MEINEN',
        pt: 'VEEM O',
    },
    zoom3_2: {
        en: 'MY SCREEN?',
        es: 'PANTALLA?',
        it: 'SCHERMO?',
        de: 'BILDSCHIRM SEHEN?',
        pt: 'MEU ECRÃ?',
    },
    zoom4_1: {
        en: 'YOUR CONNECTION',
        es: 'SU CONEXIÓN',
        it: 'CONNESSIONE',
        de: 'DEINE VERBINDUNG',
        pt: 'A LIGAÇÃO',
    },
    zoom4_2: {
        en: 'IS BAD',
        es: 'ES INESTABLE',
        it: 'DEBOLE',
        de: 'IST SCHLECHT',
        pt: 'ESTÁ MÁ',
    },
    zoom5_1: {
        en: 'SORRY FOR THE',
        es: 'PERDÓN POR EL',
        it: 'SCUSA PER IL RUMORE',
        de: 'SORRY FÜR DIE',
        pt: 'DESCULPEM O',
    },
    zoom5_2: {
        en: 'BACKGROUND NOISE',
        es: 'RUIDO DE FONDO',
        it: 'DI SOTTOFONDO',
        de: 'GERÄUSCHE',
        pt: 'BARULHO DE FUNDO',
    },
    zoom6_1: {
        en: 'CAN YOU',
        es: '¿SE ME',
        it: 'MI',
        de: 'KANNST DU',
        pt: 'CONSEGUEM',
    },
    zoom6_2: {
        en: 'HEAR ME?',
        es: 'ESCUCHA?',
        it: 'SENTITE?',
        de: 'MICH HÖREN?',
        pt: 'OUVIR?',
    },
    zoom7_1: {
        en: 'YOU ARE',
        es: 'SE ESTÁ',
        it: 'TI VEDO',
        de: 'DIE VERBINDUNG',
        pt: 'NÃO O',
    },
    zoom7_2: {
        en: 'BREAKING UP',
        es: 'CORTANDO',
        it: 'A SCATTI',
        de: 'BRICHT AB',
        pt: 'OUVIMOS BEM',
    },
    zoom8_1: {
        en: 'CAN YOU',
        es: '¿LO PUEDES',
        it: 'PUOI',
        de: 'KANNST DU ES',
        pt: 'PODE',
    },
    zoom8_2: {
        en: 'REPEAT?',
        es: 'REPETIR?',
        it: 'RIPETERE?',
        de: 'WIEDERHOLEN?',
        pt: 'REPETIR?',
    },
    zoom9: {
        en: 'STAY SAFE',
        es: 'CUÍDATE',
        it: 'IO RESTO A CASA',
        de: 'PASS AUF DICH AUF',
        pt: 'FIQUE SEGURO',
    },
    floods: {
        en: 'FLOODS',
        es: 'INUNDACIONES',
        it: 'INONDAZIONI',
        de: 'ÜBERFLUTUNGEN',
        pt: 'INUNDAÇÕES',
    },
    usaElections: {
        en: 'USA ELECTIONS',
        es: 'ELECCIONES EN EEUU',
        it: 'ELEZIONI USA',
        de: 'US-PRÄSIDENTSCHAFTSWAHL',
        pt: 'ELEIÇÕES NOS EUA',
    },
    covidSecondWave: {
        en: 'COVID SECOND WAVE',
        es: 'SEGUNDA OLA DE COVID',
        it: 'SECONDA ONDATA DI COVID',
        de: 'ZWEITE COVID-WELLE',
        pt: 'SEGUNDA VAGA DA COVID',
    },
    outroMessage1: {
        en: 'WOW...',
        es: 'VAYA...',
        it: 'WOW...',
        de: 'WOW...',
        pt: 'UAU...',
    },
    outroMessage2_1: {
        en: 'THAT WAS',
        es: 'NO HA SIDO',
        it: 'È STATA',
        de: 'DAS WAR',
        pt: 'ISTO FOI',
    },
    outroMessage2_2: {
        en: 'HARD',
        es: 'FÁCIL',
        it: 'DURA',
        de: 'HART',
        pt: 'DIFÍCIL',
    },
    outroMessage3_1: {
        en: "I'M SURE 2021 WILL",
        es: '¡SEGURO QUE 2021',
        it: 'IL 2021 SARÀ',
        de: 'ICH BIN SICHER, 2021',
        pt: '2021 SÓ PODE'
    },
    outroMessage3_2: {
        en: 'BE MUCH BETTER!',
        es: 'SERÁ MUCHO MEJOR!',
        it: 'MOLTO MEGLIO!',
        de: 'WIRD BESSER SEIN!',
        pt: 'SER MUITO MELHOR!',
    },
    winTitle1: {
        en: 'THANKS FOR PLAYING',
        es: '¡GRACIAS POR JUGAR',
        it: 'GRAZIE PER AVER GIOCATO',
        de: "DANKE FÜR'S SPIELEN",
        pt: 'OBRIGADO POR JOGAR',
    },
    winTitle2: {
        en: 'AND HAPPY 2021!',
        es: 'Y FELIZ 2021!',
        it: 'E BUON 2021!',
        de: 'UND EIN SCHÖNES 2021!',
        pt: 'E FELIZ 2021!',
    },
    winText1: {
        en: 'MY NAME IS MAX AND THIS IS MY FIRST GAME',
        es: 'ME LLAMO MAX Y ESTE ES MI PRIMER VIDEOJUEGO, TARDÉ SEIS',
        it: 'MI CHIAMO MAX E QUESTO È IL MIO PRIMO GIOCO CHE',
        de: 'ICH HEISSE MAX UND DIES IST MEIN ERSTES SPIEL, AN DEM ICH',
        pt: 'O MEU NOME É MAX E ESTE É O MEU PRIMEIRO JOGO, QUE DEMOREI',
    },
    winText2: {
        en: 'THAT I SPENT 6 MONTHS DEVELOPING ALONE. GAMES ARE',
        es: 'MESES EN DESARROLLARLO POR MI CUENTA. LOS VIDEOJUEGOS SON MI',
        it: 'HO PASSATO 6 MESI A SVILUPPARE DA SOLO. I VIDEOGIOCHI SONO',
        de: '6 MONATE LANG ALLEINE GEARBEITET HATTE. SPIELE SIND MEINE',
        pt: '6 MESES A DESENVOLVER SOZINHO. OS JOGOS SÃO A MINHA PAIXÃO',
    },
    winText3: {
        en: 'MY PASSION AND NOW I DREAM OF MAKING THEM FULL TIME.',
        es: 'PASIÓN, Y AHORA SUEÑO CON DEDICARME A ELLOS A TIEMPO COMPLETO. SI',
        it: 'LA MIA PASSIONE E ORA SOGNO DI REALIZZARLI A TEMPO PIENO.',
        de: 'LEIDENSCHAFT UND NUN TRÄUME ICH DAVON, SIE HAUPTBERUFLICH',
        pt: 'E O MEU SONHO É PODER CRIÁ-LOS A TEMPO INTEIRO. SE GOSTOU DO',
    },
    winText4: {
        en: 'IF YOU LIKED THE GAME, PLEASE CONSIDER DONATING,',
        es: 'TE HA GUSTADO EL JUEGO, POR FAVOR, CONSIDERA HACER UNA DONACIÓN',
        it: 'SE VI È PIACIUTO IL GIOCO, VI PREGO DI DONARE, COSÌ',
        de: 'ZU MACHEN. FALLS DIR DAS SPIEL GEFALLEN HAT, BITTE ICH UM',
        pt: 'JOGO, POR FAVOR CONSIDERE FAZER UMA DOAÇÃO, DE FORMA A QUE',
    },
    winText5: {
        en: 'SO I CAN FULLY DEVOTE MYSELF TO MAKING GAMES.',
        es: 'PARA QUE PUEDA DEDICARME ENTERAMENTE A CREAR VIDEOJUEGOS.',
        it: 'POSSO DEDICARMI COMPLETAMENTE A CREARE GIOCHI.',
        de: 'EINE SPENDE, DAMIT ICH MICH IHNEN VÖLLIG WIDMEN KANN.',
        pt: 'EU ME CONSIGA DEDICAR INTEIRAMENTE A CRIAR JOGOS.',
    },
    donateUrl: {
        en: 'https://donorbox.org/2020-game',
        es: 'https://donorbox.org/2020-game-es',
        it: 'https://donorbox.org/2020-game-it',
        de: 'https://donorbox.org/2020-game-de',
        pt: 'https://donorbox.org/2020-game-pt',
    }
}

export function getDonateImage() {
    return `${Constants.ASSETS_URL}/assets/buttons/donate/${lang}.png`
}

export function getQuarantineReadyImage() {
    return `${Constants.ASSETS_URL}/assets/level2/quarantine-ready/${lang}.png`
}
