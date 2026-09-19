// ========= VABEL: SCRIPT ÚNICO (sin errores) =========

// Año en footer (si existe)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// -------- Menú móvil --------
const btnMenu = document.getElementById("btnMenu");
const mobileMenu = document.getElementById("mobileMenu");
if (btnMenu && mobileMenu) {
  btnMenu.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
  mobileMenu.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => mobileMenu.classList.add("hidden"));
  });
}

// -------- Slider --------
let sliderIdx = 0;
const slides = [
  document.getElementById("slide1"),
  document.getElementById("slide2"),
  document.getElementById("slide3"),
].filter(Boolean);

function showSlide(i) {
  if (!slides.length) return;
  slides.forEach((s) => s.classList.remove("active"));
  slides[i].classList.add("active");
  sliderIdx = i;
}

window.nextSlide = function () {
  if (!slides.length) return;
  showSlide((sliderIdx + 1) % slides.length);
};

window.prevSlide = function () {
  if (!slides.length) return;
  showSlide((sliderIdx - 1 + slides.length) % slides.length);
};

if (slides.length) {
  setInterval(window.nextSlide, 4500);
}

// -------- Slider Servicios --------
let serviceSliderIdx = 0;
const serviceSlides = document.querySelectorAll(".service-slide");
const serviceDots = document.querySelectorAll(".service-dot");

window.showServiceSlide = function (i) {
  if (!serviceSlides.length) return;
  serviceSlides.forEach((s) => s.classList.remove("active"));
  serviceDots.forEach((d) => d.classList.remove("active"));

  serviceSlides[i].classList.add("active");
  if (serviceDots[i]) serviceDots[i].classList.add("active");
  serviceSliderIdx = i;
};

function nextServiceSlide() {
  if (!serviceSlides.length) return;
  window.showServiceSlide((serviceSliderIdx + 1) % serviceSlides.length);
}

if (serviceSlides.length) {
  setInterval(nextServiceSlide, 5000);
}

// -------- Navegacion entre paginas --------
// El sitio son paginas reales; aqui solo se marca el enlace de la actual
// y se atienden los enlaces antiguos con almohadilla.

const RUTAS = {
  inicio: "/",
  nosotros: "/nosotros",
  servicios: "/servicios",
  proyectos: "/proyectos",
  contacto: "/contacto",
};

// Enlaces como vabel.com.mx/#servicios, compartidos antes de separar las
// paginas, llevaban a la seccion correspondiente. Se respetan.
(function () {
  const destino = (location.hash || "").replace("#", "");
  if (destino && RUTAS[destino] && RUTAS[destino] !== location.pathname) {
    location.replace(RUTAS[destino]);
  }
})();

function marcarNavActiva() {
  const aqui = location.pathname.replace(/\/index\.html$/, "/").replace(/(.)\/$/, "$1");
  document.querySelectorAll('.nav-premium a, #mobileMenu a').forEach((a) => {
    const suyo = (a.getAttribute("href") || "").replace(/(.)\/$/, "$1");
    if (suyo === aqui || (aqui === "" && suyo === "/")) a.classList.add("active");
    else a.classList.remove("active");
  });
}
marcarNavActiva();

// -------- Formulario de contacto --------
  (function () {
    const form = document.getElementById('formContacto');
    if (!form) return;

    const estado = document.getElementById('fcEstado');
    const boton = document.getElementById('fcEnviar');
    const botonTexto = document.getElementById('fcEnviarTexto');
    const ES_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function avisar(tipo, texto) {
estado.textContent = texto;
estado.classList.remove('hidden');
const ok = tipo === 'ok';
estado.style.background = ok ? 'rgba(34,197,94,.18)' : 'rgba(248,113,113,.18)';
estado.style.border = '1px solid ' + (ok ? 'rgba(134,239,172,.55)' : 'rgba(252,165,165,.55)');
estado.style.color = '#fff';
    }

    form.addEventListener('submit', async (e) => {
e.preventDefault();

const obligatorios = [...form.querySelectorAll('[required]')];
obligatorios.forEach((c) => c.removeAttribute('aria-invalid'));
const faltantes = obligatorios.filter(
  (c) => !c.value.trim() || (c.type === 'email' && !ES_CORREO.test(c.value.trim()))
);

if (faltantes.length) {
  faltantes.forEach((c) => c.setAttribute('aria-invalid', 'true'));
  faltantes[0].focus();
  avisar('error', 'Revisa los campos marcados: faltan datos o el correo no es válido.');
  return;
}

// que el boton Responder del correo vaya a quien escribio, no a Formspree
const replyto = document.getElementById('fc-replyto');
if (replyto) replyto.value = form.correo.value.trim();

if (form.action.includes('TU_ID_DE_FORMSPREE')) {
  avisar('error', 'El formulario aún no está conectado. Escríbenos por WhatsApp mientras tanto.');
  console.warn('[VABEL] Falta poner el endpoint real de Formspree en el atributo action del formulario.');
  return;
}

boton.disabled = true;
botonTexto.textContent = 'Enviando...';

try {
  const r = await fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { Accept: 'application/json' },
  });
  if (r.ok) {
    form.reset();
    avisar('ok', 'Gracias. Recibimos tu mensaje y te respondemos a la brevedad.');
  } else {
    avisar('error', 'No pudimos enviar el mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.');
  }
} catch (err) {
  avisar('error', 'No pudimos enviar el mensaje. Revisa tu conexión o escríbenos por WhatsApp.');
} finally {
  boton.disabled = false;
  botonTexto.textContent = 'Enviar mensaje';
}
    });
  })();
