# utils/constantes.py

OUI_LOCAL = {
    "2C5491": "Huawei Technologies Co., Ltd",
    "00E0FC": "Huawei Technologies Co., Ltd",
    "F4E31B": "Huawei Technologies Co., Ltd",
    "004066": "Huawei Technologies Co., Ltd",
    "00D0D0": "Datacom Equipamentos",
    "0019C3": "Datacom Equipamentos",
    "7426AC": "Datacom Equipamentos",
    "00259E": "Fiberhome Telecommunication Technologies",
    "30E171": "Fiberhome Telecommunication Technologies",
    "F8F980": "Fiberhome Telecommunication Technologies",
    "94A8A3": "Fiberhome Telecommunication Technologies",
    "503EAA": "TP-Link Technologies Co., Ltd.",
    "0014D1": "TP-Link Technologies Co., Ltd.",
    "E894F6": "TP-Link Technologies Co., Ltd.",
    "0021ccc": "Intel Corporation",
    "A43135": "Intel Corporation",
    "00170F": "Cisco Systems, Inc",
    "001B0C": "Cisco Systems, Inc",
    "D4CA6D": "MikroTik",
    "000C42": "MikroTik",
    "E828C1": "Ubiquiti Networks, Inc.",
    "002722": "Ubiquiti Networks, Inc.",
}

REDES = [
    "LOGIN", "SEVEN", "RF", "PLUGNET", "BKUP", "SULTECH",
    "AC5G", "HP", "AT PLUS", "3SNET", "BLUVELLOX", "INFIX",
    "BLOOM", "BLUFIBRA", "DFS", "HCMRF", "USER", "AXTEL", "NEWBIG",
    "VIACLOUD", "VERSA", "FIBRAVILLE", "CONECT", "STARLYNK", "SPEEDNET",
    "TRIUNFO", "MEGALINK", "FRASANET", "EMOTION", "M&M", "4NET",
    "MUNDODIGITAL", "MIXCONECT", "REDESUL", "MASTERINFO", "LT", "FULLNET"
]

REDES_INTERIOR = {
    "LOGIN": ["Fraiburgo", "Pinheiro Preto", "Salto Veloso", "Tangará", "Videira", "Monte Carlo"],
    "SEVEN": ["Videira"],
    "RF": ["Fraiburgo"],
    "PLUGNET": ["Fraiburgo"],
    "BKUP": ["Caçador", "Fraiburgo", "Iomerê", "Pinheiro Preto", "Tangará", "Videira"],
    "SULTECH": ["Pouso Redondo", "Rio do Sul", "Petrolândia", "Ituporanga"],
    "BLUVELLOX": ["Blumenau", "Indaial"],
    "INFIX": ["Ascurra"],
    "BLOOM": ["Blumenau"],
    "BLUFIBRA": ["Blumenau", "Indaial"],
    "LT": ["Caçador"],
    "FULLNET": ["Rio do Sul"],
    "HP": ["Lages"],
    "AT PLUS": ["Lages"]
}

REDES_LITORAL = [
    "SPEEDNET", "TRIUNFO", "MEGALINK", "FRASANET",
    "EMOTION", "M&M", "4NET", "MUNDODIGITAL",
    "MIXCONECT", "REDESUL", "MASTERINFO",
    "CONECT", "STARLYNK", "VERSA",
    "VIACLOUD", "AXTEL", "NEWBIG", "USER",
    "HCMRF", "DFS", "3SNET", "AC5G", "FIBRAVILLE"
]

LITORAL = [
    "Araquari", "Balneário Barra do Sul", "Balneário Piçarras",
    "Barra Velha", "Navegantes", "Penha",
    "São Francisco do Sul", "Itapoá", "Garuva",
    "Brusque", "Camboriú", "Luiz Alves",
    "Massaranduba", "Guaramirim", "Jaraguá do Sul",
    "Joinville", "Schroeder", "Rio dos Cedros"
]

CIDADES = {
    "Brunópolis": "bnu",
    "Campos Novos": "cnv",
    "Curitibanos": "ctb",
    "Fraiburgo": "fbg",
    "Frei Rogério": "frr",
    "Iomerê": "iom",
    "Monte Carlo": "mca",
    "Pinheiro Preto": "ppr",
    "Videira": "vda",
    "Agronômica": "agr",
    "Aurora": "aur",
    "Ituporanga": "itu",
    "Lontras": "lon",
    "Petrolândia": "ptl",
    "Pouso Redondo": "prd",
    "Rio do Sul": "rsl",
    "Campo Belo do Sul": "cbs",
    "Capão Alto": "cat",
    "Correia Pinto": "cpo",
    "Lages": "lgs",
    "Ponte Alta": "pta",
    "Apiúna": "api",
    "Ascurra": "asc",
    "Blumenau": "blu",
    "Indaial": "idl",
    "Rodeio": "rod",
    "Água Doce": "ace",
    "Catanduvas": "ctv",
    "Herval d'Oeste": "hdo",
    "Ibicaré": "ibc",
    "Ipira": "ipi",
    "Joaçaba": "jba",
    "Luzerna": "lzn",
    "Piratuba": "ptb",
    "Salto Veloso": "svs",
    "Tangará": "tan",
    "Treze Tílias": "tzs",
    "Anita Garibaldi": "ant",
    "Caçador": "cdr",
    "Macieira": "mra",
    "Ponte Alta do Norte": "pan",
    "São Cristóvão do Sul": "sct",
    "Araquari": "arq",
    "Balneário Barra do Sul": "bbs",
    "Brusque": "brq",
    "Camboriú": "cmb",
    "Campo Alegre": "cal",
    "Guaramirim": "grm",
    "Jaraguá do Sul": "jas",
    "Joinville": "jve",
    "Luiz Alves": "las",
    "Massaranduba": "mas",
    "São Francisco do Sul": "sfs",
    "Schroeder": "sch",
    "Erval Velho": "evv",
    "Lacerdópolis": "ldp",
    "Rio dos Cedros": "rdc",
    "Balneário Piçarras": "bpi",
    "Barra Velha": "bve",
    "Navegantes": "nav",
    "Penha": "pen",
    "São João do Itaperiú": "sji",
    "Garuva": "gva",
    "Itapoá": "itp"
}

# Junta tudo dinamicamente
REDES_CIDADES = {}
REDES_CIDADES.update(REDES_INTERIOR)
for rede in REDES_LITORAL:
    REDES_CIDADES[rede] = LITORAL
