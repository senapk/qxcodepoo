export class Repository<T> {
    private mapa: Map<string, T>;
    private nomeTipo: string;

    constructor(nomeTipo: string = ""){
        this.mapa = new Map<string, T>();
        this.nomeTipo = nomeTipo;
    }

    add(key: string, t: T): T {
        if(this.mapa.has(key))
            throw new Error("" + this.nomeTipo + " " + key + " ja existe");
        this.mapa.set(key, t);
        //reordena em cada inserção.
        this.mapa = new Map([...this.mapa.entries()].sort()); 
        return t;
    }

    has(key: string): boolean {
        return this.mapa.has(key);
    }

    rm(key: string) {
        if(!this.mapa.delete(key))
            throw new Error("fail" + this.nomeTipo + " " + key + " nao existe");
    }

    get(key: string): T {
        let resp = this.mapa.get(key);
        if(!resp)
            throw new Error("fail" + this.nomeTipo + " " + key + " nao existe");
        return resp;
    }

    values(): Array<T>{
        return Array.from(this.mapa.values());
    }

    keys(): Array<string>{
        return Array.from(this.mapa.keys());
    }
};
