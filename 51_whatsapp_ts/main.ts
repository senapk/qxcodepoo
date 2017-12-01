import {Repository} from "./poo_repository";
import {poo} from "./poo_aux";

export class ChatNotFoundError extends Error{
    constructor(chatId: string){
        super("fail: chat " + chatId + " nao encontrado");
    }
}

export class UserNotFoundError extends Error{
    constructor(userId: string){
        super("fail: user " + userId + " nao encontrado");
    }
}

export class UserNotInChatError extends Error{
    constructor(userId: string, chatId: string){
        super("fail: user " + userId + " nao esta no chat " + chatId);
    }
}
/*
class System{
    static readonly username = "system";
    static genZapUserSemMsg(userId: string): Zap{
        return new Zap(System.username, userId + " nao possui mensagens para ler");
    }
    static genZapUserIn(userId: string): Zap{
        return new Zap(System.username, userId + " entrou no grupo");
    }
    static genZapUserOut(userId: string): Zap{
        return new Zap(System.username, userId + " saiu no grupo");
    }
}
*/

export class Zap {
    constructor(public userId: string = "", public msg: string = ""){
    }

    toString(){
        return "[" + this.userId + ": " + this.msg + "]";
    }
}

export class Notificacao{
    chatId: string;
    naoLidos: number;
    constructor(chatId = "", naoLidos = 0){
        this.chatId = chatId;
        this.naoLidos = naoLidos;
    }

    toString(){
        return this.chatId + (this.naoLidos == 0 ? "" : "(" + this.naoLidos + ")");
    }
}

export class User {
    chats: Array<Chat>;
    constructor(public userId: string = ""){
        this.chats = [];
    }

    getChats(): string[]{
        return this.chats.map(x => x.chatId);
    }

    getNotify(): Notificacao[]{
        return this.chats.map(x => 
            new Notificacao(x.chatId, x.getUnreadCount(this.userId)
        ));
    }

    toString(){
        return this.userId;
    }
};

export class UserInbox{
    user: User;
    inbox: Zap[];

    constructor(user: User){
        this.user = user;
        this.inbox = [];
    }
};

export class Chat {
    chatId: string;
    rgUserInbox: UserInbox[];

    constructor(chatId = "") {
        this.chatId = chatId;
        this.rgUserInbox = [];
    }

    getUsers(): string[]{
        return this.rgUserInbox.map(x => x.user.userId);
    }

    getUnread(userId: string): Zap[]{
        let userInbox = this.rgUserInbox.find(x => x.user.userId == userId);
        if(!userInbox)
            throw new UserNotInChatError(userId, this.chatId);
        let lista = userInbox.inbox;
        userInbox.inbox = [];
        return lista;
    }

    getUnreadCount(userId: string): number{
        let userInbox = this.rgUserInbox.find(x => x.user.userId == userId);
        if(!userInbox)
            throw new UserNotFoundError(userId);
        return userInbox.inbox.length;
    }

    hasUser(userId: string): boolean{
/*         if(userId == System.username)
            return true; */
        return this.rgUserInbox.find(x => x.user.userId == userId) != undefined;
    }

    deliverZap(zap: Zap){
        let userId = zap.userId;
        let msg = zap.msg;
        if(!this.hasUser(userId))
            throw new UserNotInChatError(userId, this.chatId);
        this.rgUserInbox.forEach(x => {
            if(x.user.userId != zap.userId)
                x.inbox.push(zap);
        });
    }

    addUserChat(user: User){
        let chat = this;
        if(chat.hasUser(user.userId))
            return;
        chat.rgUserInbox.push(new UserInbox(user));
        user.chats.push(chat);
        //chat.deliverZap(System.genZapUserIn(user.userId));
    }

    addByInvite(user: User, other: User){
        let chat = this;
        if(!chat.hasUser(user.userId))
            throw new UserNotInChatError(user.userId, chat.chatId);
        this.addUserChat(other);
    }
    
    rmUserChat(user: User){
        let chat = this;
        if(!chat.hasUser(user.userId))
            return;
        chat.rgUserInbox = chat.rgUserInbox.filter(x => x.user.userId != user.userId);
        user.chats = user.chats.filter(x => x.chatId != chat.chatId);
        //chat.deliverZap(System.genZapUserOut(user.userId));
    }

    toString(){
        return this.chatId;
    }
}


class Controller{
    rep_user: Repository<User>;
    rep_chat: Repository<Chat>;
    constructor(){
        this.rep_chat = new Repository<Chat>("chat");
        this.rep_user = new Repository<User>("user");
    }

    createNewChat(userId: string, chatId: string){
        let user = this.rep_user.get(userId);
        let chat = this.rep_chat.add(chatId, new Chat(chatId));
        chat.addUserChat(user);
    }

    process(line: string): string{
        let ui = line.split(" ");
        let cmd = ui[0];
        if(cmd == "addUser")//userId
            this.rep_user.add(ui[1], new User(ui[1]));
        else if(cmd == "allUsers")
            return "[" + this.rep_user.keys().join(" ") + "]";
        else if(cmd == "users")
            return "[" + this.rep_chat.get(ui[1]).getUsers().join(" ") + "]";
        else if(cmd == "newChat")//userId chatId
            this.createNewChat(ui[1], ui[2]);
        else if(cmd == "chats")//userId
            return "[" + this.rep_user.get(ui[1]).getChats().join(" ") + "]";
        else if(cmd == "notify")//userId
            return "[" + this.rep_user.get(ui[1]).getNotify().join(" ") + "]";
        else if(cmd == "invite")//userId otherId chatId
            this.rep_chat.get(ui[3]).addByInvite(this.rep_user.get(ui[1]), this.rep_user.get(ui[2]));
        else if(cmd == "leave")//userId chatId
            this.rep_chat.get(ui[2]).rmUserChat(this.rep_user.get(ui[1]));
        else if(cmd == "zap")//user chat msg_many_words
            this.rep_chat.get(ui[2]).deliverZap(new Zap(ui[1], ui.slice(3).join(" ")));
        else if(cmd == "ler")//userId chatId
            return this.rep_chat.get(ui[2]).getUnread(ui[1]).join("\n");
        else
            return "comando " + cmd + " nao encontrado";
        return "done";
    }
}

function mdexec(process: (line: string) => string){
    let on = false;
    poo.cout("Whatsapp v2");
    while(true){
        let line = poo.cin("");
/*         if(line == "```"){
            on = !on;
            continue;
        }
        if(!on)
            continue; */
        if(line[0] != " ")
            poo.cout(line);
        if((line.length > 0) && (line[0] != " ") && (line[0] != "#")){
            let result = "";
            try{
                result = process(line);
            }catch(e){
                result = e.message;
            }
            poo.cout(poo.tab(result, "  "));
        }
    }
}

let c = new Controller();
mdexec(x => c.process(x));