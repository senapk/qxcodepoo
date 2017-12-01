declare function require(name:string);
var input = require('readline-sync');

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
    private id : number;
    private extrato : Operacao[];
    private saldo : number;

    constructor(id : number = 0) {
        this.id = id;
        this.saldo = 0;
        this.extrato = [];
    }

    sacar (value : number) : boolean{
        if (value <= 0)
            return false;
        if (this.saldo > value) {
            this.saldo -= value;
            this.extrato.push(new Operacao("saque", -value, this.saldo))
            return true;
        }
        return false;
    }

    depositar(value : number) : boolean{
        if(value <= 0)
            return false;
        this.saldo += value;
        this.extrato.push(new Operacao("deposito", value, this.saldo))
        return true;
    }

    getSaldo() : number{
        return this.saldo;
    }

    getId() : number{
        return this.id;
    }

    getExtrato(qtd?: number) : Operacao[]{
        let last : Operacao[] = [];
        let size : number = this.extrato.length;
        if(!qtd  || (qtd > size))
            qtd = size;
        for(let i = (size - qtd); i < size; i++)
            last.push(this.extrato[i]);
        return last;
    }
}

class Controller{
    conta : Conta;

    constructor(){
        this.conta = new Conta(5);
        this.conta.depositar(40);
        this.conta.sacar(5);
        this.conta.sacar(10);
        this.conta.depositar(30);
    }

    commandLine(){
        let ui : string[] = [""];//user input
        while(ui[0] != "fim"){
            ui = input.question("digite comando ou help: ").split(" ");   

            if(ui[0] == "help"){
                console.log(  "help\n" +
                        "iniciar $id\n" + 
                        "saldo\n" + 
                        "saque $value\n" + 
                        "deposito $value\n" + 
                        "extrato\n" +
                        "extratoLast $qtd\n" +
                        "fim");
            }

            if(ui[0] == "iniciar"){
                this.conta = new Conta(Number(ui[1]));
                console.log("Conta " + this.conta.getId() + " criada");
            }
            
            if(ui[0] == "saldo"){
                console.log("Conta: " + this.conta.getId() + ", Saldo: " + this.conta.getSaldo());
            }

            if(ui[0] == "saque"){
                if(this.conta.sacar(Number(ui[1])))
                    console.log("Saque efetuado");                
                else
                    console.log("Erro no saque");
            }

            if(ui[0] == "deposito"){
                if(this.conta.depositar(Number(ui[1])))
                    console.log("Deposito Efetuado");
                else
                    console.log("Erro");
            }
            if(ui[0] == "extrato"){
                let output : string = "Extrato:\n";
                //of anda nos valores
                //in nas chaves
                for(let e of this.conta.getExtrato())
                    output += "" + e + "\n";
                console.log(output);
            }

            if(ui[0] == "extratoLast"){
                let output : string = "Extrato:\n";
                //of anda nos valores
                //in nas chaves
                for(let e of this.conta.getExtrato(Number(ui[1])))
                    output += "" + e + "\n";
                console.log(output);
            }
        }
    }
}

let controller : Controller = new Controller();
controller.commandLine();

