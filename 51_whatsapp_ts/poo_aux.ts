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

    static tab(text: string, prefix: string){
        return prefix + text.split("\n").join("\n" + prefix);
    }
}
