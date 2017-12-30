import {poo} from "./poo_aux";
import {Repository} from "./poo_repository";

export class Fone {
    private foneId: string;
    private number: string;

    constructor(id: string = "", number: string = "") {
        this.foneId = id;
        this.number = number;
    }

    toString(): string {
        return "[" + this.foneId + " " + this.number + "]";
    }   
}

export class Contato {
    readonly nome: string;
    public fones: Repository<Fone>;
    public favorited: boolean;
    
    constructor(nome: string = "") {
        this.nome = nome;
        this.fones = new Repository("fone");
    }
    
    toString(): string {
        let saida = "";
        saida += (this.favorited) ? "@" : "-";
        saida += " " + this.nome + " " + this.fones.values().join("");
        return saida;
    }
}

export class Agenda {
    public contatos: Repository<Contato>;//mapa de contatos
    public favoritos: Repository<Contato>;//mapa de favoritos

    constructor(){
        this.contatos = new Repository<Contato>("contato");
        this.favoritos = new Repository<Contato>("favorito");
    }

    favoritar(contId: string) {
        let cont = this.contatos.get(contId);
        this.favoritos.add(contId, cont);
        cont.favorited = true;
    }

    desfavoritar(contId: string) {
        let cont = this.contatos.get(contId);
        this.favoritos.rm(contId);
        cont.favorited = false;   
    }

    rmContato(contId: string){
        this.contatos.rm(contId);
        this.favoritos.rm(contId);
    }

    toString(): string {
        return "Agenda\n" + this.contatos.values().join("\n") + "\n";
    }
}


const HELP = "" +
            "addCont  _nome" + "\n" +
            "rmCont   _nome" + "\n" +
            "addFone  _nome _foneid _number" + "\n" +
            "rmFone   _nome _foneid" + "\n" +
            "fav      _nome" + "\n" + 
            "desfav   _nome" + "\n" +
            "show     _nome" + "\n" + 
            "showFav"        + "\n" + 
            "showAll"        + "\n" +
            "fim";

class Controller {
    private agenda: Agenda;
    
    constructor(){
        this.agenda = new Agenda();
    }

    process(line: string): string {
        let ui = line.split(" ");
        let cmd = ui[0];

        if(cmd == "help")
            return HELP;
        else if(cmd == "addCont")
            this.agenda.contatos.add(ui[1], new Contato(ui[1]));
        else if(cmd == "rmCont")
            this.agenda.rmContato(ui[1]);
        else if(cmd == "addFone")//_nome _idFone _number
            this.agenda.contatos.get(ui[1]).fones.add(ui[2], new Fone(ui[2], ui[3]));
        else if(cmd == "rmFone")//_nome _idFone
            this.agenda.contatos.get(ui[1]).fones.rm(ui[2]);
        else if(cmd == "fav")
            this.agenda.favoritar(ui[1]);
        else if(cmd == "desfav")
            this.agenda.desfavoritar(ui[1]);
        else if(cmd == "show")
            return "" + this.agenda.contatos.get(ui[1]);
        else if(cmd == "showFav")
            return "" + "Favoritos\n" + this.agenda.favoritos.values().join("\n");
        else if(cmd == "showAll")
            return "" + this.agenda;
        else
            return "comando invalido"; 
        return "done";
    }
}

let c = new Controller();
poo.shell(x => c.process(x));





