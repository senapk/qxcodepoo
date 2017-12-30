#include <iostream>
#include "poo_aux.h"
#include "poo_controller.h"
#include "poo_repository.h"

#include "twitter.h"

using namespace std;


string HELP = R"(
help
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
)";

class TwitterService : public Controller {
    Repository<User> r_user;
    Repository<Tweet> r_twee;
    TweetGenerator twgen;

public:
    TwitterService():
        r_user("usuario"), r_twee("tweet"),twgen(&r_twee)
    {
    }

    string process(string line) {
        auto ui = poo::split(line, ' ');
        auto cmd = ui[0];

        if(cmd == "help")
            return HELP;
        else if(cmd == "addUser")
            this->r_user.add(ui[1], User(ui[1]));
        else if(cmd == "users")
            return "usuarios " + r_user.keys();
        else if(cmd == "seguir")
            this->r_user.get(ui[1])->seguir(this->r_user.get(ui[2]));
        else if(cmd == "twittar"){
            auto texto = poo::join(poo::slice(ui, 2), " ");
            this->r_user.get(ui[1])->twittar(twgen.create(ui[1], texto));
        }else if(cmd == "seguidores"){
            return "" + *this->r_user.get(ui[1])->seguidores;
        }else if(cmd == "seguidos"){
            return "" + *this->r_user.get(ui[1])->seguidos;
        }else if(cmd == "timeline"){
            return "" + *this->r_user.get(ui[1])->timeline;
        }else if(cmd == "unread"){
            auto lista = this->r_user.get(ui[1])->getUnread();
            return "unread\n" + poo::join(*lista, "\n");
        }else if(cmd == "myTweets"){
            auto lista = this->r_user.get(ui[1])->myTweets;
            return "MyTweets\n" + poo::join(*lista, "\n");
        }else if(cmd == "like"){
            auto timeline = this->r_user.get(ui[1])->getTimeline();
            for(auto tweet : timeline)
                if(tweet->idTw == poo::Int(ui[2]))
                    tweet->addLike(ui[1]);
        }
        else if(cmd == "fim")
            return "fim";
        else
            return "comando invalido";
        return "done";


    }
};

int main(){
    TwitterService c;
    c.commandLine();
    return 0;
}




