import {poo} from "./poo_aux";

class Cliente {
    id: string;
    fone: number;
    toString(): string {
        return this.id + ":" + this.fone;
    }
}

class SalaDeCinema {
    cadeiras: (Cliente | undefined)[];

    constructor(capacidade: number) {
        this.cadeiras = [];
        for(let i = 0; i < capacidade; i++)
            this.cadeiras.push(undefined);
    }

    toString(): string {
        return "[" + this.cadeiras.map(x => x ? x.id : "-").join(" ") + "]";
    }

    reservar(pos: number, cliente: Cliente) {
        if(this.cadeiras[pos] == undefined)
            this.cadeiras[pos] = cliente;
        else
            throw new Error("fail: cadeira reservada para outro cliente");
    }
    
    desistir(clienteId: string) {
        let pos = this.cadeiras.findIndex(x => x ? x.id == clienteId : false);
        if(pos == -1)
            throw new Error("fail: nenhum cliente nesta cadeira");
        this.cadeiras[pos] = undefined;
    }
}


class Controller{
    calc: SalaDeCinema;

    constructor(){
        this.calc = new SalaDeCinema(5);
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













