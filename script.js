// 1. Banco de Dados Simulado
// ==========================================
// 1. BANCO DE DADOS DOS PRODUTOS
// ==========================================
// Para adicionar um produto novo, basta copiar o molde no final da lista!

const produtos = [
    { 
        id: 1, 
        nome: "Tapete Redondo Azul Marinho", 
        categoria: "tapetes", 
        subcategoria: "redondos", 
        cor: "azul", 
        preco: 259.90, 
        img: "Imagem/tapete-laranja.jpeg" 
    },
    { 
        id: 2, 
        nome: "Bolsa Granny Square Rosa", 
        categoria: "bolsas", 
        subcategoria: "granny-squares", 
        cor: "rosa", 
        preco: 199.90, 
        img: "Imagem/bolsa-granny.jpeg" 
    },
    { 
        id: 3, 
        nome: "Conjunto de Crochê Laranja e Preto", 
        categoria: "tapetes", 
        subcategoria: "passadeiras", 
        cor: ["laranja", "preto"],
        preco: 250.00, 
        img: "Imagem/Passadeira-BeP.jpeg" 
    },
    { 
        id: 4, 
        nome: "Tapete Quadrado Encanto Branco", 
        categoria: "tapetes", 
        subcategoria: "quadrados", 
        cor: "branco", 
        preco: 279.90, 
        img: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
    },
    { 
        id: 5, 
        nome: "Bolsa Transversal Boho Bege", 
        categoria: "tapetes", 
        subcategoria: "quadrados", 
        cor: "bege", 
        preco: 189.90, 
        img: "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
    },
    { 
        id: 6, 
        nome: "Cachecol 2 Cores Inverno", 
        categoria: "cachecois", 
        subcategoria: "2-cores", 
        cor: "cinza", 
        preco: 160.00, 
        img: "https://images.unsplash.com/photo-1590736969955-71cc94801759?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
    },

    // 👇 COPIE O BLOCO ABAIXO E PREENCHA COM O SEU NOVO PRODUTO 👇
    /*
    { 
        id: 7, // ATENÇÃO: Coloque sempre o próximo número da lista!
        nome: "Nome da Sua Peça Nova", 
        categoria: "bolsas", // USE APENAS: "tapetes", "bolsas" ou "cachecois"
        subcategoria: "granny-squares", // VEJA A LISTA DE SUBCATEGORIAS ABAIXO
        cor: "rosa", // USE APENAS: "azul", "rosa", "bege", "cinza" ou "branco"
        preco: 150.00, // IMPORTANTE: Use PONTO (.) em vez de vírgula para os centavos
        img: "LINK_DA_FOTO_AQUI" 
    },
    */
];

