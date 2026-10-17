document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

/**
  * Uygulamayı başlatan ana asenkron fonksiyon.
  * JSON verilerini eşzamanlı çekerek ilgili DOM render fonksiyonlarına iletir.
  */
async function initApp() {
  try {
    const [generalInfoRes, categoriesRes] = await Promise.all([
      fetch('content/general-info.json'),
      fetch('content/categories.json')
    ]);

    if (!generalInfoRes.ok || !categoriesRes.ok) {
      throw new Error('İçerik verileri yüklenirken bir ağ hatası oluştu.');
    }

    const generalInfo = await generalInfoRes.json();
    const categories = await categoriesRes.json();

    // DOM İşleme Fonksiyonları
    renderHero(generalInfo);
    renderTravelTips(generalInfo.travel_tips);
    renderCategories(categories);

  } catch (error) {
    console.error('Sistem Mimarisi Hatası:', error);
    renderErrorState();
  }
}

/**
  * Hero başlık, rozet ve açıklama alanını render eder.
  */
function renderHero(data) {
  const badgeEl = document.getElementById('hero-badge');
  const titleEl = document.getElementById('hero-title');
  const descEl = document.getElementById('hero-description');

  if (badgeEl && data.badge) {
    badgeEl.innerHTML = `<i class="${data.badge_icon}"></i> ${data.badge}`;
  }
  if (titleEl && data.title) {
    titleEl.textContent = data.title;
  }
  if (descEl && data.description) {
    descEl.textContent = data.description;
  }
}

/**
  * Genel rehberlik ve seyahat ipuçları kartlarını render eder.
  */
function renderTravelTips(tips) {
  const container = document.getElementById('rehber');
  if (!container || !tips || !Array.isArray(tips)) return;

  container.innerHTML = tips.map(tip => `
    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors">
      <div>
        <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4 text-xl">
          <i class="${tip.icon}"></i>
        </div>
        <h3 class="font-bold text-slate-900 text-lg mb-2">${tip.title}</h3>
        <p class="text-slate-600 text-sm leading-relaxed">${tip.detail}</p>
      </div>
    </div>
  `).join('');
}

/**
  * Kategori ve destinasyon kartlarını dynamic grid olarak render eder.
  */
function renderCategories(categories) {
  const container = document.getElementById('categories-container');
  if (!container || !categories || !Array.isArray(categories)) return;

  container.innerHTML = categories.map(item => `
    <article class="destination-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between h-full">
      <div>
        <div class="relative h-64 w-full overflow-hidden bg-slate-100">
          <img 
            src="${item.image}" 
            alt="${item.title}" 
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            loading="lazy" 
            decoding="async"
          />
          <span class="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <i class="${item.badge_icon} text-emerald-400"></i> ${item.category_badge}
          </span>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-slate-900 mb-3">${item.title}</h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-6">${item.description}</p>
        </div>
      </div>
      <div class="p-6 pt-0">
        <a href="${item.target_url}" class="cta-affiliate-btn">
          <span>${item.button_text}</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </a>
      </div>
    </article>
  `).join('');
}

/**
  * Veri çekme hatası durumunda kullanıcıya gösterilecek uyarı.
  */
function renderErrorState() {
  const container = document.getElementById('categories-container');
  if (container) {
    container.innerHTML = `
      <div class="col-span-full p-8 text-center bg-red-50 border border-red-200 rounded-xl text-red-700">
        <i class="fa-solid fa-circle-exclamation text-3xl mb-2"></i>
        <p class="font-bold">İçerikler yüklenirken bir sorun oluştu.</p>
        <p class="text-sm mt-1">Lütfen bir yerel sunucu (Live Server vb.) üzerinden eriştiğinizden emin olun.</p>
      </div>
    `;
  }
}
