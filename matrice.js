Array.prototype.equals = function(tab) {
    if (this.length != tab.length) return false;
    for (let i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && tab[i] instanceof Array) {
            if (!this[i].equals(tab[i])) return false;
        } else if (this[i] != tab[i]) return false;
    }
    return true;
}

Array.prototype.clone = function() {
    var clone = [];
    for (let i = 0; i < this.length; i++) {
        if (this[i] instanceof Array) {
            clone[i] = this[i].clone();
        } else {
            clone[i] = this[i];
        }
    }
    return clone;
}

class Matrice {
    static Done = [];
    constructor(name, x, y, size) {
        this.name = name;
        this.largeur = x;
        this.hauteur = y;
        this.datas = [];
        this.init(size);
    }

    clear() {
        for (let i = 0; i < this.hauteur; i++) {
            for (let j = 0; j < this.largeur; j++) {
                let td = document.getElementById("td_" + this.name + "_" + i + "_" + j);
                td.textContent = "";
                this.datas[i][j] = 0;
            }
        }
    }
    updateZero() {
        for (let i = 0; i < this.hauteur; i++) {
            for (let j = 0; j < this.largeur; j++) {
                let td = document.getElementById("td_" + this.name + "_" + i + "_" + j);
                td.textContent = "0";
                this.datas[i][j] = 0;
            }
        }
    }

    init(size) {
        document.writeln("<table style='width:" + size + "%;border:1px solid black'>");
        document.writeln("<caption>Matrice " + this.name + "</caption>");
        for (let i = 0; i < this.hauteur; i++) {
            document.writeln("<tr>");
            let tmp = [];
            for (let j = 0; j < this.largeur; j++) {
                if (size == 50) document.writeln("<td style='background-color:lightgray;text-align:center' contentEditable  id='td_" + this.name + "_" + i + "_" + j + "' placeholder=\"0\"></td>");
                if (size == 100) document.writeln("<td style='background-color:lightblue;text-align:center'  id='td_" + this.name + "_" + i + "_" + j + "'></td>");
                tmp.push(0);
            }
            this.datas.push(tmp);
            document.writeln("</tr>");
        }
        document.writeln("</table>");
    }

    get() {
        for (let i = 0; i < this.hauteur; i++) {
            for (let j = 0; j < this.largeur; j++) {
                let td = document.getElementById("td_" + this.name + "_" + i + "_" + j);
                let value = td.textContent;
                this.datas[i][j] = value - '0';
            }
        }
        return this.datas;
    }

    getLine(numero) {
        let res = [];
        for (let i = 0; i < this.largeur; i++) {
            res.push(this.datas[numero][i]);
        }
        return res;
    }

    getColonne(numero) {
        let res = [];
        for (let i = 0; i < this.hauteur; i++) {
            res.push(this.datas[i][numero]);
        }
        return res;
    }

    mult(m2) {
        this.get();
        m2.get();
        if (this.largeur == m2.hauteur) {
            let dim = [m2.largeur, this.hauteur];
            if (Matrice.Done.indexOf("AB") == -1) {
                Matrice.Done.push("AB");
                MAB = new Matrice("AB", dim[0], dim[1], 100);
            }
            for (let i = 0; i < this.hauteur; i++) {
                let line = this.getLine(i);
                for (let j = 0; j < m2.largeur; j++) {
                    let colonne = m2.getColonne(j);
                    MAB.datas[i][j] = multLine(line, colonne);
                    let td = document.getElementById("td_AB_" + i + "_" + j);
                    td.textContent = MAB.datas[i][j];
                }
            }
            return MAB;
        } else {
            document.writeln("Impossible d'effectuer le calcul");
        }
    }

    getDim() {
        return "[" + this.largeur + ", " + this.hauteur + "]";
    }

    plus_moins(m2, sym) {
        this.get();
        m2.get();
        if (this.getDim() == m2.getDim()) {
            let sep = (sym == "+") ? "_plus_" : "_moins_";
            let name = "A" + sep + "B";
            if (Matrice.Done.indexOf(name) == -1) {
                if (sym == "+") MApB = new Matrice(name, this.largeur, this.hauteur, 100);
                if (sym == "-") MAmB = new Matrice(name, this.largeur, this.hauteur, 100);
                Matrice.Done.push(name);
            }
            let res = [];
            for (let i = 0; i < this.hauteur; i++) {
                let tmp = [];
                for (let j = 0; j < this.largeur; j++) {
                    let td = document.getElementById("td_" + name + "_" + i + "_" + j);
                    if (sym == "+") {
                        MApB.datas[i][j] = this.datas[i][j] + m2.datas[i][j];
                        td.textContent = MApB.datas[i][j];
                    }
                    if (sym == "-") {
                        MAmB.datas[i][j] = this.datas[i][j] - m2.datas[i][j];
                        td.textContent = MAmB.datas[i][j];
                    }
                    tmp.push(td.textContent);
                }
                res.push(tmp)
            }
            return res;
        } else {
            document.writeln("Impossible d'effectuer le calcul");
            return null;
        }
    }

