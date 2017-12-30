declare function require(name: string): any;
var readline = require('readline-sync');
readline.setDefaultOptions({keepWhitespace : true});

export class poo{
    static cin(text: string): string{
        return readline.question(text);
    }

    static cout(text: string){
        console.log(text);
    }

    //recebe um texto e retorna o texto com um tab de 2 espacos
    static tab(text: string, prefix: string = "  "): string {
        return prefix + text.split("\n").join("\n" + prefix);
    }

    static shell(process: (line :string) => string){
        while(true){
            let line = poo.cin(">>");
            try{
                let result = process(line);
                poo.cout(poo.tab(result));
            }catch(e){
                poo.cout(poo.tab(e.message));
            }
        }
    }
}