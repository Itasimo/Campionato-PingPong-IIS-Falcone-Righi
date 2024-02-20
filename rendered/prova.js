let data = "dfsfd"

let scontri = {
    daGiocare: []
}

// Rimuovi gli spazi, transforma in un Array ed elimina gli elementi vuoti 
data = data.replaceAll(' ', '').split(',').filter(Boolean)

if (data.length == 1) {
    throw new Error("Inserire almeno 2 nomi")
}

console.log(data);

let cycles = 0

for (let giocatore1 = 0; giocatore1 < data.length; giocatore1++) {
    for (let giocatore2 = 0; giocatore2 < data.length; giocatore2++) {
        if (data[giocatore1] == data[giocatore2]) {
            continue;
        }

        scontri.daGiocare.push(data[giocatore1] + ' vs ' + data[giocatore2])

        cycles++

    }
}

console.log(cycles);
console.log(scontri.daGiocare);