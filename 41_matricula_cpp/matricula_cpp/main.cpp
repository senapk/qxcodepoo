#include <iostream>
#include "matricula.h"
#include "poo_aux.h"
#include "poo_repository.h"
#include "poo_controller.h"
using namespace std;
using namespace poo;

string HELP = R"(help
addAlu  _aluno
addDis  _disc
addAD   _aluno _disc _disc ...
showDis _disc
showAlu _aluno
rmAD    _aluno _disc _disc ...
showAllAlu
showAllDis
rmAlu   _aluno
)";

class ServicoMatricula : public Controller{
    Repository<Aluno> r_alu;
    Repository<Discp> r_dis;

public:
    ServicoMatricula():
        r_alu("aluno"),
        r_dis("discp")
    {

    }

    string process(string line){
        auto ui = poo::split(line);
        auto cmd = ui[0];

        if(cmd == "help")
            return HELP;
        else if(cmd == "addAlu")
            r_alu.add(ui[1], Aluno(ui[1]));
        else if(cmd == "addDis")
            r_dis.add(ui[1], Discp(ui[1]));
        else if(cmd == "addAD")
            for(int i = 2; i < (int) ui.size(); i++)
                r_alu.get(ui[1])->addDiscp(r_dis.get(ui[i]));
        else if(cmd == "showAlu"){
            auto aluno = r_alu.get(ui[1]);
            return aluno->idAluno + *aluno->getAllDis();
        }else if(cmd == "showDis"){
            auto discp = r_dis.get(ui[1]);
            return discp->idDiscp + *discp->getAllAlu();
        }else if(cmd == "rmAD"){
            for(int i = 2; i < (int) ui.size(); i++)
                r_alu.get(ui[1])->rmDiscp(ui[i]);
        }else if(cmd == "showAllAlu"){
            return "" + r_alu.keys();
        }else if(cmd == "showAllDis"){
            return "" + r_dis.keys();
        }else if(cmd == "rmAlu"){
            auto aluno = r_alu.get(ui[1]);
            for(auto disc : aluno->getAllDis())
                aluno->rmDiscp(disc->idDiscp);
            r_alu.rm(ui[1]);
        }else if(cmd == "fim")
            return "";
        else
            return string("") + "comando invalido " + "[" + cmd + "]";
        return "done";
    }
};


int main(){
    ServicoMatricula c;
    c.debug = true;
    c.commandLine();
    return 0;
}




