import os

packs = []
counts = {}

for filename in os.listdir("."):
    print(filename)
    if filename.endswith(".wav"):
        pack = filename.split("-")[1].split(".")[0]
        packs.append(pack)
        if pack not in counts:
            counts[pack] = 1
        else:
            counts[pack] +=1
 
print(set(packs))

for (key, value) in counts.items():
    print(f'{key}: {value}')