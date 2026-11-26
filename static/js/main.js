// ==========================================
// ALTERNAR TEMA (CLARO / ESCURO)
// ==========================================
function toggleTema() {
    const htmlEl = document.documentElement;
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', newTheme);
}

// ==========================================
// SELETOR DE MÓDULOS (MENU ENGRENAGEM)
// ==========================================
let currentModule = 'login-mac';
let currentSubTab = 'login';

function toggleModuleMenu(event) {
    if (event) event.stopPropagation();

    const menu = document.getElementById('module-menu');
    const gearBtn = document.getElementById('module-gear-btn');
    if (!menu) return;

    const isOpen = menu.classList.contains('open');
    if (isOpen) {
        closeModuleMenu();
    } else {
        menu.classList.add('open');
        if (gearBtn) gearBtn.setAttribute('aria-expanded', 'true');
    }
}

function closeModuleMenu() {
    const menu = document.getElementById('module-menu');
    const gearBtn = document.getElementById('module-gear-btn');
    if (menu) menu.classList.remove('open');
    if (gearBtn) gearBtn.setAttribute('aria-expanded', 'false');
}

function triggerPanelTransition(panel) {
    if (!panel) return;
    panel.classList.remove('is-entering');
    void panel.offsetWidth;
    panel.classList.add('is-entering');
}

function switchModule(moduleName) {
    currentModule = moduleName;

    const tabsNav = document.getElementById('login-mac-tabs');
    const panelLogin = document.getElementById('panel-login');
    const panelMac = document.getElementById('panel-mac');
    const panelGpon = document.getElementById('panel-gpon');
    const panelNext = document.getElementById('panel-next-project');
    const appTitle = document.getElementById('app-title');

    const menuLoginMac = document.getElementById('menu-login-mac');
    const menuSip = document.getElementById('menu-sip');
    const menuNext = document.getElementById('menu-next-project');

    [menuLoginMac, menuSip, menuNext].forEach(item => {
        if (item) item.classList.remove('active');
    });

    [panelLogin, panelMac, panelGpon, panelNext].forEach(panel => {
        if (panel) panel.style.display = 'none';
    });

    if (moduleName === 'sip') {
        if (menuSip) menuSip.classList.add('active');
        if (tabsNav) tabsNav.style.display = 'none';
        if (panelGpon) {
            panelGpon.style.display = 'block';
            triggerPanelTransition(panelGpon);
        }
        if (appTitle) appTitle.innerText = 'GPON SIP Generator';
    } else if (moduleName === 'next-project') {
        if (menuNext) menuNext.classList.add('active');
        if (tabsNav) tabsNav.style.display = 'none';
        if (panelNext) {
            panelNext.style.display = 'block';
            triggerPanelTransition(panelNext);
        }
        if (appTitle) appTitle.innerText = 'Próximo Projeto';
    } else {
        currentModule = 'login-mac';
        if (menuLoginMac) menuLoginMac.classList.add('active');
        if (tabsNav) tabsNav.style.display = 'flex';
        if (appTitle) {
            appTitle.innerText = currentSubTab === 'mac' ? 'Formatador de MAC' : 'Gerador de Login';
        }
        switchTab(currentSubTab);
    }

    closeModuleMenu();
}

// ==========================================
// ALTERNAR ABAS E TÍTULO (LOGIN / MAC)
// ==========================================
function switchTab(target) {
    if (target === 'gpon') {
        switchModule('sip');
        return;
    }

    currentSubTab = target === 'mac' ? 'mac' : 'login';

    const tabLogin = document.getElementById("tab-login");
    const tabMac = document.getElementById("tab-mac");
    const panelLogin = document.getElementById("panel-login");
    const panelMac = document.getElementById("panel-mac");
    const appTitle = document.getElementById("app-title");

    [panelLogin, panelMac].forEach(p => { if (p) p.style.display = "none"; });
    [tabLogin, tabMac].forEach(t => { if (t) t.classList.remove("active"); });

    if (currentSubTab === 'login') {
        if (tabLogin) tabLogin.classList.add("active");
        if (panelLogin) {
            panelLogin.style.display = "block";
            triggerPanelTransition(panelLogin);
        }
        if (appTitle && currentModule === 'login-mac') appTitle.innerText = "Gerador de Login";
    } else if (currentSubTab === 'mac') {
        if (tabMac) tabMac.classList.add("active");
        if (panelMac) {
            panelMac.style.display = "block";
            triggerPanelTransition(panelMac);
        }
        if (appTitle && currentModule === 'login-mac') appTitle.innerText = "Formatador de MAC";
    }
}

// ==========================================
// SELEÇÃO DE TIPO, REDE E CIDADE
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
}

function toggleRede(mostrar) {
    const grupoRede = document.getElementById("grupo-rede");
    const redeSelect = document.getElementById("rede");
    const citySelect = document.getElementById("cidade");

    if (mostrar) {
        grupoRede.style.display = "block";
        redeSelect.required = true;
        atualizarCidades();
    } else {
        grupoRede.style.display = "none";
        redeSelect.required = false;
        redeSelect.value = "";

        const grupoAtplus = document.getElementById("grupo-id-atplus");
        if (grupoAtplus) grupoAtplus.style.display = "none";

        citySelect.innerHTML = '<option value="">Selecione...</option>';
        if (typeof cidadesSiglas !== 'undefined') {
            for (const [cidade, sigla] of Object.entries(cidadesSiglas).sort()) {
                let option = document.createElement("option");
                option.value = sigla;
                option.text = cidade;
                citySelect.appendChild(option);
            }
        }
    }
}

