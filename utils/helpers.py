# utils/helpers.py
import re
import unicodedata
import urllib.request
from utils.constantes import OUI_LOCAL

def limpar(txt):
    txt = unicodedata.normalize("NFD", txt)
    return txt.encode("ascii", "ignore").decode("utf-8")

def limpar_mac(mac):
    return re.sub(r'[^0-9A-Fa-f]', '', mac).upper()

def buscar_vendor(mac_limpo):
    oui = mac_limpo[:6]
    vendor = OUI_LOCAL.get(oui, None)
    
    if not vendor:
        try:
            url = f"https://api.macvendors.com/{mac_limpo}"
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=2) as response:
                vendor = response.read().decode('utf-8')
        except Exception:
            vendor = "Não encontrado."
            
    return vendor