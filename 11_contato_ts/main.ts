class Fone {
    id : string;
    numero : string;

    constructor(id : string = "" , numero : string = ""){
        this.id = id;
        this.numero = numero;
    }

    toString(){
        return "[" + this.id + ":" + this.numero + "]";
    }
}

class Contato{
    id : string;
    fones : Fone[];
    
    constructor(nome : string = "") {
        this.id = nome;
        this.fones = [];
    }

    toString(): string {
        let saida = this.id + " ";
        for(let fone of this.fones)
            saida += "" + fone;
        return saida;
        //ou apenas
        //return this.id + " " + this.fones.join("");
    }

    addFone(fone : Fone): void {
        for(let elemento of this.fones)
            if (elemento.id == fone.id)
                throw new Error("fail: fone " + fone.id + " ja existe");
        this.fones.push(fone); 
    }

    rmFone(foneId : string): void {
        for (let i in this.fones){
            if (this.fones[i].id == foneId){
                //remove 1 elemento a partir da posicao i
                this.fones.splice(Number(i), 1);
                return;
            }
        }
        throw new Error("fail: fone " + foneId + " nao existe");  
    }
}

class Controller {
    contato: Contato;
    constructor(){
        this.contato = new Contato("-");
    }

    process(line: string) : string{
        let ui = line.split(" ");
        let cmd = ui[0];
        let HELP =  "iniciar _nome \n" + 
                    "show \n" + 
                    "addFone _id _numero \n" + 
                    "rmFone _id";  
        
        if (cmd == "help") {
            return HELP;
        } else if (cmd == "iniciar") { //nome email
            this.contato = new Contato(ui[1]);
        } else if (cmd == "addFone") {
            this.contato.addFone(new Fone(ui[1], ui[2]));
        } else if (cmd == "rmFone") {
            this.contato.rmFone(ui[1]);
        } else if (cmd == "show") {
            return "" + this.contato;
        } else {
            return "comando invalido";
        }
        return "done";
    }
}

//--------------------------------------------------
import {poo} from "./poo_aux";

let agenda = new Controller();
poo.print("Digite um comando ou help: ");
while(true){
    let line = poo.getline("");
    if((line == "") || (line[0] == " ")) //vazio ou resposta
        continue;
    try {
        poo.print("  " + agenda.process(line));
    } catch(e) {
        poo.print("  " + e.message);
    }
}

/*
iniciar david
  done
addFone oi 881
  done
addFone tim 991
  done 
addFone casa 321
  done 
show
  david [oi:881][tim:991][casa:321]
rmFone casa
  done
show
  david [oi:881][tim:991]
rmFone claro
  fail: fone claro nao existe
addFone tim 992
  fail: fone tim ja existe
*/










