/**
 * Created by Dave on 9/24/2016.
 */

function editItem() {
    var editableItem = $("<textarea />");
    editableItem.val($(this).text().slice(0, -2));
    $(this).replaceWith(editableItem);
    editableItem.focus();
    editableItem.select();
    editableItem.blur(editableItemBlurred);

    $(editableItem).keypress(function(e){
        if(e.which == 13){
            $(editableItem).blur();
            return false;
        }
    });

    /*
    $(document).keypress(function(e) {
        if(e.which == 13) {
            editableItemBlurred();
        }
    }); */
}

function editableItemBlurred() {

    var editableItemValue = $(this).val();
    var editableItemValue = editableItemValue;
    var div = document.createElement("DIV");
   // alert("got there");
   // div.html(editableItemHTML);

    div.className = "draggableClass";
    div.click(editItem);

    var li = document.createElement("li");
    var t = document.createTextNode(editableItemValue);

    li.appendChild(t);
    div.appendChild(li);

    // Create Close button
    var closeSpan = document.createElement("SPAN");
    var closeTxt = document.createTextNode("\u00D7");
    closeSpan.className = "close";
    closeSpan.appendChild(closeTxt);
    li.appendChild(closeSpan);
    closeSpan.onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
    };

    // Create Add button
    var addSpan = document.createElement("SPAN");
    var addTxt = document.createTextNode("\u002B");
    addSpan.className = "add";
    addSpan.appendChild(addTxt);
    li.appendChild(addSpan);
    addSpan.onclick = function() {
        newElement("Enter Item...");
    };


    $(this).replaceWith(div);



    setDragDrop();
    $(".draggableClass").dblclick(editItem);

    /*
    var closeSpan = document.createElement("SPAN");
    var closeTxt = document.createTextNode("\u00D7");
    closeSpan.className = "close";
    closeSpan.appendChild(closeTxt);
    spanHTML = $(closeSpan).html();
    $(div).after(spanHTML);
    closeSpan.onclick = function() {
        var thisDiv = this.parentElement;
        thisDiv.style.display = "none";
    };
    //test
    $(this).replaceWith(div);
    // setup the click event for this new div
    div.click(editItem);
*/
}


var itemNum = 0;

 /* $('.dropOnly').droppable( {
    drop: handleDropEvent
}); */


// Initial setup
$(document).ready(function(){
    // Create initial text element
    newElement("Enter Text...");
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
function newElement(elementText) {
    itemNum++;

    var div = document.createElement("DIV");
    div.id = ("item" + itemNum);
    div.className = "draggableClass";

    var mainLevelDropDiv = document.createElement("DIV");
    mainLevelDropDiv.className = "dropOnly";
    $(mainLevelDropDiv).data( "childOf", div.id );

    var li = document.createElement("li");
    var t = document.createTextNode(elementText);

    li.appendChild(t);
    div.appendChild(li);

    document.getElementById("myUL").appendChild(div);
    document.getElementById("myUL").appendChild(mainLevelDropDiv);
    //document.getElementById("inputField").value = "";

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

    // Create Add button
    var addSpan = document.createElement("SPAN");
    var addTxt = document.createTextNode("\u002B");
    addSpan.className = "add";
    addSpan.appendChild(addTxt);
    li.appendChild(addSpan);
    addSpan.onclick = function() {
        newElement("Enter Item...");
    };

    setDragDrop();
    $(".draggableClass").dblclick(editItem);
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

    event.target.style.backgroundColor = "white";

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

    // Find nested items of dropped item
    for (var a = 0; a < allDivs.length; a++) {

        if($(allDivs[a]).data( "childOf" ) == childID) {
            var thisDiv = allDivs[a];
            var thisDivID = thisDiv.id;
            var subChildHTML = "<div class='droppedContainerChild'><div class='draggableClass' data-childOf='" + childID + "' id='" + thisDivID + "'>" + $(thisDiv).html() + "</div></div>";

            $(thisDiv).remove();
        }
    }

    var mainDropHTML = "<div class='dropOnly'></div>";

    // Re-create dropped item and its children
    if(subChildHTML == undefined){
        var clonedItem = $(droppedOn).after(parentHTML + mainDropHTML + childHTML);
    }
    else {
        var clonedItem = $(droppedOn).after(parentHTML + mainDropHTML + childHTML  + subChildHTML);
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
    $(".draggableClass").dblclick(editItem);

}

// Return dropped item and its children to top level
function parentSnapTopLevel(droppedOn, droppedElement)
{
    var parentID = droppedOn.id;
    var childID = droppedElement.attr('id');
    var childHTML = "<div class='draggableClass' id='" + childID + "'>" + $(droppedElement).html() + "</div>";
    //var childHTML = "<div class='draggableClass' data-childOf='" + parentID + "' id='" + childID + "'>" + $(droppedElement).html() + "</div>";
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

    var mainDropHTML = "<div class='dropOnly'></div>";

    // Re-create dropped item and its children
    if(subChildHTML == undefined){
        var clonedItem = $(droppedOn).after(childHTML + mainDropHTML);
    }
    else {
        var clonedItem = $(droppedOn).after(childHTML + mainDropHTML + subChildHTML);
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
    $(".draggableClass").dblclick(editItem);
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
        drop: handleTopLevelDropEvent,
        over: function( event, ui ) {
            event.target.style.backgroundColor = "#000000";
        },
        out: function( event, ui ) {
            event.target.style.backgroundColor = "white";
        }
    });

    $('.dropOnly').draggable( {
        containment: 'parent',
        stop: handleDragStop
    } );
}


function listTypeDropdown(caller) {
    if(caller.id == 'dropdownBullet') {
        document.getElementById('dropdownBulletList').classList.toggle("show");
    }
    else if (caller.id == 'dropdownFont') {
        document.getElementById('dropdownFontList').classList.toggle("show");
    }
}


// Close the dropdown menus when clicked elsewhere
window.onclick = function(event) {

    var dropdowns = document.getElementsByClassName("dropdown-content");

    if (!event.target.matches('#dropdownBullet')) {

        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];

            if (openDropdown.id == "dropdownBulletList" && openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }

    if (!event.target.matches('#dropdownFont')) {

        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];

            if (openDropdown.id == "dropdownFontList" && openDropdown.classList.contains('show')) {
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



    }
    else if(caller.id == "listFont2") {
        document.getElementById("myUL").style.fontFamily = "Comic Sans MS, cursive, sans-serif";



    }
    else if(caller.id == "listFont3") {
        document.getElementById("myUL").style.fontFamily = "Times New Roman, Times, serif";



    }

    //addbtn, Input, Header

}

