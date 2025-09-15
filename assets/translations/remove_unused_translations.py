import json
import os

translation_files = ['fr.json', 'en.json', 'es.json']
unused_keys_file = 'unused_keys.txt'

# Vérification de la présence du fichier de clés
if not os.path.exists(unused_keys_file):
    print("Erreur : unused_keys.txt est introuvable. Lancez d'abord audit_traduction.sh")
    exit(1)

with open(unused_keys_file, 'r', encoding='utf-8') as f:
    unused_keys = [line.strip() for line in f if line.strip()]

for file in translation_files:
    if not os.path.exists(file):
        print(f"Fichier de traduction introuvable : {file}")
        continue
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    removed = 0
    for key in unused_keys:
        if key in data:
            del data[key]
            removed += 1
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"{removed} clés supprimées de {file}")

print("Nettoyage automatique terminé !")
