/**
 * Created by Dave on 9/24/2016.
 */

var itemNum = 0;

$('.dropOnly').droppable( {
    drop: handleDropEvent
});

$(document).ready(function(){
    $('#inputField').keypress(function(e){
        if(e.keyCode==13)
            $('#button').click();
    });
});

//Add Close buttons to items
var lists = document.getElementsByTagName("LI");

 for (var i = 0; i < lists.length; i++) {
     var span = document.createElement("SPAN");
     var txt = document.createTextNode("\u00D7");
     span.className = "close";
     span.appendChild(txt);
     lists[i].appendChild(span);
 }

// Add Close button function
var close = document.getElementsByClassName("close");

for (var i = 0; i < close.length; i++) {
     close[i].onclick = function() {
     var div = this.parentElement;
     div.style.display = "none";
 }
 }

// Create a new list item when clicking on the "Add" button
function newElement() {
    itemNum++;

    var div = document.createElement("DIV");
    div.id = ("item" + itemNum);
    div.className = "draggableClass";

    var li = document.createElement("li");
    var inputValue = document.getElementById("inputField").value;
    var t = document.createTextNode(inputValue);

    li.appendChild(t);
    div.appendChild(li);

    document.getElementById("myUL").appendChild(div);
    document.getElementById("inputField").value = "";

    // Create Close button
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
    span.onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
        };

    setDragDrop();
}

function handleDragStop( event, ui ) {
    // must be implemented?
}

function handleDropEvent( event, ui ) {
    var draggable = ui.draggable;

    parentSnap(event.target,draggable);
}

function handleTopLevelDropEvent( event, ui ) {
    var draggable = ui.draggable;

    parentSnapTopLevel(event.target,draggable);
}

// Snap and nest dropped items below their parent
function parentSnap(droppedOn, droppedElement)
{
    var parentID = droppedOn.id;
    var parentHTML = "<div class='draggableClass' id='parentID'>" + $(droppedOn).html() + "</div>";
    var childID = droppedElement.attr('id');
    var childHTML = "<div class='droppedContainer'><div class='draggableClass' data-childOf='" + parentID + "' id='" + childID + "'>" + $(droppedElement).html() + "</div></div>";
    var allDivs = document.getElementsByTagName("DIV");

    var testHTML = "<div background-color='black' class='mainLevelDrop'>test</div>"; // BEGINNING OF LINE FOR DROPPING IN BETWEEN THINGS

    // Find nested items of dropped item
    for (var a = 0; a < allDivs.length; a++) {

        if($(allDivs[a]).data( "childOf" ) == childID) {
            var thisDiv = allDivs[a];
            var thisDivID = thisDiv.id;
            var subChildHTML = "<div class='droppedContainerChild'><div class='draggableClass' data-childOf='" + childID + "' id='" + thisDivID + "'>" + $(thisDiv).html() + "</div></div>";

            $(thisDiv).remove();
        }
    }

    // Re-create dropped item and its children
    if(subChildHTML == undefined){
        var clonedItem = $(droppedOn).after(parentHTML + testHTML + childHTML); //ADD TESTHTML HERE FOR THE LINE IN BETWEEN THINGS
    }
    else {
        var clonedItem = $(droppedOn).after(parentHTML + testHTML + childHTML + subChildHTML); //ADD TESTHTML HERE FOR THE LINE IN BETWEEN THINGS
    }

    $(droppedElement).remove();
    $(droppedOn).remove();

    // Add close button function to re-created item
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            var div = this.parentElement;
            div.style.display = "none";
        }
    }

    setDragDrop();


}

// Return dropped item and its children to top level
function parentSnapTopLevel(droppedOn, droppedElement)
{
    var parentID = droppedOn.id;
    var childID = droppedElement.attr('id');
    var childHTML = "<div class='draggableClass' data-childOf='" + parentID + "' id='" + childID + "'>" + $(droppedElement).html() + "</div>";
    var allDivs = document.getElementsByTagName("DIV");

    // Find nested items of dropped item
    for (var a = 0; a < allDivs.length; a++) {

        if($(allDivs[a]).data( "childOf" ) == childID) {
            var thisDiv = allDivs[a];
            var thisDivID = thisDiv.id;
            var subChildHTML = "<div class='droppedContainer'><div class='draggableClass' data-childOf='" + childID + "' id='" + thisDivID + "'>" + $(thisDiv).html() + "</div></div>";

            $(thisDiv).remove();
        }
    }

    // Re-create dropped item and its children
    if(subChildHTML == undefined){
        var clonedItem = $(droppedOn).after(childHTML);
    }
    else {
        var clonedItem = $(droppedOn).after(childHTML + subChildHTML);
    }

    // Add close button function to re-created item
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            var div = this.parentElement;
            div.style.display = "none";
        }
    }

    setDragDrop();

    $(droppedElement).remove();
}

function setDragDrop(){
    $('.draggableClass').draggable( {
        containment: '#myUL',
        stop: handleDragStop
    } );

    $('.draggableClass').droppable( {
        drop: handleDropEvent
    });

    $('.dropOnly').droppable( {
        drop: handleTopLevelDropEvent
    });

    $('.dropOnly').draggable( {
        containment: 'parent',
        stop: handleDragStop
    } );
}



function listTypeDropdown(caller) {
  //  alert(caller.id);


    if(caller.id == 'dropdownBullet') {
        document.getElementById('dropdownBulletList').classList.toggle("show");
    }
    else if (caller.id == 'dropdownFont') {
        document.getElementById('dropdownFontList').classList.toggle("show");
    }
}



// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");

        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};



function selectListType(caller) {

    if(caller.id == "listNone") {
        document.getElementById("myUL").style.listStyle = "none";
    }
    else if(caller.id == "listSquare") {
        document.getElementById("myUL").style.listStyle = "square";
    }
    else if(caller.id == "listCircle") {
        document.getElementById("myUL").style.listStyle = "circle";
    }
    else if(caller.id == "listFont1") {
        document.getElementById("myUL").style.fontFamily = "Lucida Console, Monaco, monospace";
        document.getElementById("button").style.fontFamily = "Lucida Console, Monaco, monospace";
        document.getElementById("inputField").style.fontFamily = "Lucida Console, Monaco, monospace";
        document.getElementById("headerDiv").style.fontFamily = "Lucida Console, Monaco, monospace";
    }
    else if(caller.id == "listFont2") {
        document.getElementById("myUL").style.fontFamily = "Comic Sans MS, cursive, sans-serif";
        document.getElementById("button").style.fontFamily = "Comic Sans MS, cursive, sans-serif";
        document.getElementById("inputField").style.fontFamily = "Comic Sans MS, cursive, sans-serif";
        document.getElementById("headerDiv").style.fontFamily = "Comic Sans MS, cursive, sans-serif";
    }
    else if(caller.id == "listFont3") {
        document.getElementById("myUL").style.fontFamily = "Times New Roman, Times, serif";
        document.getElementById("button").style.fontFamily = "Times New Roman, Times, serif";
        document.getElementById("inputField").style.fontFamily = "Times New Roman, Times, serif";
        document.getElementById("headerDiv").style.fontFamily = "Times New Roman, Times, serif";
    }

    //addbtn, Input, Header

}

