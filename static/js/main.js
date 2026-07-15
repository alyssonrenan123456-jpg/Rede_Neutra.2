// static/js/main.js

// Função para Alternar Abas (Tabs) - Atualizada para 3 abas paralelas
function switchTab(target) {
    const tabLogin = document.getElementById("tab-login");
    const tabMac = document.getElementById("tab-mac");
    const tabPort = document.getElementById("tab-port");
    
    const panelLogin = document.getElementById("panel-login");
    const panelMac = document.getElementById("panel-mac");
    const panelPort = document.getElementById("panel-port");
    
    const appTitle = document.getElementById("app-title");

    // Desativa todas as abas e painéis
    tabLogin.classList.remove("active");
    tabMac.classList.remove("active");
    tabPort.classList.remove("active");
    panelLogin.style.display = "none";
    panelMac.style.display = "none";
    panelPort.style.display = "none";

    // Ativa apenas a selecionada e altera o título
    if (target === 'login') {
        tabLogin.classList.add("active");
        panelLogin.style.display = "block";
        appTitle.innerText = "Gerador de Login";
    } else if (target === 'mac') {
        tabMac.classList.add("active");
        panelMac.style.display = "block";
        appTitle.innerText = "Formatador de MAC";
    } else if (target === 'port') {
        tabPort.classList.add("active");
        panelPort.style.display = "block";
        appTitle.innerText = "Scanner de Portas";
    }
}

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
        if(grupoRede) {
            grupoRede.style.display = "block";
            redeSelect.required = true;
        }
        atualizarCidades();
    } else {
        if(grupoRede) {
            grupoRede.style.display = "none";
            redeSelect.required = false;
            redeSelect.value = "";
        }
        
        citySelect.innerHTML = '<option value="">Selecione...</option>';
        for (const [cidade, sigla] of Object.entries(cidadesSiglas).sort()) {
            let option = document.createElement("option");
            option.value = sigla;
            option.text = cidade;
            if(sigla === cidadeSelecionadaAnteriormente) {
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
            if(cidadesSiglas[cidade] === cidadeSelecionadaAnteriormente) {
                option.selected = true;
            }
            cidadeSelect.appendChild(option);
        });
    }
}

// Alternar entre temas
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

// Animação para o submit do formulário padrão/login
function animarGerar(e) {
    const btnText = document.getElementById("btn-text");
    const btnLoader = document.getElementById("btn-loader");
    const submitBtn = document.getElementById("submit-btn");

    btnText.style.opacity = "0.6";
    btnText.innerText = "Processando...";
    btnLoader.style.display = "inline-block";
    submitBtn.style.pointerEvents = "none";
}

// Processador AJAX do MAC (Zero reload)
function formatarMacAjax(e) {
    e.preventDefault();
    const macInput = document.getElementById("input-mac").value;
    const btnText = document.getElementById("btn-mac-text");
    const btnLoader = document.getElementById("btn-mac-loader");
    const submitBtn = document.getElementById("submit-mac-btn");
    const resultBlock = document.getElementById("resultado-mac-bloco");

    // Feedback de carregamento
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

// Processador AJAX do Port Check (Apenas portas padrão)
function escanearPortasAjax(e) {
    e.preventDefault();
    const hostInput = document.getElementById("input-port-host").value;
    const btnText = document.getElementById("btn-port-text") || document.querySelector("#submit-port-btn span:not(.btn-loader)");
    const btnLoader = document.getElementById("btn-port-loader");
    const submitBtn = document.getElementById("submit-port-btn");
    const resultBlock = document.getElementById("resultado-port-bloco");
    const tableBody = document.getElementById("port-table-body");

    // Feedback visual de carregamento
    btnText.style.opacity = "0.6";
    btnText.innerText = "Escaneando...";
    btnLoader.style.display = "inline-block";
    submitBtn.style.pointerEvents = "none";
    resultBlock.style.display = "none";
    tableBody.innerHTML = "";

    fetch("/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host: hostInput })
    })
    .then(response => response.json())
    .then(data => {
        btnText.style.opacity = "1";
        btnText.innerText = "Escanear Portas Padrão";
        btnLoader.style.display = "none";
        submitBtn.style.pointerEvents = "auto";

        if (data.status === "error") {
            alert(data.message);
        } else {
            data.resultados.forEach(res => {
                const statusColor = res.status === "Aberta" ? "#10b981" : "#ef4444";
                const row = `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 8px 0; font-family: monospace; font-weight: bold;">${res.porta}</td>
                        <td style="padding: 8px 0; color: var(--text-secondary);">${res.servico}</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: ${statusColor};">${res.status}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
            resultBlock.style.display = "block";
        }
    })
    .catch(err => {
        btnText.style.opacity = "1";
        btnText.innerText = "Escanear Portas Padrão";
        btnLoader.style.display = "none";
        submitBtn.style.pointerEvents = "auto";
        alert("Ocorreu um erro ao escanear.");
    });
}

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
