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

    if (localStorage.getItem("bestScore") == null)
        localStorage.getItem("bestScore", "0");

    if (localStorage.getItem("best") == null) {
        localStorage.setItem("best", JSON.stringify([
            {"name": "IME", "score" : "0", "diff" : "lako", "tableWidth" : "17", "tableHeight" : "15"},
            {"name": "IME", "score" : "0", "diff" : "lako", "tableWidth" : "17", "tableHeight" : "15"},
            {"name": "IME", "score" : "0", "diff" : "lako", "tableWidth" : "17", "tableHeight" : "15"},
            {"name": "IME", "score" : "0", "diff" : "lako", "tableWidth" : "17", "tableHeight" : "15"},
            {"name": "IME", "score" : "0", "diff" : "lako", "tableWidth" : "17", "tableHeight" : "15"},
        ]));
    }




    function setPageStyles() {
        $("body").css("background-color", "#263445"); $("h3").css("color", "#BFC9D5");
        $("h2").css("color", "#BFC9D5"); $("button").css({
            "background-color": "#BFC9D5",
            "color" : "263445",
        });
        let zmijicaTekst = $("#zmijica").css("display", "inline-block").css("font-size", "55px");
        zmijicaTekst.css({
            "position" : "absolute",
            "left" : (documentWidthPercent(100) - zmijicaTekst.width()) / 2 + "px",
            "top" : documentHeightPercent(1) + "px",
            "color" : "#BFC9D5",
        });
        $("textarea#uputstvoTextArea").css({
            "width" : documentWidthPercent(50) + "px",
            "height" : documentHeightPercent(30) + "px",
            "position" : "absolute",
            "top" : documentHeightPercent(20) + "px",
            "left" : documentWidthPercent(5) + "px",
            "background-color" : "#BFC9D5", // "#1E2836"
            "color" : "#263445",
            "font-size" : "20px",
            "resize" : "none"
        });
        $("h3#uputstvoLabel").css({
            "position" : "absolute",
            "top" : documentHeightPercent(12) + "px",
            "left" : documentWidthPercent(25) + "px",
        });
        $("h3#tezinaLabel").css({
            "position" : "absolute",
            "top" : documentHeightPercent(12) + "px",
            "left" : documentWidthPercent(65) + "px",
        });
        $("input#teskoRadio").css({
            "position" : "absolute",
            "top" : documentHeightPercent(24) + "px",
            "left" : documentWidthPercent(60) + "px",
            "transform" : "scale(4)",
        });
        $("input#srednjeRadio").css({
            "position" : "absolute",
            "top" : documentHeightPercent(34) + "px",
            "left" : documentWidthPercent(60) + "px",
            "transform" : "scale(4)",
        });
        $("input#lakoRadio").css({
            "position" : "absolute",
            "top" : documentHeightPercent(44) + "px",
            "left" : documentWidthPercent(60) + "px",
            "transform" : "scale(4)",
        });
        $("h2#tesko").css({
            "position" : "absolute",
            "top" : documentHeightPercent(16) + "px",
            "left" : documentWidthPercent(65) + "px",
            "font-size" : "40px"
        });
        $("h2#srednje").css({
            "position" : "absolute",
            "top" : documentHeightPercent(26) + "px",
            "left" : documentWidthPercent(65) + "px",
            "font-size" : "40px"
        });
         $("h2#lako").css({
            "position" : "absolute",
            "top" : documentHeightPercent(36) + "px",
            "left" : documentWidthPercent(65) + "px",
            "font-size" : "40px"
        });
        $("input#tablaSirina").css({
            "position" : "absolute",
            "top" : documentHeightPercent(57) + "px",
            "left" : documentWidthPercent(5) + "px",
            "width" : documentWidthPercent(50) + "px",
            "height" : documentHeightPercent(4) + "px",
            "background-color" : "#BFC9D5",
            "color" : "#263445",
            "font-size" : "20px"
        });
        $("input#tablaVisina").css({
            "position" : "absolute",
            "top" : documentHeightPercent(65) + "px",
            "left" : documentWidthPercent(5) + "px",
            "width" : documentWidthPercent(50) + "px",
            "height" : documentHeightPercent(4) + "px",
            "background-color" : "#BFC9D5",
            "color" : "#263445",
            "font-size" : "20px"
        });
        $("h2#sirinaLabel").css({
            "position" : "absolute",
            "top" : documentHeightPercent(51) + "px",
            "left" : documentWidthPercent(60) + "px",
            "font-size" : "40px"
        });
        $("h2#visinaLabel").css({
            "position" : "absolute",
            "top" : documentHeightPercent(58) + "px",
            "left" : documentWidthPercent(60) + "px",
            "font-size" : "40px"
        });

    }


    let buttonTopPositionPercent = 70;
    let buttonNovaIgraLeftPositionPercent = 5;
    let buttonRezultatiLeftPositionPercent = 41;
    let buttonSelectedPositionPercentOffset = 10;
    function addButtonCSS() {
        $("button#novaIgra").css({
            "position" : "absolute",
            "top" : documentHeightPercent(buttonTopPositionPercent) + "px",
            "left" : documentWidthPercent(buttonNovaIgraLeftPositionPercent) + "px",
            "font-size" : "40px"
        });
        $("button#rezultati").css({
            "position" : "absolute",
            "top" : documentHeightPercent(buttonTopPositionPercent) + "px",
            "left" : documentWidthPercent(buttonRezultatiLeftPositionPercent) + "px",
            "font-size" : "40px"
        });
    }

    let prevNovaIgraTop = null;
    let prevNovaIgraLeft = null;
    let prevRezultatiTop = null;
    let prevRezultatiLeft = null;
    function addButtonEvents() {

        $("button#novaIgra").on({
            mouseenter : function() {
                $(this).width($(this).width() + documentWidthPercent(buttonSelectedPositionPercentOffset));
                $(this).height($(this).height() + documentHeightPercent(buttonSelectedPositionPercentOffset));
                $(this).css({
                    "top" : documentHeightPercent(buttonTopPositionPercent - buttonSelectedPositionPercentOffset / 2) + "px",
                    "left" : documentWidthPercent(buttonNovaIgraLeftPositionPercent - buttonSelectedPositionPercentOffset / 2) + "px",
                    "font-size" : "50px",
                    "background-color": "#BFC9F7",
                    "color" : "4A7889",
                });
                prevNovaIgraTop = documentHeightPercent(buttonTopPositionPercent) + "px";
                prevNovaIgraLeft = documentWidthPercent(buttonNovaIgraLeftPositionPercent) + "px";
            },
            mouseleave : function() {
                $(this).width($(this).width() - documentWidthPercent(buttonSelectedPositionPercentOffset));
                $(this).height($(this).height() - documentHeightPercent(buttonSelectedPositionPercentOffset));
                $(this).css({
                    "top" : prevNovaIgraTop, //documentHeightPercent(buttonTopPositionPercent + buttonSelectedPositionPercentOffset / 2) + "px",
                    "left" : prevNovaIgraLeft, // documentWidthPercent(buttonNovaIgraLeftPositionPercent + buttonSelectedPositionPercentOffset / 2) + "px",
                    "font-size" : "40px",
                    "background-color": "#BFC9D5",
                    "color" : "263445",
                });
            },
            click : function() {
                let buttonId = $("input[name=tezina]").filter(":checked").attr("id");
                if (buttonId == null) {
                    alert("POPUNITE SVA POLJA"); return; }
                let brzina;
                if (buttonId == "lakoRadio") brzina = 0.025;
                else if (buttonId == "srednjeRadio") brzina = 0.05;
                else if (buttonId == "teskoRadio") brzina = 0.1;
                else { alert("NISTE PRAVILNO POPUNILI POLJE BRZINA"); return; }
                let sirinaTable = $("input#tablaSirina").val();
                if (sirinaTable.length == 0) {
                    alert("POPUNITE SVA POLJA"); return; }
                let visinaTable = $("input#tablaVisina").val();
                if (visinaTable.length == 0) {
                    alert("POPUNITE SVA POLJA"); return; }
                sessionStorage.setItem("brzina", brzina);
                sessionStorage.setItem("sirina", sirinaTable);
                sessionStorage.setItem("visina", visinaTable);
                let tez = null;
                if (buttonId == "lakoRadio") tez = "lako";
                else if (buttonId == "srednjeRadio") tez = "srednje";
                else if (buttonId == "teskoRadio") tez = "tesko";
                sessionStorage.setItem("tezina", tez)

                window.location.href = "zmijica-igra.html";
            }
        });

        $("button#rezultati").on({
            mouseenter : function() {
                $(this).width($(this).width() + documentWidthPercent(buttonSelectedPositionPercentOffset));
                $(this).height($(this).height() + documentHeightPercent(buttonSelectedPositionPercentOffset));
                $(this).css({
                    "top" : documentHeightPercent(buttonTopPositionPercent - buttonSelectedPositionPercentOffset / 2) + "px",
                    "left" : documentWidthPercent(buttonRezultatiLeftPositionPercent - buttonSelectedPositionPercentOffset / 2) + "px",
                    "font-size" : "55px",
                    "background-color": "#BFC9F7",
                    "color" : "4A7889",
                });
                prevRezultatiTop = documentHeightPercent(buttonTopPositionPercent) + "px";
                prevRezultatiLeft = documentWidthPercent(buttonRezultatiLeftPositionPercent) + "px";

            },
            mouseleave : function() {
                $(this).width($(this).width() - documentWidthPercent(buttonSelectedPositionPercentOffset));
                $(this).height($(this).height() - documentHeightPercent(buttonSelectedPositionPercentOffset));
                $(this).css({
                    "top" : prevRezultatiTop,
                    "left" : prevRezultatiLeft,
                    "font-size" : "40px",
                    "background-color": "#BFC9D5",
                    "color" : "263445",
                })
            },
            click : function() {
                sessionStorage.setItem("from", "uputstvo");
                window.location.href = "zmijica-rezultati.html";
            }
        });
        $("button#novaIgra").mouseenter().mouseleave();
        $("button#rezultati").mouseenter().mouseleave();
    }

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

    $(window).resize(function() {
        setPageStyles();
    });

    setPageStyles();
    addButtonCSS();
    createBackground();
    addButtonEvents();

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
});