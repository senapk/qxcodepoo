class Entry<T>{
    key: string;
    value: T;
    constructor(key: string, value: T){
        this.key = key;
        this.value = value;
    }
}

class JaExisteErro extends Error{
    constructor(typename = "", key = ""){
        super("fail: " + typename + " " + "ja existe");
    }
}

class NaoExisteErro extends Error{
    constructor(typename = "", key = ""){
        super("fail: " + typename + " " + "nao existe");
    }
}

export class Repository<T> {
    private elements: Entry<T>[];
    private typename: string;

    constructor(nomeTipo: string = ""){
        this.elements = [];
        this.typename = nomeTipo;
    }

    add(key: string, t: T): T {
        if(this.has(key))
            throw new JaExisteErro(this.typename, key);
        this.elements.push(new Entry(key, t));
        this.elements.sort(); 
        return t;
    }

    has(key: string): boolean {
        return this.elements.find(x => x.key == key) != undefined;
    }

    rm(key: string) {
        if(!this.has(key))
            throw new NaoExisteErro(this.typename, key);
        this.elements = this.elements.filter(x => x.key != key);
    }

    get(key: string): T {
        let resp = this.elements.find(x => x.key == key);
        if(!resp)
            throw new NaoExisteErro(this.typename, key);
        return resp.value;
    }

    values(): Array<T>{
        return this.elements.map(x => x.value);
    }

    keys(): Array<string>{
        return this.elements.map(x => x.key);
    }
};