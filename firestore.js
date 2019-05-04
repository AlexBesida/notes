var notes = new Array(); var data = new Array();

function CreateNote(){
    var title = document.getElementById("add-note-title").value;
    var description = document.getElementById("add-note-description").value;
    document.getElementById("add-note-window").style.visibility = "hidden";
    AddNote(title, description);
}

function AddNote(title, description){
    var db = firebase.firestore();

    db.collection("gnotes").add({
        title: title,
        description: description,
        date: new Date().getDate()+"."+(new Date().getMonth()+1)+"."+new Date().getFullYear(),
        time: new Date().getHours()+":"+new Date().getMinutes(),
        version: app_info.version,
        versionReleased: app_info.version_released,
        added: "guest"
    });
    
    console.clear();
    db.collection("gnotes").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id,doc.data());
        });
    });
    LoadNotes(true);
}

// Read from here

async function LoadNotes(reload){
    var db = firebase.firestore();
    
    if (reload==true){ for (var i=1; i<=notes.length; i++){ var element = document.getElementById(notes[i-1]+"Mobile"); element.parentNode.removeChild(element); } }

    data = new Array(); notes = new Array();

    /*await db.collection("gnotes").get().then((querySnapshot) => { 
        querySnapshot.forEach((doc) => { 
            console.log(doc.id,doc.data()); 
            notes.push(doc.id); 
            data.push(doc.data()); 
        }); 
    });*/

    db.collection("gnotes").onSnapshot({ includeMetadataChanges: true }, function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            var source = snapshot.metadata.fromCache ? "local cache" : "server";
            console.log(change.doc.id,source,change.doc.data()); 
            notes.push(change.doc.id); data.push(change.doc.data()); 
            RenderNote(notes.length);
        });
    });
}

function RenderNote(i){
    var NoteCard = document.createElement("div");
    //NoteCard.style.width = ((document.getElementById('body').offsetWidth)-40)+"px";
    NoteCard.style.height = "56px";
    NoteCard.style.position = "absolute";
    NoteCard.style.left = "20px";
    NoteCard.style.right = "20px";
    NoteCard.style.top = (76*i+20)+"px";
    NoteCard.setAttribute('class', 'FluxAppLiteCard');
    NoteCard.setAttribute('id', notes[i-1]+"Mobile");

    document.getElementById("NoteList").appendChild(NoteCard);

    var NoteTitle = document.createElement("p");
    x=data[i-1];
    NoteTitle.innerHTML = x.title;
    NoteTitle.setAttribute('class', 'FluxAppLiteCardP');
    NoteTitle.setAttribute('id', notes[i-1]+"MobileP");

    document.getElementById(notes[i-1]+"Mobile").appendChild(NoteTitle);
}