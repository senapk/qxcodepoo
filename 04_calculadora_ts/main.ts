import {poo} from "./poo_aux";

class Calculadora {
    bateria: number;
    static readonly BATERIA_DEFAULT = 2;

    constructor(bateria = Calculadora.BATERIA_DEFAULT){
        this.bateria = bateria;
    }

    useBattery(){
        if(this.bateria == 0)
            throw new Error("fail: Bateria acabou");
        this.bateria -= 1;
    }

    sum(a: number, b: number): number {
        this.useBattery();
        return a + b;
    }

    div(a: number, b: number): number {
        this.useBattery();
        if(b == 0)
            throw new Error("fail: Divisao por zero nao permitida");
        return a/b;
    }

    charge(carga: number){
        this.bateria += carga;
    }
}


class Controller{
    calc: Calculadora;

    constructor(){
        this.calc = new Calculadora();
    }

    process(line: string): string{
        let ui = line.split(" ");
        let cmd = ui[0];

        if(cmd == "sum")//a  b
            return "" + this.calc.sum(Number(ui[1]), Number(ui[2]));
        else if(cmd == "charge")//carga
            this.calc.charge(Number(ui[1]));
        else if(cmd == "show")
            return "" + this.calc.bateria;
        else if(cmd == "div")
            return "" + this.calc.div(Number(ui[1]), Number(ui[2]));
        else
            return "comando invalido";
        return "done";
    }
}

let cont = new Controller();
poo.shell(x => cont.process(x));













