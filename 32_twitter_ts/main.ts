import {poo} from "./poo_aux";
import {Repository} from "./poo_repository";
import {Controller} from "./poo_controller";
import {Tweet, User} from "./user";

let HELP = `help
users
addUser    _nome
seguir     _nome _outro
twittar    _nome _(mensagem com varias palavras)
like       _nome
seguidores _nome
seguidos   _nome
timeline   _nome
myTweets   _nome
unread     _nome
`;

class Service extends Controller{
    repo: Repository<User>;

    constructor(){
        super();
        this.repo = new Repository<User>("usuario");
    }

    process(line: string): string {
        let ui = line.split(" ");
        let cmd = ui[0];

        if(cmd == "help")
            return HELP;
        else if(cmd == "addUser")
            this.repo.add(ui[1], new User(ui[1]));
        else if(cmd == "users")
            return "usuarios\n[" + this.repo.keys().join(" ") + "]";
        else if(cmd == "seguir")
            this.repo.get(ui[1]).seguir(this.repo.get(ui[2]));
        else if(cmd == "twittar")
            this.repo.get(ui[1]).twittar(ui.slice(2).join(" "));
        else if(cmd == "seguidores")
            return "[" + this.repo.get(ui[1]).seguidores.join(" ") + "]";
        else if(cmd == "seguidos")
            return "[" + this.repo.get(ui[1]).seguidos.join(" ") + "]";
        else if(cmd == "timeline")
            return "timeline\n  " + this.repo.get(ui[1]).timeline.join("\n  ");
        else if(cmd == "unread")
            return "unread\n  " + this.repo.get(ui[1]).unread.join("\n  ");
        else if(cmd == "myTweets")
            return "MyTweets\n  " + this.repo.get(ui[1]).myMsgs.join("\n  ");
        else if(cmd == "like")
            this.repo.get(ui[1]).darLike(Number(ui[2]));
        else if(cmd == "fim")
            return "fim";
        else
            return "comando invalido";
        return "done";
    }
}

let c = new Service();
c.commandLine();
