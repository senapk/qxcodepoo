#ifndef MATRICULA
#define MATRICULA

#include <iostream>
#include <vector>
#include <map>
#include "poo_aux.h"
using namespace std;

class Aluno;

class Discp{
    map<string, Aluno*> m_aluno;
public:
    string idDiscp;

    Discp(string nome = ""){
        this->idDiscp = nome;
    }

    vector<Aluno*> getAllAlu(){
        return poo::map_values(m_aluno);
    }

    string toString(){
        return this->idDiscp;
    }
    TO_OSTREAM(Discp)

    friend class Aluno;
};

class Aluno{
    map<string, Discp*> m_discp;
public:
    string idAluno;
    Aluno(string nome = ""){
        this->idAluno = nome;
    }

    vector<Discp*> getAllDis(){
        return poo::map_values(m_discp);
    }

    void addDiscp(Discp* discp){
        if(m_discp.count(discp->idDiscp))
            return;
        this->m_discp[discp->idDiscp] = discp;
        discp->m_aluno[this->idAluno] = this;
    }

    void rmDiscp(string idDiscp){
        if(m_discp.count(idDiscp) == 0)
            return;
        this->m_discp[idDiscp]->m_aluno.erase(this->idAluno);
        this->m_discp.erase(idDiscp);
    }

    string toString(){
        return idAluno;
    }
    TO_OSTREAM(Aluno)
};

#endif // ALU_DIS
