// ==========================================
// VARIÁVEIS GLOBAIS DE CONTROLE (DO HTML)
// ==========================================
// Essas variáveis garantem que o JS não quebre se o HTML demorar a renderizar os scripts do Flask
const siglaAnterior = typeof cidadeSelecionadaAnteriormente !== 'undefined' ? cidadeSelecionadaAnteriormente : '';

// ==========================================
// ALTERNAR ENTRE ABAS (TABS)
// ==========================================
function switchTab(target) {
    const tabLogin = document.getElementById("tab-login");
    const tabMac = document.getElementById("tab-mac");
    const panelLogin = document.getElementById("panel-login");
    const panelMac = document.getElementById("panel-mac");
    const appTitle = document.getElementById("app-title");

    if (target === 'login') {
        tabLogin.classList.add("active");
        tabMac.classList.remove("active");
        panelLogin.style.display = "block";
        panelMac.style.display = "none";
        appTitle.innerText = "Gerador de Login";
    } else {
        tabLogin.classList.remove("active");
        tabMac.classList.add("active");
        panelLogin.style.display = "none";
        panelMac.style.display = "block";
        appTitle.innerText = "Formatador de MAC";
    }
}

// ==========================================
// CONTROLE DO FORMULÁRIO DE LOGIN (CAMPOS)
// ==========================================
function selecionarTipo(tipo) {
    document.getElementById("card-neutra").classList.remove("active");
    document.getElementById("card-padrao").classList.remove("active");
    
    if (tipo === 'neutra') {
        document.getElementById("card-neutra").classList.add("active");
        toggleRede(true);
    } else {
        document.getElementById("card-padrao").classList.add("active");
        toggleRede(false);
    }
    verificarExibicaoIdAtplus();
}

function toggleRede(mostrar) {
    const grupoRede = document.getElementById("grupo-rede");
    const redeSelect = document.getElementById("rede");
    const citySelect = document.getElementById("cidade");

    if (mostrar) {
        if (grupoRede) {
            grupoRede.style.display = "block";
            redeSelect.required = true;
        }
        atualizarCidades();
    } else {
        if (grupoRede) {
            grupoRede.style.display = "none";
            redeSelect.required = false;
            redeSelect.value = "";
        }
        
        citySelect.innerHTML = '<option value="">Selecione...</option>';
        for (const [cidade, sigla] of Object.entries(cidadesSiglas).sort()) {
            let option = document.createElement("option");
            option.value = sigla;
            option.text = cidade;
            if (sigla === siglaAnterior) {
                option.selected = true;
            }
            citySelect.appendChild(option);
        }
    }
    verificarExibicaoIdAtplus();
}

function atualizarCidades() {
    const rede = document.getElementById("rede").value;
    const cidadeSelect = document.getElementById("cidade");

    cidadeSelect.innerHTML = '<option value="">Selecione...</option>';

    if (redesCidades && redesCidades[rede]) {
        redesCidades[rede].forEach(cidade => {
            let option = document.createElement("option");
            option.value = cidadesSiglas[cidade];
            option.text = cidade;
            if (cidadesSiglas[cidade] === siglaAnterior) {
                option.selected = true;
            }
            cidadeSelect.appendChild(option);
        });
    }
    verificarExibicaoIdAtplus();
}

// ==========================================
// CONTROLE DE EXIBIÇÃO DO ID ATPLUS
// ==========================================
function verificarExibicaoIdAtplus() {
    const tipoLogin = document.querySelector('input[name="tipo_login"]:checked')?.value;
    const redeSelecionada = document.getElementById('rede')?.value.toUpperCase() || '';
    const grupoIdAtplus = document.getElementById('grupo-id-atplus');
    const inputIdAtplus = document.getElementById('input-id-atplus');

    if (!grupoIdAtplus || !inputIdAtplus) return;

    if (tipoLogin === 'neutra' && redeSelecionada.includes('ATPLUS')) {
        grupoIdAtplus.style.display = 'block';
        inputIdAtplus.setAttribute('required', 'required');
    } else {
        grupoIdAtplus.style.display = 'none';
        inputIdAtplus.removeAttribute('required');
        inputIdAtplus.value = '';
    }
}