function atualizarCidades() {
    const redeSelect = document.getElementById("rede");
    const rede = redeSelect.value;
    const cidadeSelect = document.getElementById("cidade");
    const grupoAtplus = document.getElementById("grupo-id-atplus");
    const inputAtplus = document.getElementById("input-id-atplus");

    if (grupoAtplus && inputAtplus) {
        if (rede.toUpperCase().includes("ATPLUS")) {
            grupoAtplus.style.display = "block";
            inputAtplus.required = true;
        } else {
            grupoAtplus.style.display = "none";
            inputAtplus.required = false;
            inputAtplus.value = "";
        }
    }

    cidadeSelect.innerHTML = '<option value="">Selecione...</option>';

    if (typeof redesCidades !== 'undefined' && redesCidades[rede]) {
        redesCidades[rede].forEach(cidade => {
            let option = document.createElement("option");
            option.value = cidadesSiglas[cidade];
            option.text = cidade;
            cidadeSelect.appendChild(option);
        });
    }
}

// ==========================================
// REQUISIÇÕES (LOGIN & MAC) E EVENTOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formLogin);
            const response = await fetch('/', { method: 'POST', body: formData });
            const dados = await response.json();

            document.getElementById('login').textContent = dados.login;
            document.getElementById('senha').textContent = dados.senha;
            document.getElementById('resultado-bloco').style.display = 'block';
        });
    }

    const formMac = document.getElementById('form-mac');
    if (formMac) {
        formMac.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formMac);
            const response = await fetch('/formatar-mac', { method: 'POST', body: formData });
            const dados = await response.json();

            document.getElementById('mac-cisco').textContent = dados.cisco || '-';
            document.getElementById('mac-linux').textContent = dados.linux || '-';
            document.getElementById('mac-windows').textContent = dados.windows || '-';
            document.getElementById('mac-huawei').textContent = dados.huawei || '-';
            document.getElementById('mac-vendor').textContent = dados.vendor || 'Não encontrado';
            document.getElementById('resultado-mac-bloco').style.display = 'block';
        });
    }

    const inputs = document.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('invalid', function() {
            this.setCustomValidity('falta aqui cabaço');
        });

        input.addEventListener('input', function() {
            this.setCustomValidity('');
        });
    });

    document.addEventListener('click', (e) => {
        const menu = document.getElementById('module-menu');
        const gearBtn = document.getElementById('module-gear-btn');
        if (!menu || !menu.classList.contains('open')) return;
        if (!menu.contains(e.target) && (!gearBtn || !gearBtn.contains(e.target))) {
            closeModuleMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModuleMenu();
        }
    });
});

// ==========================================
// GERADOR GPON SIP
// ==========================================
function gerarGponConfig(event) {
    event.preventDefault();

    const pon = document.getElementById('gpon-pon').value.trim();
    const onu = document.getElementById('gpon-onu').value.trim();
    const caixa = document.getElementById('gpon-caixa').value.trim();
    const porta = document.getElementById('gpon-porta').value.trim();
    const login = document.getElementById('gpon-login').value.trim();

    let serial = document.getElementById('gpon-serial').value.trim().replace(/[^a-zA-Z0-9]/g, '');

    const vlan = document.getElementById('gpon-vlan').value.trim();
    const sip = document.getElementById('gpon-sip').value.trim();
    const spVoip = document.getElementById('gpon-sp-voip').value.trim();
    const spDados = document.getElementById('gpon-sp-dados').value.trim();

    const configScript = `interface gpon ${pon}
 onu ${onu}
  name "${caixa}|${porta}|${login}"
  serial-number ${serial}
  line-profile SIP_Banda-Maxima_${vlan}
  ipv4 vlan vlan-id 99
  ipv4 dhcp
  ethernet 1
   negotiation
   no shutdown
   native vlan vlan-id ${vlan}
  !
  ethernet 2
   negotiation
   no shutdown
   native vlan vlan-id ${vlan}
  !
  pots 1
   sip-agent-profile SIP
   sip-user-agent
    username ${sip}
    password ${sip}
    user-part-aor ${sip}
   !
  !
 !
!

service-port ${spVoip}
 gpon ${pon} onu ${onu} gem 1 match vlan vlan-id 99 action vlan replace vlan-id 99

service-port ${spDados}
 gpon ${pon} onu ${onu} gem 2 match vlan vlan-id ${vlan} action vlan replace vlan-id ${vlan}`;

    document.getElementById('gpon-script-out').value = configScript;
    document.getElementById('resultado-gpon-bloco').style.display = 'block';
}

// ==========================================
// COPIAR COM TOAST
// ==========================================
function copyValue(id) {
    const el = document.getElementById(id);
    if (!el) return;

    const text = el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' ? el.value : el.innerText;

    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById("toast");
        if (toast) {
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 2000);
        }
    });
}
