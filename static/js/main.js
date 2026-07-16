// static/js/main.js

// Função para Alternar Abas (Tabs) - Atualizada para 3 abas paralelas
// Função para Alternar Abas (Tabs)
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
        tabMac.classList.remove("active");
        panelLogin.style.display = "block";
        panelMac.style.display = "none";
        appTitle.innerText = "Gerador de Login";
    } else if (target === 'mac') {
    } else {
        tabLogin.classList.remove("active");
        tabMac.classList.add("active");
        panelLogin.style.display = "none";
        panelMac.style.display = "block";
        appTitle.innerText = "Formatador de MAC";
    } else if (target === 'port') {
        tabPort.classList.add("active");
        panelPort.style.display = "block";
        appTitle.innerText = "Scanner de Portas";
    }
}

@@ -135,7 +122,6 @@ function atualizarIconeTema(tema) {
    }
}

// Animação para o submit do formulário padrão/login
function animarGerar(e) {
    const btnText = document.getElementById("btn-text");
    const btnLoader = document.getElementById("btn-loader");
@@ -195,62 +181,6 @@ function formatarMacAjax(e) {
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
