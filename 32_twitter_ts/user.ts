export class Tweet{
    readonly idTw: number;
    readonly username: string;
    likes: Array<string>;
    msg: string;

    constructor(idTw: number, username : string, msg : string){
        this.idTw = idTw;
        this.username = username;
        this.likes = [];
        this.msg = msg;        
    }
    toString(){
        return this.idTw + " " +  this.username + ": " + this.msg + 
                ((this.likes.length > 0) ? (" {" + this.likes.join(" ") + "}") : "");
    }
}

export class User{
    private static _nextIdTw = 0;

    private _username: string;
    private _unreadCount: number;

    private _seguidos: Array<User>;
    private _seguidores: Array<User>;

    private _myTweets: Array<Tweet>;
    private _timeline: Array<Tweet>;

    constructor(username : string){
        this._username = username;
        this._unreadCount = 0;
        
        this._seguidos = [];
        this._seguidores = [];

        this._myTweets = [];
        this._timeline = [];
    }

    seguir(user: User){
        this._seguidos.push(user);
        user._seguidores.push(this);
    }

    twittar(msg: string){
        let tw = new Tweet(User._nextIdTw, this._username, msg);
        User._nextIdTw += 1;

        this._myTweets.unshift(tw);
        for (let seguidor of this._seguidores){
            seguidor._timeline.unshift(tw);
            seguidor._unreadCount += 1;
        }
    }

    darLike(idTw: number): void{
        for(let tw of this._timeline){
            if(tw.idTw == idTw){
                tw.likes.push(this._username);
                return;
            }
        }
        throw new Error("  tweet id " + idTw + " nao existe neste usuario");
    }

    get unread(): Array<Tweet>{
        let vet = new Array<Tweet>();
        for(let i = 0; i < this._unreadCount; i++){
            vet.push(this._timeline[i]);
        }
        this._unreadCount = 0;
        return vet;
    }

    get timeline(): Array<Tweet>{
        this._unreadCount = 0;
        return this._timeline;
    }

    get seguidores(): Array<string>{
        let saida = new Array<string>();
        for(let elem of this._seguidores)
            saida.push(elem._username);
        return saida;
    }
    
    get seguidos(): Array<string>{
        let saida = new Array<string>();
        for(let elem of this._seguidos)
            saida.push(elem._username);
        return saida;
    }

    get myMsgs(): Array<Tweet>{
        return this._myTweets;
    }

    toString(): string{
        return this._username;
    }
}