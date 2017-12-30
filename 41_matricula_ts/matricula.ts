import {poo} from "./poo_aux";

export class Discp{
    m_aluno: Map<string, Aluno>;
    idDiscp: string;

    constructor(nome = ""){
        this.idDiscp = nome;
        this.m_aluno = new Map<string, Aluno>();
    }

    matricular(aluno: Aluno){
        if(this.m_aluno.has(aluno.idAluno))
            return;
        this.m_aluno.set(aluno.idAluno, aluno);
        aluno.matricular(this);
    }

    desmatricular(idAluno: string){
        let aluno = this.m_aluno.get(idAluno);
        if(!aluno)
            return;
        this.m_aluno.delete(idAluno);
        aluno.desmatricular(this.idDiscp);
    }

    getAllAlu(): Array<Aluno>{
        return poo.map2vet(this.m_aluno);
    }

    toString(): string{
        return this.idDiscp;
    }
};

export class Aluno{
    m_discp: Map<string, Discp>;

    idAluno: string;

    constructor(nome: string = ""){
        this.idAluno = nome;
        this.m_discp = new Map<string, Discp>();
    }

    getAllDis(): Array<Discp>{
        return poo.map2vet(this.m_discp);
    }

    matricular(discp: Discp){
        if(this.m_discp.has(discp.idDiscp))
            return;
        this.m_discp.set(discp.idDiscp, discp);
        discp.matricular(this);
    }

    desmatricular(idDiscp: string){
        let discp = this.m_discp.get(idDiscp);
        if(!discp)
            return;
        this.m_discp.delete(idDiscp);
        discp.desmatricular(this.idAluno);
    }

    toString(): string{
        return this.idAluno;
    }
};
