// static/js/main.js

// Função para Alternar Abas (Tabs)
function switchTab(target) {
    const tabLogin = document.getElementById("tab-login");
    const tabMac = document.getElementById("tab-mac");
    const tabCidr = document.getElementById("tab-cidr");
    
    const panelLogin = document.getElementById("panel-login");
    const panelMac = document.getElementById("panel-mac");
    const panelCidr = document.getElementById("panel-cidr");
    
    const appTitle = document.getElementById("app-title");

    // Desativa todas as abas e painéis
    tabLogin.classList.remove("active");
    tabMac.classList.remove("active");
    tabCidr.classList.remove("active");
    
    panelLogin.style.display = "none";
    panelMac.style.display = "none";
    panelCidr.style.display = "none";

    // Ativa apenas a selecionada e altera o título no header
    if (target === 'login') {
        tabLogin.classList.add("active");
        panelLogin.style.display = "block";
        appTitle.innerText = "Gerador de Login";
    } else if (target === 'mac') {
        tabMac.classList.add("active");
        panelMac.style.display = "block";
        appTitle.innerText = "Formatador de MAC";
    } else if (target === 'cidr') {
        tabCidr.classList.add("active");
        panelCidr.style.display = "block";
        appTitle.innerText = "Calculadora CIDR";
        inicializarOpcoesCidr();
    }
}

// Inicializa a lista de sub-redes de /8 a /32
function inicializarOpcoesCidr() {
    const select = document.getElementById("select-cidr-prefix");
    if (select.children.length > 1) return; 

    for (let i = 32; i >= 8; i--) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.text = `/${i}`;
        if (i === 24) opt.selected = true; 
        select.appendChild(opt);
    }
}

// Matemática de Redes IPv4 puro em JavaScript
function calcularCidr(e) {
    e.preventDefault();
    const ipStr = document.getElementById("input-cidr-ip").value.trim();
    const prefix = parseInt(document.getElementById("select-cidr-prefix").value);

    const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipPattern.test(ipStr)) {
        alert("Endereço IPv4 inválido!");
        return;
    }

    const octetos = ipStr.split(".").map(Number);
    const ipNum = (octetos[0] << 24) | (octetos[1] << 16) | (octetos[2] << 8) | octetos[3];

    const maskNum = prefix === 0 ? 0 : (~0 << (32 - prefix));
    const wildcardNum = ~maskNum;

    const netNum = ipNum & maskNum;
    const broadNum = netNum | wildcardNum;

    const numToIp = (num) => [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
    ].join(".");

    let firstHost = "-", lastHost = "-", usableHosts = 0;
    if (prefix < 31) {
        firstHost = numToIp(netNum + 1);
        lastHost = numToIp(broadNum - 1);
        usableHosts = Math.pow(2, 32 - prefix) - 2;
    } else if (prefix === 31) {
        firstHost = numToIp(netNum);
        lastHost = numToIp(broadNum);
        usableHosts = 2;
    } else {
        firstHost = numToIp(netNum);
        lastHost = numToIp(broadNum);
        usableHosts = 1;
    }

    const firstOctet = octetos[0];
    let ipClass = "Desconhecida";
    if (firstOctet >= 1 && firstOctet <= 126) ipClass = "A";
    else if (firstOctet === 127) ipClass = "Loopback (Classe A)";
    else if (firstOctet >= 128 && firstOctet <= 191) ipClass = "B";
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = "C";
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = "D (Multicast)";
    else if (firstOctet >= 240 && firstOctet <= 255) ipClass = "E (Experimental)";

    let ipType = "Público";
    if (
        (firstOctet === 10) ||
        (firstOctet === 172 && octetos[1] >= 16 && octetos[1] <= 31) ||
        (firstOctet === 192 && octetos[2] === 168)
    ) {
        ipType = "Privado";
    } else if (firstOctet === 100 && octetos[1] >= 64 && octetos[1] <= 127) {
        ipType = "Privado (CGNAT)";
    } else if (firstOctet === 169 && octetos[1] === 254) {
        ipType = "Link-Local (APIPA)";
    }

    const toBin = (num) => {
        let raw = (num >>> 0).toString(2).padStart(32, "0");
        return `${raw.substring(0,8)}.${raw.substring(8,16)}.${raw.substring(16,24)}.${raw.substring(24,32)}`;
    };

    document.getElementById("cidr-res-net").innerText = `${numToIp(netNum)} /${prefix}`;
    document.getElementById("cidr-res-broad").innerText = numToIp(broadNum);
    document.getElementById("cidr-res-first").innerText = firstHost;
    document.getElementById("cidr-res-last").innerText = lastHost;
    document.getElementById("cidr-res-hosts").innerText = usableHosts.toLocaleString("pt-BR");
    document.getElementById("cidr-res-mask").innerText = numToIp(maskNum);
    document.getElementById("cidr-res-wild").innerText = numToIp(wildcardNum);
    document.getElementById("cidr-res-class-type").innerText = `Classe ${ipClass} (${ipType})`;
    document.getElementById("cidr-res-binary").innerText = toBin(ipNum);

    document.getElementById("resultado-cidr-bloco").style.display = "block";
}