// ==========================================
// SISTEMA DE TEMAS (DARK / LIGHT)
// ==========================================
function toggleTema() {
    const htmlEl = document.documentElement;
    const currentTheme = htmlEl.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    htmlEl.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    atualizarIconeTema(newTheme);
}

function inicializarTema() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    atualizarIconeTema(savedTheme);
}

function atualizarIconeTema(tema) {
    const icon = document.getElementById("theme-icon");
    if (!icon) return;
    
    if (tema === "light") {
        icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"></path>`;
    } else {
        icon.innerHTML = `
            <circle cx="12" cy="12" r="5" fill="currentColor"></circle>
            <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2"></line>
            <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"></line>
            <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2"></line>
            <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2"></line>
        `;
    }
}

// ==========================================
// REQUISIÇÕES ASSÍNCRONAS (AJAX)
// ==========================================

// 1. Envio do Gerador de Login
async function animarGerar(event) {
    event.preventDefault();

    const btn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const loader = document.getElementById('btn-loader');
    const resultadoBloco = document.getElementById('resultado-bloco');
    
    const txtLogin = document.getElementById('login');
    const txtSenha = document.getElementById('senha');

    btn.disabled = true;
    btnText.textContent = "Gerando...";
    loader.style.display = "inline-block";
    
    if (resultadoBloco) {
        resultadoBloco.style.display = "none"; 
    }

    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('/', { 
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error("Erro na requisição");

        const dados = await response.json();

        txtLogin.textContent = dados.login;
        txtSenha.textContent = dados.senha;

        resultadoBloco.style.display = "block";

    } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao gerar o acesso.");
    } finally {
        btn.disabled = false;
        btnText.textContent = "Gerar Acesso";
        loader.style.display = "none";
    }
}

// 2. Envio do Formatador de MAC
async function formatarMacAjax(event) {
    event.preventDefault();

    const btn = document.getElementById('submit-mac-btn');
    const btnText = document.getElementById('btn-mac-text');
    const loader = document.getElementById('btn-mac-loader');
    const resultadoBloco = document.getElementById('resultado-mac-bloco');

    const macCisco = document.getElementById('mac-cisco');
    const macLinux = document.getElementById('mac-linux');
    const macWindows = document.getElementById('mac-windows');
    const macHuawei = document.getElementById('mac-huawei');
    const macVendor = document.getElementById('mac-vendor');

    btn.disabled = true;
    btnText.textContent = "Formatando...";
    loader.style.display = "inline-block";
    resultadoBloco.style.display = "none";

    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('/formatar-mac', { 
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error("Erro na requisição");

        const dados = await response.json();

        macCisco.textContent = dados.cisco || '-';
        macLinux.textContent = dados.linux || '-';
        macWindows.textContent = dados.windows || '-';
        macHuawei.textContent = dados.huawei || '-';
        macVendor.textContent = dados.vendor || 'Não encontrado';

        resultadoBloco.style.display = "block";

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao formatar MAC.");
    } finally {
        btn.disabled = false;
        btnText.textContent = "Formatar";
        loader.style.display = "none";
    }
}

// ==========================================
// FUNÇÃO COPIAR VALOR (TOAST)
// ==========================================
function copyValue(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById("toast");
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 2000);
    });
}

// ==========================================
// INICIALIZAÇÃO E ATRIBUIÇÃO DE EVENTOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', animarGerar);
    }

    const selectRede = document.getElementById('rede');
    if (selectRede) {
        selectRede.addEventListener('change', verificarExibicaoIdAtplus);
    }

    // Executa uma verificação ao carregar a página
    verificarExibicaoIdAtplus();
});
