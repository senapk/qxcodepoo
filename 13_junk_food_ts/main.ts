//include do readline-sync
declare function require(name : string);
var readline = require('readline-sync');

function cin(text : string = ""): string{
    //return prompt(text);
    return readline.question(text);
}

function cout(text : string){
    //alert(text);
    console.log(text);
}

//################################################//

class Espiral{
    constructor(
        public nome: string = "", 
        public qtd: number = 0, 
        public preco: number = 0.0
    ){}

    toString(): string{
        return "nome: " + this.nome + ", qtd: " + this.qtd + ", preco: " + this.preco; 
    }
}

class Machine{
    saldo: number;
    lucro: number;
    espirais : Espiral[];
    maxProdutos : number;

    constructor(nespirais : number, maxProdutos : number){
        this.saldo = 0.0;
        this.lucro = 0.0;
        this.espirais = [];
        this.maxProdutos = maxProdutos;

        for(let i = 0; i < nespirais; i++){
            this.espirais.push(new Espiral());
        }
    }

    inserirDin(value: number){
        this.saldo += value;
    }

    getSaldo(): number{
        return this.saldo;
    }

    pedirTroco(): number{
        let troco: number = this.saldo;
        this.saldo = 0;
        return troco;
    }

    alterarEspiral(indice: number, nome: string, 
                   qtd: number, preco: number): boolean{

        if(indice < 0 || indice >= this.espirais.length)
            return false;

        if(qtd < 0 || qtd > this.maxProdutos)
            return false;

        this.espirais[indice] = new Espiral(nome, qtd, preco);
        return true;
    }

    comprar(indice: number): boolean{
        if(indice < 0 || indice >= this.espirais.length)
            return false;

        if(this.saldo < this.espirais[indice].preco)
            return false;

        if(this.espirais[indice].qtd == 0)
            return false;

        this.saldo -= this.espirais[indice].preco;
        this.lucro += this.espirais[indice].preco;
        this.espirais[indice].qtd -=1 ;
        return true;
    }

    toString(): string{
        let st: string = "";
        st += "Saldo Cliente: " + this.saldo + "\n";
        st += "Lucro Maquina: " + this.lucro + "\n";
        for(let ind in this.espirais)
            st += "ind: " + ind + ", " + this.espirais[Number(ind)] + "\n";
        return st;
    }
}

class Controller{    
    maquina : Machine;
    
    constructor(){
        this.maquina = new Machine(5, 5);
        this.maquina.alterarEspiral(0, "todinho", 3, 2.00);
        this.maquina.alterarEspiral(1, "biscoito", 1, 5.00);
        this.maquina.alterarEspiral(2, "uva", 3, 2.50);
        this.maquina.alterarEspiral(3, "picole", 2, 7.50);

        this.maquina.inserirDin(4.00);
    }

    openConsole(): void{

        let ui: string[] = [""]; //user input

        while(ui[0] != "fim"){
            ui = cin("Digite comando ou help: ").split(" ");

            if(ui[0] == "help"){
                cout("iniciar $qtdEspirais $maxProdutos" + "\n"
                    + "alterar $indice $nome $qtd $preco" + "\n"
                    + "---------------" + "\n"
                    + "dinheiro $valor" + "\n"
                    + "troco          " + "\n"
                    + "show           " + "\n"
                    + "saldo          " + "\n"
                    + "comprar $indice" + "\n");
            }
            if(ui[0] == "alterar"){
                let result : boolean = this.maquina.alterarEspiral(Number(ui[1]), ui[2], Number(ui[3]), Number(ui[4]));
                if(result)
                    cout("Produto alterado");
                else
                    cout("Erro na alteracao");
            }
            if(ui[0] == "iniciar"){
                this.maquina = new Machine(Number(ui[1]), Number(ui[2]));
                cout("" + this.maquina);
            }
            if(ui[0] ==  "dinheiro"){
                this.maquina.inserirDin(Number(ui[1]));
                cout("Saldo: " + this.maquina.getSaldo());
            }
            if(ui[0] ==  "saldo"){
                cout("Saldo: " + this.maquina.getSaldo());
            }
            if(ui[0] ==  "troco"){
                cout("Seu troco é " + this.maquina.pedirTroco());
                cout("" + this.maquina.getSaldo());
            }
            if(ui[0] ==  "show"){
                cout("" + this.maquina);
            }
            if(ui[0] ==  "comprar"){
                if(this.maquina.comprar(Number(ui[1])))
                    cout("Compra efetuada com sucesso");
                else
                    cout("Erro na compra");
            }
        }
    }
}

function main(){
    let controller : Controller = new Controller();
    controller.openConsole();
}

main();