var draggable = document.querySelectorAll('.draggedItems');
var droppable = document.querySelectorAll('.droppedItems');
var started = false;
var startTime;
var popupShows = false;
var script = document.querySelector('script');
var text = document.querySelector('.text p');
var dragArea = document.querySelector('.dragArea');

createCards();

// This creates random divs and appends to draggedArea
function createCards(){
    var numbers = [1,2,3,4,5,6,7,8];
    numbers = shuffle(numbers);
    for(var i = 0; i < numbers.length; i++){
        var draggedItem = document.createElement('div');
        draggedItem.classList.add("draggedItems");
        draggedItem.setAttribute("draggable", true);
        draggedItem.setAttribute("id", "drag"+numbers[i]);

        var span = document.createElement('span');
        span.innerHTML = numbers[i];
        draggedItem.appendChild(span);
        dragArea.appendChild(draggedItem);
    }

    draggable = document.querySelectorAll('.draggedItems');
}


// Random array creator
function shuffle(array) {
    var i = array.length,
        j = 0,
        temp;

    while (i--) {

        j = Math.floor(Math.random() * (i+1));

        // swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }

    return array;
}

var ranNums = shuffle([1,2,3,4,5,6,7,8,9,10]);

// Add drag events to dragged items
for (var i = 0; i < draggable.length; i++) {
    var element = draggable[i];

    element.addEventListener("dragstart", function (e) {
        this.classList.add("dragging");
        e.dataTransfer.setData("draggedElementId", this.getAttribute("id"));

        //For starting time
        if (!started) {
            startTime = new Date();
            started = true;
            text.style.display = "inline-block";
        }
    })

    element.addEventListener("dragend", function (e) {
        this.classList.remove("dragging");
    });

    // element.addEventListener("drag", function(){
    //     console.log(j);
    //     j++;
    //     this.classList.add("green");
    // })

    // element.addEventListener("dragend", function(){
    //     this.classList.remove("green");
    // })
}

// Add drop events to drop divs
for (var i = 0; i < droppable.length; i++) {
    var element = droppable[i];

    element.addEventListener("dragover", function (e) {
        e.preventDefault();
    })

    element.addEventListener("drop", function (e) {
        e.preventDefault();
        var elementId = e.dataTransfer.getData("draggedElementId");
        var draggedElement = document.querySelector('#' + elementId);
        draggedElement.classList.remove("dragging");
        if (this.children.length == 0) {
            this.appendChild(draggedElement);
        }
        checkGame();
    })
}

// This checks of game ended
function checkGame() {
    var gameEnd = true;

    for (var i = 0; i < droppable.length; i++) {
        if (droppable[i].children.length == 0) {
            gameEnd = false;
            break;
        }
    }

    for (var i = 1; i <= droppable.length; i++) {
        var innerElement = droppable[i - 1].children[0];
        if (innerElement) {
            if (innerElement.getAttribute("id") != "drag" + i) {
                gameEnd = false;
                break;
            }
        } else {
            gameEnd = false;
            break;
        }
    }

    if (gameEnd) {
        var endTime = new Date();
        var difference = (endTime.getTime() - startTime.getTime()) / 1000;
        difference = Math.round(difference * 10)/10;
        showModal(difference);

    }

}
// This shows congratulations
function showModal(time) {

    var popup = document.createElement('div');
    popup.classList.add("popup");

    var close = document.createElement('i');
    close.classList.add("fa", "fa-close");

    var header = document.createElement('h1');
    header.innerHTML = "Congratulations! <br /> You finished game in <span>" + time + "</span> seconds. <br /> Press <span>F5</span> to play one more time."

    close.onclick = function () {
        popup.remove();
        popupShows = false;
    }

    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 27) {
            popup.remove();
            popupShows = false;
        }
    })

    popup.appendChild(close);
    popup.appendChild(header);

    document.body.insertBefore(popup, script);
    popupShows = true;
}