    det() {
        this.get();
        if (this.getDim() == "[3, 3]") {
            var temp = this.datas.clone();
            for (let i = 0; i < this.datas.length; i++) {
                temp[i].push(this.getColonne(0)[i]);
                temp[i].push(this.getColonne(1)[i]);
            }
            let res = 0;
            for (let i = 0; i < temp[0].length; i++) {
                let vartmp = 1;
                if (temp[0][i] != undefined && temp[1][i + 1] != undefined && temp[2][i + 2] != undefined) {
                    vartmp *= temp[0][i];
                    vartmp *= temp[1][i + 1];
                    vartmp *= temp[2][i + 2];
                    res += vartmp;
                }
            }
            for (let i = 0; i < temp[2].length; i++) {
                let vartmp = 1;
                if (temp[2][i] != undefined && temp[1][i + 1] != undefined && temp[0][i + 2] != undefined) {
                    vartmp *= temp[2][i];
                    vartmp *= temp[1][i + 1];
                    vartmp *= temp[0][i + 2];
                    res -= vartmp;
                }
            }
            return res;
        } else if (this.getDim() == "[2, 2]") {
            let a = this.datas[0][0];
            let b = this.datas[0][1];
            let c = this.datas[1][0];
            let d = this.datas[1][1];
            return a * d - b * c;
        } else if (this.getDim() == "[1, 1]") {
            return 1;
        } else {
            return "Impossible d'effectuer le calcul";
        }
    }
}



function multLine(l1, l2) {
    let res = 0;
    for (let i = 0; i < l1.length; i++) {
        res += l1[i] * l2[i]
    }
    return res;
}

var MA;
var MB;
var MAB;
var MAmB;
var MApB;
var detM;

function init() {
    let m1l = document.getElementById("m1l").value;
    let m1h = document.getElementById("m1h").value;
    let m2l = document.getElementById("m2l").value;
    let m2h = document.getElementById("m2h").value;
    let m1 = [m1l, m1h];
    let m2 = [m2l, m2h];

    let fPos = false;
    let mPos = false;
    let pPos = false;
    if (m1[0] == m2[1])
        fPos = true;
    if (m1[0] == m2[0] && m1[1] == m2[1]) {
        mPos = true;
        pPos = true;
    }

    if (fPos || mPos || pPos) {
        document.writeln("<div style='position:relative;display:flex;flex-direction:row;width:100%'>");
        MA = new Matrice("A", m1[0], m1[1], 50);
        MB = new Matrice("B", m2[0], m2[1], 50);
        document.writeln("</div>");
        if (fPos) document.writeln("<button onclick='fois()'>Multiplier</button>");
        if (pPos) document.writeln("<button onclick='plus()'>Ajouter</button>");
        if (mPos) document.writeln("<button onclick='moins()'>Soustraire</button>");
        document.writeln("<button onclick='effacer()'>Effacer les valeurs</button>");
        document.writeln("<button onclick='majZero()'>Mise à zéro</button>");
        document.writeln("<button onclick='window.location.reload()'>Changer les dimensions</button>");
    } else {
        document.writeln("<div style='position:relative;display:flex;flex-direction:row;width:100%'>");
        MA = new Matrice("A", m1[0], m1[1], 50);
        document.writeln("</div>");
        document.writeln("<button onclick='determinant()'>Calculer le déterminant</button>");
        document.writeln("<button onclick='effacer()'>Effacer les valeurs</button>");
        document.writeln("<button onclick='majZero()'>Mise à zéro</button>");
        document.writeln("<button onclick='window.location.reload()'>Changer les dimensions</button>");
    }
}

function determinant() {
    detM = MA.det();
    if (Matrice.Done.indexOf("detM") == -1) {
        Matrice.Done.push("detM");
        var span = document.createElement("span");
        document.body.append(span);
        span.id = "detM";
        span.textContent = "Déterminant : " + detM;

    } else {
        var span = document.getElementById("detM");
        span.textContent = "Déterminant : " + detM;
    }
}

function effacer() {
    if (Matrice.Done.indexOf("AB") != -1) MAB.clear();
    if (Matrice.Done.indexOf("A_moins_B") != -1) MAmB.clear();
    if (Matrice.Done.indexOf("A_plus_B") != -1) MApB.clear();
    if (MA != undefined) MA.clear();
    if (MB != undefined) MB.clear();
    if (detM != undefined) detM = 0;
}

function majZero() {
    if (Matrice.Done.indexOf("AB") != -1) MAB.updateZero();
    if (Matrice.Done.indexOf("A_moins_B") != -1) MAmB.updateZero();
    if (Matrice.Done.indexOf("A_plus_B") != -1) MApB.updateZero();
    if (MA != undefined) MA.updateZero();
    if (MB != undefined) MB.updateZero();
    if (detM != undefined) detM = 0;
}

function plus() {
    MA.plus_moins(MB, "+");
}

function moins() {
    MA.plus_moins(MB, "-");
}

function fois() {
    MA.mult(MB);
}