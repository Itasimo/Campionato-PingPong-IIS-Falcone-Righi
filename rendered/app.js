const fs = require("fs").promises;

let scontri = {
    daGiocare: [],
    Giocate: []
}

const popup = {
    reset: `
    <div class="popup">
        <p><b>Questa azione è irreversibile</b>, sei certo/a di voler ripristinare l'evento?</p>
        <button onclick="closePopup()">Annulla</button>
        <button id="reset" onclick="ResetEvento(); location.reload();">Reset</button>
    </div>
    `,
    AddClasse: `
    <div class="popup">
        <p>Inserire il nome della nuova classe</p>
        <input id="ClasseName" type="text" placeholder="Nome Classe">
        <br>
        <button onclick="closePopup()">Annulla</button>
        <button onclick="AddClasse();">Aggiungi</button>
    </div>
    `
}
var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});


AddToDropDown()

async function LoadClasse(Classe) {

    const data = await LoadData(Classe)

    document.getElementById('classeTitle').innerHTML = Classe
    document.getElementsByTagName('title')[0].innerHTML = 'Gestionale Campionati IIS Falcone-Righi - ' + Classe
    document.getElementById('giocatoriInput').value = data.Raw

    if (data.Raw != '') {document.getElementById('QuickAdd').value = data.Raw.split(',').length} else {document.getElementById('QuickAdd').value = ''}
    if ( data.daGiocare.length != 0) { scontri.daGiocare = data.daGiocare } else { scontri.daGiocare = [] }
    if ( data.Giocate.length   != 0) { scontri.Giocate   = data.Giocate   } else { scontri.Giocate   = [] }

    AddToList(scontri.daGiocare)
    Classifica(scontri.Giocate)
    UpadteDiagram()
}



// Quick Add

function QuickAdd(start, players) {

    var res = []

    for (let i = start; i < Number(players) + 1; i++) {

        res.push(i)
        
    }

    document.getElementById('giocatoriInput').value = res.join(',')

    try{
        document.getElementById('errorMessage').innerHTML='';
        PartiteDaGiocare(document.getElementById('giocatoriInput').value)
    }catch(error){
        document.getElementById('errorMessage').innerHTML ='* '+ error.message
    }
}



// Create Matches

function PartiteDaGiocare(data) {

    scontri.daGiocare = []

    data = data.replaceAll(' ', '').split(',').filter(Boolean).sort(collator.compare)

    if (data.length <= 1) {throw new Error("Inserire il numero di giocatori")}

    for (let giocatore1 = 0; giocatore1 < data.length; giocatore1++) {
        for (let giocatore2 = 0; giocatore2 < data.length; giocatore2++) {



            if (data[giocatore1].split('').includes('\uDFC6') || data[giocatore2].split('').includes('\uDFC6')) {throw new Error("Il nome non può contere 🏆")}


UpadteStorage
            let isPresent1 = scontri.daGiocare.includes(data[giocatore1] + ' vs ' + data[giocatore2]) || scontri.daGiocare.includes(data[giocatore2] + ' vs ' + data[giocatore1])
            let isPresent2 = scontri.Giocate.includes('🏆‎' + data[giocatore1] + ' vs ' + data[giocatore2]) || scontri.Giocate.includes('🏆‎' + data[giocatore2] + ' vs ' + data[giocatore1]) || scontri.Giocate.includes(data[giocatore1] + ' vs 🏆‎ ' + data[giocatore2]) || scontri.Giocate.includes(data[giocatore2] + ' vs 🏆‎ ' + data[giocatore1])

            if (data[giocatore1] == data[giocatore2] || isPresent1 || isPresent2) {
                continue;
            }
        
            scontri.daGiocare.push(data[giocatore1] + ' vs ' + data[giocatore2])
        
        }
    }


    AddToList(scontri.daGiocare)
    UpadteStorage(data)
    UpadteDiagram()
}





// Display

function AddToList(list) {
    var container = document.getElementById('partite')

    container.innerHTML = ''

    for (let idx = 0; idx < list.length; idx++) {

        var elem = document.createElement('p')
        elem.innerHTML = list[idx]
        elem.setAttribute('onclick', 'editMatch(this)')

        container.appendChild(elem)
    }
}




// Animations

