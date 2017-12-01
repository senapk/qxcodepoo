import {poo} from "./poo_aux";

export class Controller{
    constructor(){
    }

    process(line: string): string {
        return line;
    }
    
    commandLine(){
        let line = "";
        poo.cout("Digite cmd, help ou fim");
        while(line != "fim"){
            line = poo.cin("");
            if((line == "") || (line.substr(0, 2) == "  "))
                continue;
            poo.cout(line);
            if(line[0] == '#')
                continue;
            try {
                poo.cout(poo.tab(this.process(line)));
            }catch(e){
                poo.cout(poo.tab("" + e.message));
            }
        }
    }
}