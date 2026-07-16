# app.py
from flask import Flask, request, render_template, jsonify
from utils.constantes import REDES, CIDADES, REDES_CIDADES
from utils.helpers import buscar_vendor, limpar_mac, limpar

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    tipo_login = "neutra"
    resultado = False
    login = ""
    senha = ""
    
    if request.method == "POST":
        nome = request.form.get("nome", "")
        tipo_login = request.form.get("tipo_login", "neutra")
        rede = request.form.get("rede", "")
        cidade = request.form.get("cidade", "")
        
        # --- LÓGICA DE GERAÇÃO DO LOGIN E SENHA ---
        from datetime import datetime
        
        # 1. Tratamento do Nome
        nome_completo = limpar(nome).strip()
        partes_nome = nome_completo.split()
        
        primeiro_nome = partes_nome[0].lower() if partes_nome else ""
        ultimo_sobrenome = partes_nome[-1].lower() if len(partes_nome) > 1 else ""
        
        # 2. Geração do Login
        if tipo_login == "padrao":
            # Formato: primeiro.ultimo.cidade (Ex: alysson.cordeiro.mca)
            if ultimo_sobrenome:
                login = f"{primeiro_nome}.{ultimo_sobrenome}.{cidade}"
            else:
                login = f"{primeiro_nome}.{cidade}"
        else:
            # Formato: primeiro.ultimo.cidade.rede (Ex: alysson.cordeiro.fbg.login)
            rede_formatada = limpar(rede).lower().replace(" ", "")
            if ultimo_sobrenome:
                login = f"{primeiro_nome}.{ultimo_sobrenome}.{cidade}.{rede_formatada}"
            else:
                login = f"{primeiro_nome}.{cidade}.{rede_formatada}"
        
        # 3. Geração da Senha
        if tipo_login == "padrao":
            # Primeira letra do primeiro nome + primeira letra do segundo nome + ano atual (Ex: ac2026)
            p_letra = primeiro_nome[0] if primeiro_nome else ""
            
            # Pega a primeira letra do segundo nome (se existir)
            s_letra = ""
            if len(partes_nome) > 1:
                s_letra = partes_nome[1][0].lower()
                
            ano_atual = datetime.now().year
            senha = f"{p_letra}{s_letra}{ano_atual}"
        else:
            # Nome completo em maiúsculo separado por hífens (Ex: ALYSSON-RENAN-ESSER-CORDEIRO)
            senha = "-".join(partes_nome).upper()
            
        resultado = True

        # AJUSTE PARA AJAX: Se a requisição veio do JavaScript (fetch),
        # retornamos apenas os dados em formato JSON.
        if request.headers.get("X-Requested-With") == "XMLHttpRequest" or request.accept_mimetypes.accept_json:
            return jsonify({
                "status": "success",
                "login": login,
                "senha": senha
            })

    # Caso seja uma requisição convencional (GET), renderiza a página normalmente
    return render_template(
        "index.html",
        redes=REDES,
        cidades=CIDADES,
        redes_cidades=REDES_CIDADES,
        tipo_login=tipo_login,
        resultado=resultado,
        login=login,
        senha=senha
    )

@app.route("/formatar-mac", methods=["POST"])
def formatar_mac():
    mac_cru = request.form.get("mac", "")
    mac_limpo = limpar_mac(mac_cru)
    
    if len(mac_limpo) != 12:
        return jsonify({"status": "error", "message": "Endereço MAC inválido."}), 400
        
    cisco = f"{mac_limpo[0:4].lower()}.{mac_limpo[4:8].lower()}.{mac_limpo[8:12].lower()}"
    linux = f"{mac_limpo[0:2]}:{mac_limpo[2:4]}:{mac_limpo[4:6]}:{mac_limpo[6:8]}:{mac_limpo[8:10]}:{mac_limpo[10:12]}"
    windows = f"{mac_limpo[0:2]}-{mac_limpo[2:4]}-{mac_limpo[4:6]}-{mac_limpo[6:8]}-{mac_limpo[8:10]}-{mac_limpo[10:12]}"
    huawei = f"{mac_limpo[0:4]}-{mac_limpo[4:8]}-{mac_limpo[8:12]}"
    
    vendor = buscar_vendor(mac_limpo)
    
    return jsonify({
        "status": "success",
        "cisco": cisco,
        "linux": linux.lower(),
        "windows": windows,
        "huawei": huawei,
        "vendor": vendor
    })

if __name__ == "__main__":
    app.run(debug=True)