function vinceAnimBtn(vince, perde) {

    var Vincente = document.getElementById('giocatore' + vince + 'Btn')
    var Perdente = document.getElementById('giocatore' + perde + 'Btn')

    Vincente.className = ''
    Vincente.classList.add('winner')

    Perdente.className = ''
    Perdente.classList.add('loser')
    Perdente.innerHTML = 'Perde'

}

function normAnimBtn(){

    var giocatore1 = document.getElementById('giocatore1Btn')
    var giocatore2 = document.getElementById('giocatore2Btn')

    giocatore1.className = ''
    giocatore1.classList.add('normal')
    giocatore1.innerHTML = 'Vince'

    giocatore2.className = ''
    giocatore2.classList.add('normal') 
    giocatore2.innerHTML = 'Vince'
}




// Edit Match

function editMatch(match) {
    
    var giocatore1 = document.getElementById('giocatore1Inp')
    var giocatore2 = document.getElementById('giocatore2Inp')
    var scontro = []

    matchStr = match.innerHTML

    if (matchStr.split('').includes('\uDFC6')) {



        /**
        var tempArr = matchStr.split('')

        if (tempArr[tempArr.indexOf('\uDFC6') + 2] == ' ') {
           delete tempArr[tempArr.indexOf('\uDFC6') + 2] 
        }

        delete tempArr[tempArr.indexOf('\uDFC6') + 1]
        delete tempArr[tempArr.indexOf('\uDFC6') - 1]
        delete tempArr[tempArr.indexOf('\uDFC6')]

        tempArr = tempArr.filter(Boolean)
        
        matchStr = tempArr.join('')
         */
    } else {
        scontro.push(matchStr.split(' ')[0])
        scontro.push(matchStr.split(' ')[2])

        giocatore1.value = scontro[0]
        giocatore2.value = scontro[1] 
    }





}



// Win


function vinceBtn(vince, perde) {

    var Vincente = document.getElementById('giocatore' + vince + 'Inp')
    var Perdente = document.getElementById('giocatore' + perde + 'Inp')

    if (Vincente.value == '') {
        return
    }

    if (scontri.daGiocare.indexOf(Vincente.value + ' vs ' + Perdente.value) != -1) {

        delete scontri.daGiocare[scontri.daGiocare.indexOf(Vincente.value + ' vs ' + Perdente.value)]

        scontri.Giocate.push('🏆‎' + Vincente.value + ' vs ' + Perdente.value)

    } else {

        delete scontri.daGiocare[scontri.daGiocare.indexOf(Perdente.value + ' vs ' + Vincente.value)]

        scontri.Giocate.push(Perdente.value + ' vs 🏆‎ ' + Vincente.value)

    }

    scontri.daGiocare = scontri.daGiocare.filter(Boolean)

    AddToList(scontri.daGiocare)
    UpadteStorage()
    UpadteDiagram()
    Classifica(scontri.Giocate)

    Vincente.value = '';
    Perdente.value = '';
}









// Saving


function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}

function UpadteStorage() {

    var ScontridaGiocare = scontri.daGiocare
    var ScontridaGiocareRaw = []
    var ScontriGiocate = scontri.Giocate

    for (let i = 0; i < scontri.daGiocare.length; i++) {

        ScontridaGiocareRaw.push(scontri.daGiocare[i].split(' ')[0])
        ScontridaGiocareRaw.push(scontri.daGiocare[i].split(' ')[2])

    }

    ScontridaGiocareRaw = removeDuplicates(ScontridaGiocareRaw)

    for (let i = 0; i < scontri.Giocate.length; i++) {

        ScontridaGiocareRaw.push(scontri.Giocate[i].split(' ')[0])
        ScontridaGiocareRaw.push(scontri.Giocate[i].split(' ')[2])

    }

    ScontridaGiocareRaw = removeDuplicates(removeDuplicates(ScontridaGiocareRaw).join(',').replaceAll('🏆‎','').split(',')).filter(Boolean).sort(collator.compare).join(',')

    data = {
        daGiocare: ScontridaGiocare.filter(Boolean),
        Giocate: ScontriGiocate.filter(Boolean),
        Raw: ScontridaGiocareRaw
    }

    SaveData(document.getElementById('classeTitle').innerHTML , JSON.stringify(data))
}



// Diagram