let carrinho = [];
const formatCurrency = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. Carrossel
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // 3. Renderização
    const grid = document.getElementById('productGrid');
    const catalogTitle = document.querySelector('.products-header h2');
    const urlParams = new URLSearchParams(window.location.search);
    const subFilter = urlParams.get('sub'); 
    const mobileApplyFiltersBtn = document.getElementById('mobileApplyFiltersBtn');

    function renderProducts(lista) {
        grid.innerHTML = '';
        if(lista.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding: 40px; color: #666; font-size: 18px;">Nenhum produto encontrado. 🧶</p>';
            return;
        }

        lista.forEach(p => {
            const parcelas = (p.preco / 5).toFixed(2).replace('.', ',');
            grid.innerHTML += `
                <div class="product-card">
                    <div class="img-wrapper">
                        <div class="like-btn" onclick="toggleLike(this)"><i class="far fa-heart"></i></div>
                        <img src="${p.img}" alt="${p.nome}" style="cursor: zoom-in;" onclick="openImageModal('${p.img}')">
                        <button class="add-to-cart-btn" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> ADICIONAR AO CARRINHO</button>
                    </div>
                    <p class="category">${p.categoria.toUpperCase()}</p>
                    <h3>${p.nome}</h3>
                    <p class="price">${formatCurrency(p.preco)}</p>
                    <p class="installments">5x de R$ ${parcelas} sem juros</p>
                </div>
            `;
        });
    }

    if (subFilter) {
        const tituloFormatado = subFilter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        catalogTitle.innerText = `Resultados para: ${tituloFormatado}`;
        const filtrados = produtos.filter(p => p.subcategoria === subFilter);
        renderProducts(filtrados);
    } else {
        renderProducts(produtos);
    }

    // 4. Pesquisa e Filtros
    const checkboxes = document.querySelectorAll('.filter-cb');
    const priceRange = document.getElementById('priceRange');
    const priceLabel = document.getElementById('priceLabel');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    // Aciona a filtragem e a rolagem ao apertar "Enter" no teclado
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyFilters();
            
            // Dá um pequeno atraso de 100 milissegundos só para garantir
            // que os produtos foram filtrados antes de descer a tela
            setTimeout(() => {
                // Como o cabeçalho agora é fixo, precisamos descontar o tamanho dele na rolagem
                // O scrollIntoView desce até o limite, mas podemos deixar assim que já vai funcionar bem!
                document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
            }, 100);
            
            // Opcional: Tira o foco do teclado do celular após o enter
            searchInput.blur(); 
        }
    });

    function applyFilters() {
        catalogTitle.innerText = "Catálogo de Produtos";
        let termoPesquisa = searchInput.value.toLowerCase().trim();
        let categoriasSel = Array.from(checkboxes).filter(cb => cb.checked && cb.dataset.type === 'category').map(cb => cb.value);
        let coresSel = Array.from(checkboxes).filter(cb => cb.checked && cb.dataset.type === 'color').map(cb => cb.value);
        let maxPrice = parseFloat(priceRange.value);

        priceLabel.innerText = maxPrice;

        let filtrados = produtos.filter(p => {
            let buscaMatch = termoPesquisa === "" || p.nome.toLowerCase().includes(termoPesquisa) || p.categoria.toLowerCase().includes(termoPesquisa);
            let catMatch = categoriasSel.length === 0 || categoriasSel.includes(p.categoria);
            let precoMatch = p.preco <= maxPrice;
            
            // NOVA LÓGICA DE COR: Agora o site entende se a cor for uma palavra única ou uma lista com várias cores!
            let corMatch = coresSel.length === 0 || 
                (Array.isArray(p.cor) 
                    ? p.cor.some(c => coresSel.includes(c)) 
                    : coresSel.includes(p.cor));
            
            return buscaMatch && catMatch && corMatch && precoMatch;
        });

        let sortMode = sortSelect.value;
        if(sortMode === 'menor') filtrados.sort((a,b) => a.preco - b.preco);
        if(sortMode === 'maior') filtrados.sort((a,b) => b.preco - a.preco);

        renderProducts(filtrados);

        // Atualiza a quantidade escrita no botão do celular
        if (mobileApplyFiltersBtn) {
            mobileApplyFiltersBtn.innerText = `Ver ${filtrados.length} Resultados`;
        }
    }

    searchInput.addEventListener('input', applyFilters);
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        applyFilters();
        document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
    });

    checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));
    priceRange.addEventListener('input', applyFilters);
    sortSelect.addEventListener('change', applyFilters);

    // 5. Carrinho
    const cartModal = document.getElementById('cartModal');
    const cartOverlay = document.getElementById('cartOverlay');

    window.toggleLike = function(el) {
        const icon = el.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.replace('far', 'fas');
            icon.style.color = '#d81b60';
        } else {
            icon.classList.replace('fas', 'far');
        }
    };

    window.addToCart = function(id) {
        const prod = produtos.find(p => p.id === id);
        carrinho.push(prod);
        updateCartUI();
        openCart();
    };

    window.removeFromCart = function(index) {
        carrinho.splice(index, 1);
        updateCartUI();
    };

    function updateCartUI() {
        document.getElementById('cartCount').innerText = carrinho.length;
        const container = document.getElementById('cartItems');
        let total = 0;
        container.innerHTML = '';

        if(carrinho.length === 0) {
            container.innerHTML = '<p style="text-align:center; margin-top:30px; color:#999;">O carrinho está vazio.</p>';
        } else {
            carrinho.forEach((item, index) => {
                total += item.preco;
                container.innerHTML += `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.nome}" style="width:70px;height:70px;object-fit:cover;border-radius:8px;">
                        <div class="item-details" style="flex:1;">
                            <h4 style="font-size:14px;margin-bottom:5px;">${item.nome}</h4>
                            <p style="font-weight:bold;color:var(--pink-brand);">${formatCurrency(item.preco)}</p>
                            <button onclick="removeFromCart(${index})" style="background:none;border:none;color:#999;text-decoration:underline;cursor:pointer;">Remover</button>
                        </div>
                    </div>
                `;
            });
        }
        document.getElementById('cartTotalValue').innerText = formatCurrency(total);
    }

    function openCart() { cartModal.classList.add('open'); cartOverlay.classList.add('active'); }
    function closeCart() { cartModal.classList.remove('open'); cartOverlay.classList.remove('active'); }

    document.getElementById('openCart').addEventListener('click', (e) => { e.preventDefault(); openCart(); });
    document.getElementById('closeCart').addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // 6. Finalizar Compra via WhatsApp
    document.getElementById('btnFinalizarCompra').addEventListener('click', () => {
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio! Adicione algumas peças antes de finalizar.");
            return;
        }

        let mensagem = "Olá! 💖 Gostaria de finalizar a minha compra. Aqui estão os itens que escolhi:\n\n";
        let total = 0;
        carrinho.forEach((item, index) => {
            mensagem += `*${index + 1} - ${item.nome}*\nValor: ${formatCurrency(item.preco)}\n\n`;
            total += item.preco;
        });
        mensagem += `*Total da Compra: ${formatCurrency(total)}*\n\nAguardo as instruções para envio e pagamento (PIX/Cartão).`;

        const url = `https://wa.me/5561992857237?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
        closeCart();
    });

    // 7. Visualização de Imagem
    const imageModal = document.getElementById('imageModal');
    const fullImage = document.getElementById('fullImage');
    const closeImageModalBtn = document.getElementById('closeImageModal');

    window.openImageModal = function(imgSrc) {
        fullImage.src = imgSrc; 
        imageModal.classList.add('active'); 
        fullImage.classList.remove('zoomed'); 
        imageModal.scrollTop = 0; imageModal.scrollLeft = 0; 
    };

    closeImageModalBtn.addEventListener('click', () => imageModal.classList.remove('active'));
    imageModal.addEventListener('click', (e) => { if (e.target === imageModal) imageModal.classList.remove('active'); });
    fullImage.addEventListener('click', (e) => { e.stopPropagation(); fullImage.classList.toggle('zoomed'); });

    // ==========================================
    // 8. Gaveta de Filtros no Mobile (Shopee Style)
    // ==========================================
    const filterSidebar = document.getElementById('filterSidebar');
    const mobileFilterBtn = document.getElementById('mobileFilterBtn');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const filterOverlay = document.getElementById('filterOverlay');

    function openFilters() {
        filterSidebar.classList.add('open');
        filterOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
    }

    function closeFilters() {
        filterSidebar.classList.remove('open');
        filterOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Libera o scroll
    }

    // Botão que abre a gaveta (só existe no celular)
    if(mobileFilterBtn) {
        mobileFilterBtn.addEventListener('click', openFilters);
        closeFilterBtn.addEventListener('click', closeFilters);
        filterOverlay.addEventListener('click', closeFilters);
        
        // O botão grandão rosa no fim da gaveta também aplica e fecha
        mobileApplyFiltersBtn.addEventListener('click', closeFilters);
    }
    // ==========================================
    // 9. Lógica da Barra Inferior (Mobile App-like)
    // ==========================================
    const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');

    // Destaca o ícone do menu inferior quando clicado
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove a classe 'active' de todos
            navItems.forEach(nav => nav.classList.remove('active'));
            // Adiciona a classe 'active' apenas no clicado
            this.classList.add('active');
            
            // Lógica extra: se clicou em 'Produtos', opcionalmente pode abrir os filtros
            /* Se quiser que ao clicar no botão da navbar os filtros já abram,
               descomente as duas linhas abaixo: */
            // if (this.innerText.includes('Produtos') && typeof openFilters === 'function') {
            //    openFilters();
            // }
        });
    });

    // Bônus: Destaca o menu inferior automaticamente conforme o usuário rola a página
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100; // Offset para ativação

        const sections = [
            { id: 'catalogo', index: 1 },
            { id: 'avaliacoes', index: 2 },
            { id: 'sobre', index: 3 }
        ];

        let activeIndex = 0; // Início é o padrão
        
        sections.forEach(sec => {
            const element = document.getElementById(sec.id);
            if (element && element.offsetTop <= scrollPosition) {
                activeIndex = sec.index;
            }
        });

        navItems.forEach(nav => nav.classList.remove('active'));
        if(navItems[activeIndex]) {
            navItems[activeIndex].classList.add('active');
        }
    });
});