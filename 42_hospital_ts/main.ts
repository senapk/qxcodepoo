export class Repository<T> {
    private mapa: Map<string, T>;
    private nomeTipo: string;

    private genMsgJaExiste(key: string): string {
        return "fail: " + this.nomeTipo + " " + key + " ja existe";
    }

    private genMsgNaoExiste(key: string): string {
        return "fail: " + this.nomeTipo + " " + key + " nao existe";
    }

    constructor(nomeTipo: string = ""){
        this.mapa = new Map<string, T>();
        this.nomeTipo = nomeTipo;
    }

    add(key: string, t: T): T {
        if(this.mapa.has(key))
            throw new Error(this.genMsgJaExiste(key));
        this.mapa.set(key, t);
        return t;
    }

    has(key: string): boolean {
        return this.mapa.has(key);
    }

    rm(key: string) {
        if(!this.mapa.delete(key))
            throw new Error(this.genMsgNaoExiste(key));
    }

    get(key: string): T {
        let resp = this.mapa.get(key);
        if(!resp)
            throw new Error(this.genMsgNaoExiste(key));
        return resp;
    }
    
    values(): Array<T>{
        return Array.from(this.mapa.values());
    }

    keys(): Array<string>{
        return Array.from(this.mapa.keys());
    }
};

export class Msg{
    nome: string;
    text: string;
    constructor(nome = "", text = ""){
        this.nome = nome;
        this.text = text;
    }
    toString(){
        return "[" + this.nome + ": " + this.text + "]";
    }
}

export abstract class Pessoa{
    nome: string;
    inbox: Array<Msg>;
    constructor(nome = ""){
        this.nome = nome;
        this.inbox = [];
    }

    abstract getDestinatario(nome: string): Pessoa | undefined;

    sendMsg(nomeTo: string, text: string){
        let msg = new Msg(this.nome, text);
        let dest = this.getDestinatario(nomeTo);
        if(!dest)
            throw new Error("fail" + this.nome + " nao conhece " + nomeTo);
        dest.inbox.push(msg);
    }

    readMsgs(): Array<Msg>{
        let aux = this.inbox;
        this.inbox = [];
        return aux;
    }
}

export class Paciente extends Pessoa {
    public diag: string;
    public medicos: Array<Medico>;

    constructor(nome: string = "", diag: string = ""){
        super(nome);
        this.diag = diag;
        this.medicos = [];
    }

    getDestinatario(nome: string): Pessoa | undefined {
        return this.medicos.find(x => x.nome == nome);
    }

    toString(){
        return "Pac: " + this.nome + ":" + this.diag + "\tMeds:" + 
               " [" + this.medicos.map(x => x.nome).join(" ") + "]";
    }
};

export class Medico extends Pessoa {
    public espec: string;
    public pacientes: Paciente[];

    constructor(nome: string = "", diag: string = "") {
        super(nome);
        this.espec = diag;
        this.pacientes = [];
    }

    getDestinatario(nome: string): Pessoa | undefined {
        return this.pacientes.find(x => x.nome == nome);
    }

    atender(paciente: Paciente){
        let pac = this.pacientes.find(x => x.nome == paciente.nome);
        if(pac)
            return;
        let outroMedico = paciente.medicos.find(x => x.espec == this.espec);
        if(outroMedico)
            throw new Error("fail: ja existe outro medico da especialidade " + this.espec);
        this.pacientes.push(paciente);
        paciente.medicos.push(this);
    }

    toString(){
        return "Med: " + this.nome + ":" + this.espec + "\tPacs:" +
        " [" + this.pacientes.map(x => x.nome).join(" ") + "]";
    }
}

class Controller{
    r_med: Repository<Medico>;
    r_pac: Repository<Paciente>;
    r_pes: Repository<Pessoa>;

    constructor(){
        this.r_med = new Repository<Medico>();
        this.r_pac = new Repository<Paciente>();
        this.r_pes = new Repository<Pessoa>();
    }

    process(line: string): string {
        let ui = line.split(" ");
        let cmd = ui[0];

        if(cmd == "addPacs"){
            for(let i = 1; i < ui.length; i++){
                let [nome, diag] = ui[i].split("-");
                let pac = new Paciente(nome, diag);
                this.r_pes.add(nome, pac);
                this.r_pac.add(nome, pac);
            }
        }else if(cmd == "addMeds"){
            for(let i = 1; i < ui.length; i++){
                let [nome, espec] = ui[i].split("-");
                let med = new Medico(nome, espec);
                this.r_pes.add(nome, med);
                this.r_med.add(nome, med);
            }
        }else if(cmd == "seeAll"){
            return this.r_pes.values().join("\n");
        }else if(cmd == "tie"){
            let med = this.r_med.get(ui[1]);
            for(let i = 2; i < ui.length; i++)
                med.atender(this.r_pac.get(ui[i]));
        }else if(cmd == "msg"){//from to msg
            this.r_pes.get(ui[1]).sendMsg(ui[2], ui.slice(3).join(" "));
        }else if(cmd == "inbox"){
            let nome = ui[1];
            return this.r_pes.get(nome).readMsgs().join("\n");
        }else{
            return "comando nao encontrado";
        }
        return "done";
    }
}



//-----------------------------------------------------------

declare function require(name: string): any;
var readline = require('readline-sync');
readline.setDefaultOptions({keepWhitespace : true});

let cin = (text: string) => readline.question(text);
let cout = (text: string) => console.log(text);
let tab = (text: string, prefix: string = "  ") => {
    return prefix + text.split("\n").join("\n" + prefix);
}

function exec(process: (line: string) => string){
/*     let on = false; */
    cout("Hospital");
    while(true){
        let line = cin("");
/*         if(line == "```"){
            on = !on;
            continue;
        }
        if(!on)
            continue; */
        cout(line);
        if((line.length > 0) && (line[0] != " ") && (line[0] != "#")){
            let result = "";
            try{
                result = process(line);
            }catch(e){
                result = e.message;
            }
            cout(tab(result, "  "));
        }
    }
}

let c = new Controller();
exec(x => c.process(x));