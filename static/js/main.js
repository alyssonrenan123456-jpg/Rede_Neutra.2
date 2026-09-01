// ==========================================
// ALTERNAR ENTRE ABAS (TABS)
// ==========================================
function switchTab(target) {
    const tabLogin = document.getElementById("tab-login");
    const tabMac = document.getElementById("tab-mac");
    const tabGpon = document.getElementById("tab-gpon");
    
    const panelLogin = document.getElementById("panel-login");
    const panelMac = document.getElementById("panel-mac");
    const panelGpon = document.getElementById("panel-gpon");
    
    const appTitle = document.getElementById("app-title");

    [panelLogin, panelMac, panelGpon].forEach(p => { if (p) p.style.display = "none"; });
    [tabLogin, tabMac, tabGpon].forEach(t => { if (t) t.classList.remove("active"); });

    if (target === 'login') {
        tabLogin.classList.add("active");
        panelLogin.style.display = "block";
        appTitle.innerText = "Gerador de Login";
    } else if (target === 'mac') {
        tabMac.classList.add("active");
        panelMac.style.display = "block";
        appTitle.innerText = "Formatador de MAC";
    } else if (target === 'gpon') {
        tabGpon.classList.add("active");
        panelGpon.style.display = "block";
        appTitle.innerText = "GPON SIP Generator";
    }
}

// ==========================================
// SELEÇÃO DO TIPO DE LOGIN
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
    const rede = document.getElementById("rede").value;
    const cidadeSelect = document.getElementById("cidade");
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
// REQUISIÇÕES AJAX (LOGIN & MAC)
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
});

// ==========================================
// GERAÇÃO DE SCRIPT GPON SIP
// ==========================================
function gerarGponConfig(event) {
    event.preventDefault();

    const pon = document.getElementById('gpon-pon').value.trim();
    const onu = document.getElementById('gpon-onu').value.trim();
    const caixa = document.getElementById('gpon-caixa').value.trim();
    const porta = document.getElementById('gpon-porta').value.trim();
    const login = document.getElementById('gpon-login').value.trim();
    let serial = document.getElementById('gpon-serial').value.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
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
   sip-agent-profile 41
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
// FUNÇÕES AUXILIARES (COPIAR & TOAST)
// ==========================================
function copyValue(id) {
    const el = document.getElementById(id);
    const text = el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' ? el.value : el.innerText;

    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById("toast");
        if (toast) {
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 2000);
        }
    });
}
