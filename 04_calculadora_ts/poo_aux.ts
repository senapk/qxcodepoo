declare function require(name: string): any;
var readline = require('readline-sync');
readline.setDefaultOptions({keepWhitespace : true});

export class poo{
    static getline(text: string): string{
        return readline.question(text);
    }

    static print(text: string){
        console.log(text);
    } 
    
    //recebe um texto e retorna o texto com um tab de 2 espacos 
    static tab(text: string, prefix: string = "  "): string {
        return prefix + text.split("\n").join("\n" + prefix);
    }

    static shell(process: (line :string) => string){
        poo.print("Digite um comando ou help: ");
        while(true){
            let line = poo.getline("");
            if((line == "") || (line.substr(0, 1) == " ")) //resposta
                continue;
            try{
                let result = process(line);
                poo.print(poo.tab(result));
            }catch(e){
                poo.print(poo.tab(e.message));
            }
        }
    }
}