function limparCidr() {
    document.getElementById("input-cidr-ip").value = "";
    document.getElementById("select-cidr-prefix").value = "24";
    document.getElementById("resultado-cidr-bloco").style.display = "none";
}

function copyFullCidrResult() {
    const net = document.getElementById("cidr-res-net").innerText;
    const broad = document.getElementById("cidr-res-broad").innerText;
    const first = document.getElementById("cidr-res-first").innerText;
    const last = document.getElementById("cidr-res-last").innerText;
    const hosts = document.getElementById("cidr-res-hosts").innerText;
    const mask = document.getElementById("cidr-res-mask").innerText;
    const info = document.getElementById("cidr-res-class-type").innerText;
    const bin = document.getElementById("cidr-res-binary").innerText;

    const relatorio = `--- CÁLCULO DE SUB-REDE CIDR ---
Rede: ${net}
Máscara: ${mask}
Primeiro Host: ${first}
Último Host: ${last}
Broadcast: ${broad}
Hosts Utilizáveis: ${hosts}
Classificação: ${info}
Binário: ${bin}`;

    navigator.clipboard.writeText(relatorio).then(() => {
        exibirToast();
    });
}

function exibirToast() {
    const toast = document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

// Alternar entre tipo de conexões no login original
function selecionarTipo(tipo) {
    document.getElementById("card-neutra").classList.remove("active");
    document.getElementById("card-padrao").classList.remove("active");
    
    if (tipo === 'neutra') {
        document.getElementById("card-neutra").classList.add("active");
        document.getElementById("radio-neutra").checked = true;
        toggleRede(true);
    } else {
        document.getElementById("card-padrao").classList.add("active");
        document.getElementById("radio-padrao").checked = true;
        toggleRede(false);
    }
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
            if (sigla === cidadeSelecionadaAnteriormente) {
                option.selected = true;
            }
            citySelect.appendChild(option);
        }
    }
}

function atualizarCidades() {
    const rede = document.getElementById("rede").value;
    const cidadeSelect = document.getElementById("cidade");

    cidadeSelect.innerHTML = '<option value="">Selecione...</option>';

    if (redesCidades[rede]) {
        redesCidades[rede].forEach(cidade => {
            let option = document.createElement("option");
            option.value = cidadesSiglas[cidade];
            option.text = cidade;
            if (cidadesSiglas[cidade] === cidadeSelecionadaAnteriormente) {
                option.selected = true;
            }
            cidadeSelect.appendChild(option);
        });
    }
}

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

function animarGerar(e) {
    const btnText = document.getElementById("btn-text");
    const btnLoader = document.getElementById("btn-loader");
    const submitBtn = document.getElementById("submit-btn");

    btnText.style.opacity = "0.6";
    btnText.innerText = "Processando...";
    btnLoader.style.display = "inline-block";
    submitBtn.style.pointerEvents = "none";
}

function formatarMacAjax(e) {
    e.preventDefault();
    const macInput = document.getElementById("input-mac").value;
    const btnText = document.getElementById("btn-mac-text");
    const btnLoader = document.getElementById("btn-mac-loader");
    const submitBtn = document.getElementById("submit-mac-btn");
    const resultBlock = document.getElementById("resultado-mac-bloco");

    btnText.style.opacity = "0.6";
    btnText.innerText = "Processando...";
    btnLoader.style.display = "inline-block";
    submitBtn.style.pointerEvents = "none";

    fetch("/formatar-mac", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ mac: macInput })
    })
    .then(response => response.json())
    .then(data => {
        btnText.style.opacity = "1";
        btnText.innerText = "Formatar";
        btnLoader.style.display = "none";
        submitBtn.style.pointerEvents = "auto";

        if (data.status === "error") {
            alert(data.message);
            resultBlock.style.display = "none";
        } else {
            document.getElementById("mac-cisco").innerText = data.cisco;
            document.getElementById("mac-linux").innerText = data.linux;
            document.getElementById("mac-windows").innerText = data.windows;
            document.getElementById("mac-huawei").innerText = data.huawei;
            document.getElementById("mac-vendor").innerText = data.vendor;
            resultBlock.style.display = "block";
        }
    })
    .catch(err => {
        btnText.style.opacity = "1";
        btnText.innerText = "Formatar";
        btnLoader.style.display = "none";
        submitBtn.style.pointerEvents = "auto";
        alert("Ocorreu um erro ao processar o endereço MAC.");
    });
}

function copyValue(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => {
        exibirToast();
    });
}
