class Operacao {
    public value : number;
    public descricao : string;
    public saldoParcial : number;

    constructor(descricao: string = "", value: number = 0.0, saldo : number = 0.0) {
        this.value = value;
        this.descricao = descricao;
        this.saldoParcial = saldo;
    }

    toString(): string{
        return "[" + this.descricao + ", " + this.value + ", saldo: " + this.saldoParcial + "]";
    }
}

class Conta {
    id: number;
    extrato: Operacao[];
    private _saldo: number;

    constructor(id: number = 0) {
        this.id = id;
        this._saldo = 0;
        this.extrato = [];
        this.extrato.push(new Operacao("abertura", 0, 0));
    }

    sacar (value: number){
        if (value <= 0)
            throw new Error("fail: voce nao pode sacar um valor negativo");
        if (this._saldo < value) 
            throw new Error("fail: saldo insuficiente");
        this._saldo -= value;
        this.extrato.push(new Operacao("saque   ", -value, this._saldo))
    }

    depositar(value: number) {
        if(value <= 0)
            throw new Error("fail: voce nao pode depositar um valor negativo");
        this._saldo += value;
        this.extrato.push(new Operacao("deposito", value, this._saldo));
    }

    get saldo(): number {
        return this._saldo;
    }

    toString(): string{
        return "Conta Id: " + this.id + ", Saldo: " + this.saldo + "\n" + this.extrato.join("\n");
    }
}

class Controller{
    conta: Conta;

    constructor(){
        this.conta = new Conta(5);
        this.conta.depositar(40);
        this.conta.sacar(5);
        this.conta.sacar(10);
        this.conta.depositar(30);
    }

    process(line: string): string {
        let ui = line.split(" ");//user input
        let cmd = ui[0];
        let HELP =  "iniciar _id\n" + 
                    "sacar _value\n" + 
                    "depositar _value\n" + 
                    "show";

        if(cmd == "help"){
            return HELP;
        } else if (cmd == "iniciar") {
            this.conta = new Conta(Number(ui[1]));
        } else if (cmd == "sacar") {
            this.conta.sacar(Number(ui[1]));
        } else if (cmd == "depositar") {
            this.conta.depositar(Number(ui[1]));
        } else if (cmd == "show") {
            return "" + this.conta;
        } else {
            return "comando invalido";
        }
        return "done";
    }
}

let c = new Controller();
import {poo} from "./poo_aux";
poo.shell(x => c.process(x));

