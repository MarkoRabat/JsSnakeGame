$(document).ready(function() {

    function documentHeightPercent(p) {
        return $(document).height() * p / 100;
    }
    function documentWidthPercent(p) {
        return $(document).width() * p / 100;
    }
    let horizontalTileNumber = 30;
    let vertiacalTileNumber = 30;

    /* ZMIJICA BACKGROUND ANIMACIJA */

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
            setTileColor(tailNode.posX, tailNode.posY);
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

    function setTileColor(i, j) {
        let tileColor = ((i + j) % 2 ? "#263445" : "#1E2836");
        $("table#uputstvoTable").find("tr#" + j).find("td#" + i).css({
            "background-color": tileColor,
        });
    }

    /* /ZMIJICA POZADINSKA ANIMACIJA */

    function getTileColor(i, j) {
        return ((i + j) % 2 ? "#263445" : "#1E2836");
    }

    function createBackground() {
        let documentWidth = documentWidthPercent(100);
        let documentHeight = documentHeightPercent(100);

        let tileWidth = Math.floor(documentWidth / horizontalTileNumber);
        let tileHeight = Math.floor(documentHeight / vertiacalTileNumber);
        background = $("body");
        let backgroundTable = $("<table></table>");
        backgroundTable.attr("id", "uputstvoTable");
        // backgroundTable.css("border", "3px solid #B0BAC6");
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

    function stylePage() {
        $("body").css("background-color", "#263445");
        $("h1").css("color", "#BFC9D5").css("display", "inline-block"); $("button").css({
            "background-color": "#BFC9D5", "color" : "263445",
        });

        let naslov = $("h1#naslov");
        naslov.css("font-size", "55px");
        naslov.css({
            "position" : "absolute",
            "top" : documentHeightPercent(0) + "px",
            "left" : (documentWidthPercent(50) - naslov.width() / 2) + "px",
        })

        let bestScores = JSON.parse(localStorage.getItem("best"));
        let table = $("table#rezTable");
        for (let i = 0; i < 5; ++i) {
            let tri = table.find("tr#" + i);
            let tdi0 = tri.find("td#0");
            let tdi1 = tri.find("td#1");
            let trii = table.find("tr#" + i + i);
            let tdii1 = trii.find("td#" + 0);

            tri.css({
                "height" : documentHeightPercent(3) + "px",
                "width" : documentWidthPercent(40) + "px",
                "background-color" : "#BFC9D5",
                "border-color" : "rgb(30, 40, 54)",
                "border-style" : "solid",
                "border-size" : "3px",
            });

            trii.css({
                "height" : documentHeightPercent(2) + "px",
                "width" : documentWidthPercent(40) + "px",
                "background-color" : "BFC9D5",
                "border-color" : "rgb(30, 40, 54)",
                "border-style" : "solid",
                "border-size" : "3px",
            });

            tdi0.text(bestScores[i].name + " : " + bestScores[i].score);
            tdi1.text(bestScores[i].diff);
            tdii1.text(bestScores[i].tableWidth + " : " + bestScores[i].tableHeight);

            tdi0.css({
                "width" : documentWidthPercent(30) + "px",
                "height" : documentHeightPercent(5) + "px",
                "font-size" : "30px",
                "text-align" : "center",
            });
            tdi1.css({
                "width" : documentWidthPercent(10) + "px",
                "height" : documentHeightPercent(2) + "px",
                "font-size" : "30px",
                "text-align" : "center",
            });
            tdii1.css({
                "width" : documentWidthPercent(10) + "px",
                "height" : documentHeightPercent(2) + "px",
                "background-color" : "BFC9D5",
                "font-size" : "30px",
                "position" : "relative",
                "left" : documentWidthPercent(20) + "px",
                "color" : "#BFC9D5",
                "text-align" : "center",
            });

        }
        table.css({
            "position" : "absolute",
            "top" : documentHeightPercent(10) + "px",
            "left" : (documentWidthPercent(30) - table.width() / 2) + "px",
            "background-color" : "#263445",
            "border-color" : "rgb(30, 40, 54)",
            "border-style" : "solid",
            "border-size" : "3px",
        });
        $("h1#imeLabel").css({
            "position" : "absolute",
            "top" : documentHeightPercent(45) + "px",
            "left" : documentWidthPercent(60) + "px",
        });
        $("h1#rezultatLabel").css({
            "position" : "absolute",
            "top" : documentHeightPercent(50) + "px",
            "left" : documentWidthPercent(60) + "px",
        });
        $("h1#imeTekst").css({
            "position" : "absolute",
            "top" : documentHeightPercent(45) + "px",
            "left" : documentWidthPercent(67) + "px",
        }).text(sessionStorage.getItem("name"));
        $("h1#rezultatTekst").css({
            "position" : "absolute",
            "top" : documentHeightPercent(50) + "px",
            "left" : documentWidthPercent(67) + "px",
        }).text(sessionStorage.getItem("score"));
    }


    let buttonTopPositionPercent = 40;
    let buttonLeftPositionPercent = 58;
    let buttonSelectedPositionPercentOffset = 5;
    let prevButtonTop = null;
    let prevButtonLeft = null;
    function addButtonCSS() {

        let button = $("button#pocetna");

        button.css({
            "position" : "absolute",
            "top" : documentHeightPercent(buttonTopPositionPercent) + "px",
            "left" : documentWidthPercent(buttonLeftPositionPercent) + "px",
            "font-size" : "40px",
        });

        button.on({
            mouseenter : function() {
                $(this).width($(this).width() + documentWidthPercent(buttonSelectedPositionPercentOffset));
                $(this).height($(this).height() + documentHeightPercent(buttonSelectedPositionPercentOffset));
                $(this).css({
                    "top" : documentHeightPercent(buttonTopPositionPercent - buttonSelectedPositionPercentOffset / 2) + "px",
                    "left" : documentWidthPercent(buttonLeftPositionPercent - buttonSelectedPositionPercentOffset / 2) + "px",
                    "font-size" : "50px",
                    "background-color": "#BFC9F7",
                    "color" : "4A7889",
                });
                prevButtonTop = documentHeightPercent(buttonTopPositionPercent) + "px";
                prevButtonLeft = documentWidthPercent(buttonLeftPositionPercent) + "px";
            },
            mouseleave : function() {
                $(this).width($(this).width() - documentWidthPercent(buttonSelectedPositionPercentOffset));
                $(this).height($(this).height() - documentHeightPercent(buttonSelectedPositionPercentOffset));
                $(this).css({
                    "top" : prevButtonTop,
                    "left" : prevButtonLeft,
                    "font-size" : "40px",
                    "background-color": "#BFC9D5",
                    "color" : "263445",
                });
            },
            click : function() {
                window.location.href = "zmijica-uputstvo.html";
            }
        });
        button.mouseenter().mouseleave();
    }

    function updateScores() {
        if (sessionStorage.getItem("from") == "uputstvo") return;
        let bestScores = JSON.parse(localStorage.getItem("best"));
        let name = sessionStorage.getItem("name");
        let score = sessionStorage.getItem("score");
        let width = sessionStorage.getItem("sirina");
        let height = sessionStorage.getItem("visina");
        let tezina = sessionStorage.getItem("tezina");

        sessionStorage.setItem("from", "NaN");

        //{"name": "IME", "score" : "0", "diff" : "lako", "tableWidth" : "17", "tableHeight" : "15"},
        bestScores.push({
            "name" : name,
            "score" : score,
            "diff" : tezina,
            "tableWidth" : width,
            "tableHeight" : height,
        });
        bestScores.sort(function(elem1, elem2) {
            return -parseInt(elem1.score) + parseInt(elem2.score);
        });
        localStorage.setItem("bestScore", bestScores[0].score);
        console.log(bestScores);
        localStorage.setItem("best", JSON.stringify(bestScores));
    }

    $(window).resize(function() {
        stylePage();
        $("button#pocetna").mouseenter().mouseleave();
    });

    updateScores();

    createBackground();
    let snake2 = new BackgroundSnake(1, 1);
    let newPoz = snake2.getRandomFreePozition();
    for (let loopVar = 0; loopVar < 6; ++loopVar) {
        snake2.moveToFood(newPoz.x, newPoz.y);
        newPoz = snake2.getRandomFreePozition();
    }
    snake2.initialSnakeDraw();
    setInterval(function() {
        newPoz = snake2.getRandomFreePozition();
        snake2.moveTo(newPoz.x, newPoz.y);
    }, 500);
    stylePage();
    addButtonCSS();

});
