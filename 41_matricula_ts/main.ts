import {poo} from "./poo_aux";
import {Repository} from "./poo_repository";
import {Controller} from "./poo_controller";
import {Aluno, Discp} from "./matricula";

let HELP = `help
addAlu     _aluno
addDis     _disc
matric     _aluno _disc _disc ...
showDis    _disc
showAlu    _aluno
desmatric  _aluno _disc _disc ...
showAllAlu
showAllDis
rmAlu   _aluno`;

class ServicoMatricula extends Controller{
    r_alu: Repository<Aluno>;
    r_dis: Repository<Discp>;

    constructor(){
        super();
        this.r_alu = new Repository<Aluno>("aluno");
        this.r_dis = new Repository<Discp>("discp");
    }

    process(line: string): string {
        let ui = line.split(" ");
        let cmd = ui[0];

        if(cmd == "help")
            return HELP;
        else if(cmd == "addAlu")
            this.r_alu.add(ui[1], new Aluno(ui[1]));
        else if(cmd == "addDis")
            this.r_dis.add(ui[1], new Discp(ui[1]));
        else if(cmd == "matric")
            for(let i = 2; i < ui.length; i++)
                this.r_alu.get(ui[1]).matricular(this.r_dis.get(ui[i]));
        else if(cmd == "showAlu"){
            let aluno = this.r_alu.get(ui[1]);
            return aluno.idAluno + "[" + aluno.getAllDis().join(" ") + "]";
        }else if(cmd == "showDis"){
            let discp = this.r_dis.get(ui[1]);
            return discp.idDiscp + "[" + discp.getAllAlu().join(" ") + "]";
        }else if(cmd == "desmatric"){
            for(let i = 2; i < ui.length; i++)
                this.r_alu.get(ui[1]).desmatricular(ui[i]);
        }else if(cmd == "showAllAlu"){
            return "[" + this.r_alu.keys().join(" ") + "]";
        }else if(cmd == "showAllDis"){
            return "[" + this.r_dis.keys().join(" ") + "]";
        }else if(cmd == "rmAlu"){
            let aluno = this.r_alu.get(ui[1]);
            for(let disc of aluno.getAllDis())
                aluno.desmatricular(disc.idDiscp);
            this.r_alu.rm(ui[1]);
        }else if(cmd == "fim")
            return "";
        else
            return "comando invalido " + "[" + cmd + "]";
        return "done";
    }
};


let sm = new ServicoMatricula();
sm.debug = true;
sm.commandLine();




