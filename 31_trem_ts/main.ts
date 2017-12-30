import {Repository} from "./poo_repository";
import {poo} from "./poo_aux";

class Passageiro {
    readonly id: string;    
    
	constructor(id: string = "") {
		this.id = id;
	}
    toString(): string {
        return this.id;
    }
}

class Vagao {
    readonly id: number;
    private _cadeiras: Array<Passageiro | undefined>;

	constructor(id: number, capacidade: number) {
        this.id = id;
        this._cadeiras = [];
        for(let i = 0; i < capacidade; i++)
            this._cadeiras.push(undefined);
    }

	public get cadeiras(): Array<Passageiro | undefined> {
		return this._cadeiras;
	}
    
    getCapacidade(): number {
        return this._cadeiras.length;
    }

    getLotacao(): number {
        let sum = 0;
        this._cadeiras.map(x => {sum += x == undefined ? 0 : 1});
        return sum;
    }

    embarcar(passageiro: Passageiro): boolean {
        for(let indice in this._cadeiras) {
            let pass = this._cadeiras[indice];
            if(!pass) {
                this._cadeiras[indice] = passageiro;
                return true;
            }
        }
        return false;
    }

    desembarcar(idPass: string): Passageiro | null {
        for(let indice in this._cadeiras) {
            let pass = this._cadeiras[indice];
            if(pass && (pass.id == idPass)) {
                this._cadeiras[indice] = undefined;
                return pass;
            }
        }
        return null;
    }
    
    toString(): string {
        let saida = "";
        this._cadeiras.forEach(x => saida += x ? " " + x.id + " " : " - ");
        return "[" + saida + "]";
    }
}

interface Observador {
    notify(mov: Movimentacao): void;
}

class Observavel {
    observadores: Observador[];
    attach(obs: Observador){
        this.observadores.push(obs);
    }
    notifyAll(mov: Movimentacao){
        for(let obs of this.observadores)
            obs.notify(mov);
    }
}

class ServicoTrem extends Observavel{
    private vagoes: Array<Vagao>;
    private forca: number;
	constructor(forca = 0) {
        super();
        this.forca = forca;
        this.vagoes = [];
    }

    addVagao(vagao: Vagao): boolean {
        if(this.vagoes.length >= this.forca)
            return false;
        this.vagoes.push(vagao);
        return true;
    }

    embarque(passId: Passageiro){
        for(let vagao of this.vagoes)
            if(vagao.embarcar(passId))
                return;
        throw new Error("Nao ha vagas no trem");
    }

    desembarque(passId: string){
        for(let vagao of this.vagoes)
            if(vagao.desembarcar(passId))
                return;
        new Error("Passageiro nao esta no trem");
    }

    toString(): string {
        let saida = "Trem: ";
        for(let vagao of this.vagoes)
            saida += vagao;
        return saida;
    }
}

enum Acao {IN, OUT};

class Movimentacao{
    constructor(public passId: string, public acao: Acao){};
}

class Controller {
    trem: ServicoTrem;
    cadastro: Repository<Passageiro>;
    historico: Movimentacao[];

	constructor() {
        this.trem = new ServicoTrem(4);
        this.cadastro = new Repository<Passageiro>;
    }

    embarcar(pass: Passageiro){
    }

    process(line: string): string{
        let ui = line.split(" ");
        let cmd = ui[0];
        if(cmd == "cadastro")//idPass
            this.cadastro.add(ui[1], new Passageiro(ui[1]));
        if(ui[0] == "embarcar"){

        }

        if(ui[0] == "desembarcar") {
            if(this.trem.desembarque(ui[1]))
                cout("Desembar")
            else
                cout("Nao existe");
        }
    }
}