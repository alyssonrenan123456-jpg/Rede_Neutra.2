// CONTROLE DE ABAS
function switchTab(tab) {
    // Esconde todos os painéis
    document.getElementById('panel-login').style.display = 'none';
    document.getElementById('panel-mac').style.display = 'none';
    document.getElementById('panel-sip').style.display = 'none';

    // Remove classe ativa das abas
    document.getElementById('tab-login').classList.remove('active');
    document.getElementById('tab-mac').classList.remove('active');
    document.getElementById('tab-sip').classList.remove('active');

    // Mostra o painel selecionado e atualiza o título
    const appTitle = document.getElementById('app-title');

    if (tab === 'login') {
        document.getElementById('panel-login').style.display = 'block';
        document.getElementById('tab-login').classList.add('active');
        appTitle.innerText = 'Formatador de Login';
    } else if (tab === 'mac') {
        document.getElementById('panel-mac').style.display = 'block';
        document.getElementById('tab-mac').classList.add('active');
        appTitle.innerText = 'Formatador de MAC';
    } else if (tab === 'sip') {
        document.getElementById('panel-sip').style.display = 'block';
        document.getElementById('tab-sip').classList.add('active');
        appTitle.innerText = 'GPON SIP Generator';
    }
}

// CONTROLE DO MODAL DE AJUDA RETRO
function abrirAjuda() {
    document.getElementById('help-modal').style.display = 'flex';
}

function fecharAjudaDirect() {
    document.getElementById('help-modal').style.display = 'none';
}

function fecharAjuda(event) {
    if (event.target.id === 'help-modal') {
        fecharAjudaDirect();
    }
}

// GERADOR DO SCRIPT SIP
function gerarScriptSIP() {
    const pon = document.getElementById("sip-pon").value.trim();
    const onuId = document.getElementById("sip-onuid").value.trim();
    const vlan = document.getElementById("sip-vlan").value.trim();
    const user = document.getElementById("sip-user").value.trim();
    const spVoip = document.getElementById("sip-sp-voip").value.trim();
    const spInternet = document.getElementById("sip-sp-internet").value.trim();

    if (!pon || !onuId || !vlan || !user) {
        alert("Preencha os campos obrigatórios para gerar o script.");
        return;
    }

    const script = 
`ont modify ${pon} ${onuId} line-profile-name Banda_Maxima_101
service-port ${spVoip} vlan ${vlan} gpon ${pon}/${onuId} gemport 1 multi-service user-vlan ${vlan} tag-transform translate
service-port ${spInternet} vlan 101 gpon ${pon}/${onuId} gemport 2 multi-service user-vlan 101 tag-transform translate
ont sip-config ${pon} ${onuId} user ${user} vlan ${vlan}`;

    document.getElementById("sip-resultado").value = script;
}