function UpadteDiagram() {
    var DaGiocare = scontri.daGiocare.length
    var Giocate = scontri.Giocate.length

    var ColonnaDaGiocare = (DaGiocare / (DaGiocare + Giocate)) * 100
    var ColonnaGiocate = (Giocate / (DaGiocare + Giocate)) * 100

    document.getElementById('ColonnaDaGiocare').style.height = ColonnaDaGiocare + '%'
    document.getElementById('ColonnaGiocate').style.height = ColonnaGiocate + '%'

    document.getElementById('ColonnaDaGiocare').title = DaGiocare
    document.getElementById('ColonnaGiocate').title = Giocate
}




// Reset

function ResetEvento() {
    localStorage.clear()
    scontri.daGiocare = []
    scontri.Giocate = []
}

function openPopup(type) {
    document.body.innerHTML += '<div class="block" onclick="closePopup()"></div>' + popup[type]
}

function closePopup() {
    document.getElementsByClassName('block')[0].remove()
    document.getElementsByClassName('popup')[0].remove()
    SetAtLunch()
}



// Classifica

function Classifica(arr) {

    var risultati = []
    var ClassificaPlayers = []
    var Origtemp = []

    for (let i = 0; i < arr.length; i++) {

        var partita = arr[i].replaceAll(' ', '').split('')

        risultati.push(partita.slice(partita.indexOf('\uDFC6') + 2).join('').split('vs')[0])

    }

    Origtemp = [...risultati]

    ClassificaPlayers = SortForMostDup(risultati)

    document.getElementById('Classifica').innerHTML = ''

    for (let idx = 0; idx < ClassificaPlayers.length; idx++) {

        var wins = getOccurrence(Origtemp, ClassificaPlayers[idx])

        document.getElementById('Classifica').innerHTML += '<div><p title="Giocatore: ' + ClassificaPlayers[idx] + '">' + ClassificaPlayers[idx] + '</p><p title="Vinte: ' + wins + '">🏆‎ <b>' + wins + '</b></p></div>'
        
    }


}

function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}

function SortForMostDup(arr) {

    var res = []

    iterations = Unique(arr).length

    for (let i = 0; i < iterations; i++) {

        var MostDup = MostDupliacte(arr)

        res.push(MostDup)

        arr = RemoveElement(arr, String(MostDup))
        
    }

    return res
}

function Unique(arr) {
    let unique = [];
    for (i = 0; i < arr.length; i++) {
        if (unique.indexOf(arr[i]) === -1) {
            unique.push(arr[i]);
        }
    }
    return unique;
}


function RemoveElement(arr, element) {

    while (arr.includes(element)) {
        delete arr[arr.indexOf(element)]
    }

    return arr.filter(Boolean)
}


function MostDupliacte(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop()
}



// Saving setup

function AddClasse() {
    var ClasseName = document.getElementById('ClasseName').value

    if (ClasseName == '') {
        return
    }

    console.log(ClasseName);

    const newClasse = {
        daGiocare: [],
        Giocate: [],
        Raw: ''
    }

    SaveData(ClasseName, JSON.stringify(newClasse))

    document.getElementById('DropClasse').innerHTML += '<a onclick="LoadClasse(\'' + ClasseName + '\'); ToogleDropdown()">' + ClasseName + '</a>'

    closePopup()
}

function ToogleDropdown() {
    document.getElementById("DropClasse").classList.toggle("show");  
}

async function AddToDropDown() {

    let classiOrig = await fs.readdir(__dirname + "/classi")
    let classi = []
    classiOrig.forEach(function(e,i){classi.push(e.slice(0, classiOrig[i].length - 5))})

    document.getElementById('DropClasse').innerHTML = ''

    for (let i = 0; i < classi.length; i++) {
        document.getElementById('DropClasse').innerHTML += '<a onclick="LoadClasse(\'' + classi[i] + '\'); ToogleDropdown()">' + classi[i] + '</a>'
    }

}


function SaveData(ClasseName, data) {

    fs.writeFile('rendered\\classi\\' + ClasseName + '.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

async function LoadData(ClasseName) {

    try {
        const result = await fs.readFile(__dirname + '\\classi\\' + ClasseName + '.json', 'utf8');
        return JSON.parse(result)
     } catch(e) {
        console.error(e);
     }
}