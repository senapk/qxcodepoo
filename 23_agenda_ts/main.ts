import {Fone} from './fone';
import {Contato} from './contato';
import {poo} from "./poo";
import {Agenda} from "./agenda";

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
            this.agenda.addContato(new Contato(ui[1]));
        else if(cmd == "rmCont")
            this.agenda.rmContato(ui[1]);
        else if(cmd == "addFone")//_nome _idFone _number
            this.agenda.getContato(ui[1]).addFone(new Fone(ui[2], ui[3]));
        else if(cmd == "rmFone")//_nome _idFone
            this.agenda.getContato(ui[1]).rmFone(ui[2]);
        else if(cmd == "fav")
            this.agenda.favoritar(ui[1]);
        else if(cmd == "desfav")
            this.agenda.desfavoritar(ui[1]);
        else if(cmd == "show")
            return "" + this.agenda.getContato(ui[1]);
        else if(cmd == "showFav")
            return "" + "Favoritos\n" + this.agenda.favoritos.join("\n");
        else if(cmd == "showAll")
            return "" + this.agenda;
        else
            return "comando invalido"; 
        return "done";
    }
}

let c = new Controller();
poo.shell(x => c.process(x));





