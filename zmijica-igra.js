$(document).ready(function() {

    let documentHeight = $(document).height();
    let documentWidth = $(document).width();
    let elementsMargin; let scaledh1FontSize;
    let movmentFlag = "UP"; let snake;
    let snakeStartHandle = null;
    let superFoodActivateHandle = null;
    var screenWidth = 700; var screenHeight = 500;
    var numberOfHorizontalTiles = parseInt(sessionStorage.getItem("sirina"));
    var numberOfVerticalTiles = parseInt(sessionStorage.getItem("visina"));

    numberOfHorizontalTiles = (numberOfHorizontalTiles < 2) ? 2 : numberOfHorizontalTiles;
    numberOfHorizontalTiles = (numberOfHorizontalTiles < 500) ? numberOfHorizontalTiles : 500;
    numberOfVerticalTiles = (numberOfVerticalTiles < 2) ? 2 : numberOfVerticalTiles;
    numberOfVerticalTiles = (numberOfVerticalTiles < 50) ? numberOfVerticalTiles : 50;

    //var numberOfHorizontalTiles = 5; var numberOfVerticalTiles = 5;
    //var snakeSpeed = 0.1;  // tiles per 25ms
    //var snakeSpeed = 0.05;;  // tiles per 5ms
    var snakeSpeed = parseFloat(sessionStorage.getItem("brzina"));
    var superFoodMakesMoreSnake = "active";


        
    let currentBestScore = parseInt(localStorage.getItem("bestScore"));
    setBest(currentBestScore);

    class TailNode {
        constructor(posX, posY) {
            this.posX = posX;
            this.posY = posY;
            this.next = this;
            this.prev = this;
        }
        addNextNode(nextNode) {
            nextNode.next = this.next;
            nextNode.prev = this;
            this.next = nextNode;
            if (nextNode.next != null)
                nextNode.next.prev = nextNode;
        }
        addPrevNode(prevNode) {
            prevNode.next = this;
            prevNode.prev = this.prev;
            this.prev = prevNode;
            if (prevNode.prev != null)
                prevNode.prev.next = prevNode;
        }
        popNextNode() {
            if (this.next == this) return null;
            let ret = this.next;
            this.next = ret.next;
            ret.next.prev = this;
            ret.next = null;
            ret.prev = null;
            return ret;
        }
        popPrevNode() {
            if (this.prev == this) return null;
            let ret = this.prev;
            this.prev = ret.prev;
            ret.prev.next = this;
            ret.next = null;
            ret.prev = null;
            return ret;
        }
    }

    class Snake {
        constructor(startPosX, startPosY) {
            this.posX = startPosX;
            this.posY = startPosY;
            this.size = 0;
            // header node
            this.tailPointer = new TailNode(null, null);    // cercular linked list
            // add head
            this.newHead(startPosX, startPosY);
        }
        newHead(posX, posY) {
            let newNode = new TailNode(posX, posY);
            this.size += 1;
            this.tailPointer.addNextNode(newNode);
            $("table#gameTable").find("tr#" + posY).find("td#" + posX).css({
                "background-color": "#2F8CD3",
            }).attr("name", "snakeField");
            
        }
        newTail(posX, posY) {
            let newNode = new TailNode(posX, posY);
            this.size += 1;
            this.tailPointer.addPrevNode(newNode);
            $("table#gameTable").find("tr#" + posY).find("td#" + posX).css({
                "background-color": "#2F8CD3",
            }).attr("name", "snakeField");
        }
        popTail() {
            let tailNode = this.tailPointer.popPrevNode();
            this.size -= 1;
            setTileColor(tailNode.posX, tailNode.posY);
            $("table#gameTable").find("tr#" + tailNode.posY).find("td#" + tailNode.posX).attr("name", "");
            return tailNode;
        }
        initialSnakeDraw() {
            let iter = this.tailPointer.next;
            let table = $("table#gameTable");
            while (iter != this.tailPointer) {
                table.find("tr#" + iter.posY).find("td#" + iter.posX)
                     .css("background-color", "#2F8CD3").attr("name", "snakeField");
                iter = iter.next;
            }
        }
        getHeadNode() {
            return this.tailPointer.next; }
        getTailNode() {
            return this.tailPointer.prev; }
        getX() {
            return this.tailPointer.next.posX; }
        getY() {
            return this.tailPointer.next.posY; }
        moveTo(newX, newY) {
            this.newHead(newX, newY); this.popTail(); }
        moveToFood(newX, newY) {
            this.newHead(newX, newY); }
        getSize() {
            return this.size; }
        getTailPointer() {
            return this.tailPointer; }
        reverse() {
            let iter = this.tailPointer.next;
            while (iter != this.tailPointer) {
                let curr = iter; iter = iter.next
                let prev = curr.prev;
                curr.prev = curr.next;
                curr.next = prev;
            }
            let prev = iter.prev;
            iter.prev = iter.next;
            iter.next = prev;
        }
    }


    /* BACKGROUND SNAKE */

    let horizontalTileNumber = 30;
    let vertiacalTileNumber = 30;

    class BackgroundSnake {
        constructor(startPosX, startPosY) {
            this.posX = startPosX;
            this.posY = startPosY;
            this.size = 0;
            // header node
            this.tailPointer = new TailNode(null, null);    // cercular linked list
            // add head
            this.newHead(startPosX, startPosY);
        }
        newHead(posX, posY) {
            let newNode = new TailNode(posX, posY);
            this.size += 1;
            this.tailPointer.addNextNode(newNode);
            $("table#uputstvoTable").find("tr#" + posY).find("td#" + posX).css({
                "background-color": "#2F8CD3",
            }).attr("name", "snakeField");
            
        }
        newTail(posX, posY) {
            let newNode = new TailNode(posX, posY);
            this.size += 1;
            this.tailPointer.addPrevNode(newNode);
            $("table#uputstvoTable").find("tr#" + posY).find("td#" + posX).css({
                "background-color": "#2F8CD3",
            }).attr("name", "snakeField");
        }
        popTail() {
            let tailNode = this.tailPointer.popPrevNode();
            this.size -= 1;
            setTileColorBackground(tailNode.posX, tailNode.posY);
            $("table#uputstvoTable").find("tr#" + tailNode.posY).find("td#" + tailNode.posX).attr("name", "");
            return tailNode;
        }
        initialSnakeDraw() {
            let iter = this.tailPointer.next;
            let table = $("table#uputstvoTable");
            while (iter != this.tailPointer) {
                table.find("tr#" + iter.posY).find("td#" + iter.posX)
                     .css("background-color", "#2F8CD3").attr("name", "snakeField");
                iter = iter.next;
            }
        }
        getHeadNode() {
            return this.tailPointer.next; }
        getTailNode() {
            return this.tailPointer.prev; }
        getX() {
            return this.tailPointer.next.posX; }
        getY() {
            return this.tailPointer.next.posY; }
        moveTo(newX, newY) {
            this.newHead(newX, newY); this.popTail(); }
        moveToFood(newX, newY) {
            this.newHead(newX, newY); }
        getSize() {
            return this.size; }
        getTailPointer() {
            return this.tailPointer; }
        reverse() {
            let iter = this.tailPointer.next;
            while (iter != this.tailPointer) {
                let curr = iter; iter = iter.next
                let prev = curr.prev;
                curr.prev = curr.next;
                curr.next = prev;
            }
            let prev = iter.prev;
            iter.prev = iter.next;
            iter.next = prev;
        }
        checkTail(x, y) {
            return $("table#uputstvoTable").find("tr#" + y).find("td#" + x).attr("name") == "snakeField";
        }
        getRandomFreePozition() {
            let snakeHeadX = this.getX();
            let snakeHeadY = this.getY();
            let freePosArray = [];
            if (!this.checkTail((snakeHeadX - 1 + horizontalTileNumber) % horizontalTileNumber, snakeHeadY))
                freePosArray.push({"x" : (snakeHeadX - 1 + horizontalTileNumber) % horizontalTileNumber, "y" : snakeHeadY});
            if (!this.checkTail((snakeHeadX + 1) % horizontalTileNumber, snakeHeadY)) {
                freePosArray.push({"x" : (snakeHeadX + 1) % horizontalTileNumber, "y" : snakeHeadY});
            }
            if (!this.checkTail(snakeHeadX, (snakeHeadY - 1 + vertiacalTileNumber) % vertiacalTileNumber)) {
                freePosArray.push({"x" : snakeHeadX, "y" : (snakeHeadY - 1 + vertiacalTileNumber) % vertiacalTileNumber});
            }
            if (!this.checkTail(snakeHeadX, (snakeHeadY + 1) % vertiacalTileNumber)) {
                freePosArray.push({"x" : snakeHeadX, "y" : (snakeHeadY + 1) % vertiacalTileNumber});
            }
            if (freePosArray.length == 0) return null;
            return freePosArray[Math.floor(Math.random() * freePosArray.length)];
        }
    }

    function setTileColorBackground(i, j) {
        let tileColor = ((i + j) % 2 ? "#263445" : "#1E2836");
        $("table#uputstvoTable").find("tr#" + j).find("td#" + i).css({
            "background-color": tileColor,
        });
    }
    /* /BACKGROUND SNAKE */

    function documentHeightPercent(p) {
        return documentHeight * p / 100;
    }

    function documentWidthPercent(p) {
        return documentWidth * p / 100;
    }

    function screenHeightPercent(p) {
        return screenHeight * p / 100;
    }

    function screenWidthPercent(p) {
        return screenWidth * p / 100;
    }

    function fontScaleFactor() {
        return scaledh1FontSize / 32;
    }

    function setScreenWidth() {
        documentHeight = $(document).height();
        documentWidth = $(document).width();
        elementsMargin = (documentWidth - screenWidth) / 2;
        scaledh1FontSize = 32;  // h1 font size original
        let diff = documentWidth - screenWidth;
        scaledh1FontSize = scaledh1FontSize + 0.5 * scaledh1FontSize * (diff) / ((diff > 0) ? documentWidth : screenWidth);
    }

    function setTileColor(i, j) {
        let tileColor = ((i + j) % 2 ? "#263445" : "#1E2836");
        $("table#gameTable").find("tr#" + j).find("td#" + i).css({
            "background-color": tileColor,
        });
    }

    function setPageStyles() {
        $("body").css("background-color", "#263445");
        $("h1#now").css({
            "position": "absolute",
            "top" : screenHeightPercent(5 * fontScaleFactor()) + "px",
            "left" : elementsMargin + screenWidthPercent(15) + "px",
            "float" : "left",
            "color" : "#BFC9D5",
            "font-size" : scaledh1FontSize + "px"
        });

        $("h1#best").css({
            "position": "absolute",
            "top" : screenHeightPercent(5 * fontScaleFactor()) + "px",
            "left" : elementsMargin + screenWidthPercent(70) + "px",
            "float": "left",
            "color" : "#BFC9D5",
            "font-size" : scaledh1FontSize + "px"
        });

        let tileColor = "#263445";
        let tileHeight = screenHeightPercent(90) / numberOfVerticalTiles;
        let tileWidth = screenWidthPercent(90) / numberOfHorizontalTiles;
        let table = $("table#gameTable");
        for (let i = 0; i < numberOfVerticalTiles; ++i) {
            for (let j = 0; j < numberOfHorizontalTiles; ++j) {
                table.find("tr#" + i).find("td#" + j).css({
                    "width" : "" + tileWidth,
                    "height" : "" + tileHeight,
                });
                setTileColor(j, i);
            }
        }
        table.css({
            'border' : '3px solid #B0BAC6',
            "position" : "absolute",
            "top" : screenHeightPercent(20 * fontScaleFactor()) + "px", // 25
            "left" : elementsMargin + "px",

        });
    }

    function setNow(newNow=0) {
        $("h1#now")[0].innerHTML = "Now: " + newNow;
    }
    function getNow() {
        return parseInt($("h1#now")[0].innerHTML.replace("Now: ", ""));
    }


    function setBest(newBest=0) {
        $("h1#best")[0].innerHTML = "Best: " + newBest;
    }
    function getBest() {
        return parseInt($("h1#Best")[0].innerHTML.replace("Best: ", ""));
    }

    function createTable() {
        let table = $("table#gameTable");
        for (let i = 0; i < numberOfVerticalTiles; ++i) {
            row = $("<tr></tr>").attr("id", i);
            for (let j = 0; j < numberOfHorizontalTiles; ++j)
                row.append(tile = $("<td></td>").attr("id", j))
            table.append(row);
        }
    }

    function getRandomEmptyPosition() {
        let table = $("table#gameTable");
        let foodX; let foodY;
        while (true) {
            foodX = Math.floor(Math.random() * numberOfHorizontalTiles);
            foodY = Math.floor(Math.random() * numberOfVerticalTiles);
            let tail = table.find("tr#" + foodY).find("td#" + foodX);
            if (tail.attr("name") != "snakeField")
                if (tail.children().length == 0)
                    break;
        }
        return {"x" : foodX, "y" : foodY};
    }

    function addFoodToCell(i, j, foodType="normal") {
        let tileHeight = screenHeightPercent(90) / numberOfVerticalTiles;
        let tileWidth = screenWidthPercent(90) / numberOfHorizontalTiles;
        let table = $("table#gameTable");
        food = $("<div></div>");
        food.css({
           "border-radius" : "50%",
           "width" : tileWidth * 80 / 100 + "px",
           "height" : tileHeight * 80 / 100 + "px",
           "background" : "#DF4134",
           "border-color" : "#212D3C",
           "border-width" : tileWidth * 10 / 100 + "px",
           "border-style" : "solid"
        }).attr("name", foodType);
        if (foodType == "super")
            food.css("background", "rgb(237, 207, 12)")
    }

    // faster getRandomFoodPosition and addFoodToCell
    function genFood(foodType="normal") {
        let tileHeight = screenHeightPercent(90) / numberOfVerticalTiles;
        let tileWidth = screenWidthPercent(90) / numberOfHorizontalTiles;
        let table = $("table#gameTable");
        let food = $("<div></div>");
        food.css({
           "border-radius" : "50%",
           "width" : tileWidth * 80 / 100 + "px",
           "height" : tileHeight * 80 / 100 + "px",
           "background" : "#DF4134",
           "border-color" : "#212D3C",
           "border-width" : tileWidth * 10 / 100 + "px",
           "border-style" : "solid"
        }).attr("name", foodType);
        if (foodType == "super")
            food.css("background", "rgb(237, 207, 12)")

        table = $("table#gameTable");
        let foodX; let foodY;
        let cnt = 0;
        while (true) {
            if (cnt == 16 * numberOfHorizontalTiles * numberOfHorizontalTiles) return null;
            foodX = Math.floor(Math.random() * numberOfHorizontalTiles);
            foodY = Math.floor(Math.random() * numberOfVerticalTiles);
            if (foodType == "super")
                superFoodPoz = {"x" : foodX, "y" : foodY};
            let tail = table.find("tr#" + foodY).find("td#" + foodX);
            if (tail.children().length == 0)
                if (tail.attr("name") != "snakeField") {
                    table.find("tr#" + foodY).find("td#" + foodX).append(food);
                    break;
                }
        }
        ++cnt;
    }

    let superFoodPoz = null;
    let removeSuperFoodHandle = null;
    function activateSuperFood() {
        superFoodActivateHandle = setInterval(function() {
            if (removeSuperFoodHandle != null)
                clearTimeout(removeSuperFoodHandle);
            if (superFoodPoz != null) {
                $("table#gameTable").find("tr#" + superFoodPoz.y)
                .find("td#" + superFoodPoz.x).find("div").remove();
            } genFood("super");
            let superFoodLifeSpan = Math.floor(3 + Math.random() * 7);
            removeSuperFoodHandle = setTimeout(function() {
                if (removeSuperFoodHandle == null) return;
                if (superFoodPoz == null) return;
                $("table#gameTable").find("tr#" + superFoodPoz.y)
                .find("td#" + superFoodPoz.x).find("div").remove();
                superFoodPoz = null;
            }, superFoodLifeSpan * 1000);
        }, 10000);
    }

    function poraz() {
        let name = prompt("Unesite vase ime: ");
        if (name == null) window.location.reload();
        else {
            sessionStorage.setItem("name", name);
            sessionStorage.setItem("score", getNow());
            sessionStorage.setItem("from", "igra");
            window.location.href = "zmijica-rezultati.html";
        }
        return;
    }

    function pobeda() {
        let name = prompt("Unesite vase ime: ");
        if (name == null) window.location.reload();
        else {
            sessionStorage.setItem("name", name);
            sessionStorage.setItem("score", getNow());
            sessionStorage.setItem("from", "igra");
            window.location.href = "zmijica-rezultati.html";
        }
        return;
    }

    let traversedRight = 0.0;
    let traversedLeft = 0.0;
    let traversedUp = 0.0;
    let traversedDown = 0.0;
    let snakeTailToCreate = 0;
    function snakeStart() {
        snakeStartHandle = setInterval(function() {
            if (movmentFlag == "UP") traversedUp += snakeSpeed;
            else if (movmentFlag == "DOWN") traversedDown += snakeSpeed;
            else if (movmentFlag == "LEFT") traversedLeft += snakeSpeed;
            else if (movmentFlag == "RIGHT") traversedRight += snakeSpeed;
            let verticalDiff = 0; let horizontalDiff = 0;
            if (traversedUp > 1) {
                verticalDiff -= Math.floor(traversedUp);
                traversedUp -= Math.floor(traversedUp);
            }
            if (traversedDown > 1) {
                verticalDiff += Math.floor(traversedDown);
                traversedDown -= Math.floor(traversedDown);
            }
            if (traversedLeft > 1) {
                horizontalDiff -= Math.floor(traversedLeft);
                traversedLeft -= Math.floor(traversedLeft);
            }
            if (traversedRight > 1) {
                horizontalDiff += Math.floor(traversedRight);
                traversedRight -= Math.floor(traversedRight);
            }
            if (horizontalDiff == 0 && verticalDiff == 0) return;
            let newSnakeX = snake.getX() + horizontalDiff;
            let newSnakeY = snake.getY() + verticalDiff;

            let segmentAfterHead = snake.getHeadNode().next;
            if (newSnakeX == segmentAfterHead.posX && newSnakeY == segmentAfterHead.posY) {
                snake.reverse();
                let newHeadSeg= snake.getHeadNode();
                let newSegAfterHead = snake.getHeadNode().next;
                if (newHeadSeg.posX - 1 == newSegAfterHead.posX) {
                    movmentFlag = "RIGHT"; return; }
                if (newHeadSeg.posX + 1 == newSegAfterHead.posX) {
                    movmentFlag = "LEFT"; return; }
                if (newHeadSeg.posY - 1 == newSegAfterHead.posY) {
                    movmentFlag = "DOWN"; return; }
                if (newHeadSeg.posY + 1 == newSegAfterHead.posY) {
                    movmentFlag = "UP"; return; }
                if (movmentFlag == "UP") movmentFlag = "DOWN";
                else if (movmentFlag == "DOWN") movmentFlag == "UP";
                if (movmentFlag == "LEFT") movmentFlag = "RIGHT";
                else if (movmentFlag == "RIGHT") movmentFlag = "LEFT";
                return;
            }
            let pojeoRep = false;
            let snakeIter = snake.getHeadNode();
            while (snakeIter != snake.getTailPointer()) {
                if (snakeIter.posX == newSnakeX && snakeIter.posY == newSnakeY) {
                    pojeoRep = true; break; }
                snakeIter = snakeIter.next;
            }
            if (pojeoRep || newSnakeX < 0 || newSnakeX >= numberOfHorizontalTiles ||
                newSnakeY < 0 || newSnakeY >= numberOfVerticalTiles) {
                    poraz(); return; }
            let nextTile = $("table#gameTable").find("tr#" + newSnakeY).find("td#" + newSnakeX);
            if (nextTile.children().length == 0 &&
                (snakeTailToCreate == 0 || superFoodMakesMoreSnake != "active"))
                snake.moveTo(newSnakeX, newSnakeY);
            else {
                snake.moveToFood(newSnakeX, newSnakeY);
                if (snake.getSize() >= numberOfHorizontalTiles * numberOfVerticalTiles) {
                    pobeda(); return; }
                if (nextTile.children().length != 0) {
                    food = nextTile.find("div");
                    if (food.attr("name") == "normal") {
                        setNow(getNow() + 1); food.remove(); genFood(); ++snakeTailToCreate; }
                    else { 
                        clearTimeout(removeSuperFoodHandle); superFoodHandle = null;
                        setNow(getNow() + 10); food.remove();
                        superFoodPoz = null; snakeTailToCreate += 10; }
                } --snakeTailToCreate;
            }
        }, 5);
    }

    $(window).resize(function() {
        setScreenWidth();
        setPageStyles();
        snake.initialSnakeDraw();
    });

    $(document).keydown(function(event) {
        if (event.which == 87 || event.which == 38)      // w
            movmentFlag = "UP";
        else if (event.which == 65 || event.which == 37) // a
            movmentFlag = "LEFT";
        else if (event.which == 68 || event.which == 39) // d
            movmentFlag = "RIGHT"
        else if (event.which == 83 || event.which == 40) // s
            movmentFlag = "DOWN"
    });

    function start(initialSnakeX=0, initialSnakeY=0) {
        traversedUp = 0.0; traversedDown = 0.0; traversedLeft = 0.0; traversedRight = 0.0;
        snakeStartHandle = null; superFoodActivateHandle = null;
        setScreenWidth(); createTable(); setPageStyles();
        snake = new Snake(initialSnakeX, initialSnakeY);
        snake.initialSnakeDraw(); genFood();
        activateSuperFood(); snakeStart();
    }

    function getTileColor(i, j) {
        return ((i + j) % 2 ? "#263445" : "#1E2836"); }

    function createBackground() {

        let documentWidth = documentWidthPercent(100);
        let documentHeight = documentHeightPercent(100);

        let tileWidth = Math.floor(documentWidth / horizontalTileNumber);
        let tileHeight = Math.floor(documentHeight / vertiacalTileNumber);
        background = $("body");
        let backgroundTable = $("<table></table>");
        backgroundTable.attr("id", "uputstvoTable");
        for (let i = 0; i < vertiacalTileNumber; ++i) {
            let currRow = $("<tr></tr>");
            currRow.attr("id", "" + i);
            for (let j = 0; j < horizontalTileNumber; ++j) {
                let currCel = $("<td></td>");
                currCel.css({
                    "width" : tileWidth + "px",
                    "height" : tileHeight + "px",
                    "background-color" : getTileColor(i, j),
                });
                currCel.attr("id", "" + j);
                currRow.append(currCel);
            }
            backgroundTable.append(currRow);
        }
        background.prepend(backgroundTable);
    }

    createBackground();

    let snake2 = new BackgroundSnake(1, 1);
    for (let loopVar = 0; loopVar < 7; ++loopVar) {
        newPoz = snake2.getRandomFreePozition();
        snake2.moveToFood(newPoz.x, newPoz.y);
    }
    snake2.initialSnakeDraw();
    setInterval(function() {
        newPoz = snake2.getRandomFreePozition();
        snake2.moveTo(newPoz.x, newPoz.y);
    }, 500);

    initialSnakePoz = getRandomEmptyPosition();
    start(initialSnakePoz.x, initialSnakePoz.y);
});