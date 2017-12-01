
class Passageiro {
    private _nome: string;    
    private _id: string;

	constructor(nome: string = "", id: string = "") {
		this._nome = nome;
		this._id = id;
	}

	public get nome(): string {
		return this._nome;
	}

	public set nome(value: string) {
		this._nome = value;
	}

	public get id(): string {
		return this._id;
	}

	public set id(value: string) {
		this._id = value;
    }
    
    toString(): string {
        return "Nome: " + this._nome + " Id: " + this._id;
    }
}

class Vagao {
    private _id: number;
    private _cadeiras: Array<Passageiro | null>;

	constructor(id: number, capacidade: number) {
        this._id = id;
        this._cadeiras = [];
        for(let i = 0; i < capacidade; i++)
            this._cadeiras.push(null);
    }

	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
    }

	public get cadeiras(): Array<Passageiro | null> {
		return this._cadeiras;
	}
    
    search(idPass: string): Passageiro | null {
        for(let indice in this._cadeiras) {
            let pass = this._cadeiras[indice];
            if(pass && (pass.id == idPass))
                return pass;
        }
        return null;
    }
    
    getCapacidade(): number {
        return this._cadeiras.length;
    }

    getLotacao(): number {
        let cont = 0;
        for(let cadeira of this._cadeiras)
            if(cadeira)
                cont += 1;
        return cont;
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
                this._cadeiras[indice] = null;
                return pass;
            }
        }
        return null;
    }
    
    toString(): string {
        let saida = "[ ";
        for(let pass of this._cadeiras) {
            if(pass)
                saida += pass.nome + " ";
            else
                saida += "- ";
        }
        saida += "]";
        return saida;
    }

    static test() {
        let vagao = new Vagao(1, 4);
        vagao.embarcar(new Passageiro("Rui", "Rui"));
        vagao.embarcar(new Passageiro("Diana", "Diana"));
        vagao.embarcar(new Passageiro("Rehquiss", "Reh"));
        vagao.desembarcar("Rui");
        vagao.embarcar(new Passageiro("Raul", "Raul"));
        vagao.embarcar(new Passageiro("Nick", "Nick"));
        vagao.desembarcar("Reh")
        console.log("" + vagao);
    }
}

class Locomotiva {
    private _maxVagoes: number;

    constructor(max: number) {
        this._maxVagoes = max;
    }
	public get maxVagoes(): number {
		return this._maxVagoes;
	}

	public set maxVagoes(value: number) {
		this._maxVagoes = value;
	}
}

class Trem {
    private _locomotiva: Locomotiva;
    private _vagoes: Array<Vagao>;

	constructor(locomotiva: Locomotiva) {
        this._locomotiva = locomotiva;
        this._vagoes = [];
    }

    addVagao(vagao: Vagao): boolean {
        if(this._vagoes.length >= this._locomotiva.maxVagoes)
            return false;
        this._vagoes.push(vagao);
        return true;
    }

    embarque(pass: Passageiro): boolean {
        for(let vagao of this._vagoes)
            if(vagao.embarcar(pass))
                return true;
        return false;
    }

    desembarque(idPass: string): Passageiro | null {
        for(let vagao of this._vagoes) {
            let pass = vagao.desembarcar(idPass);    
            if(pass)
                return pass;
        }
        return null;
    }

    search(idPass: string): Passageiro | null {
        for(let vagao of this._vagoes) {
            let pass = vagao.search(idPass);    
            if(pass)
                return pass;
        }
        return null;
    }

    toString(): string {
        let saida = "Trem: ";
        for(let vagao of this._vagoes)
            saida += vagao;
        return saida;
    }
}

class RegistroPass {
    _passageiros: Array<Passageiro>
    constructor(){
        this._passageiros = [];
    }

    vender(pass: Passageiro){
        this._passageiros.push(pass);
    }

    toString() {
        let st = "Vendas\n";
        for(let pass of this._passageiros)
            st += pass + "\n";
        st += "-------\n";
        return st;
    }
}

class Controller {
    _trem: Trem;
    _locomotiva: Locomotiva;
    _bilhetes: RegistroPass;
    
	constructor() {
        this._locomotiva = new Locomotiva(3);
        this._trem = new Trem(this._locomotiva, );
        this._bilhetes = new RegistroPass();
    }
    
    commandLine(){

        if(ui[0] == "embarcar") {
            let pass = new Passageiro(ui[1], ui[2]);
            if(this._trem.embarque(pass))
                this._bilhetes.vender(pass);
        }

        if(ui[0] == "desembarcar") {
            if(this._trem.desembarque(ui[1]))
                cout("Desembar")
            else
                cout("Nao existe");
        }
    }
    
	
    
}