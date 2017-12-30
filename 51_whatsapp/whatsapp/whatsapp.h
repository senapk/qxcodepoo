#ifndef ALU_DIS
#define ALU_DIS

#include <iostream>
#include <vector>
#include <map>
#include "poo_aux.h"

using namespace std;

struct Zap {
    string userId;
    string msg;
    Zap(string user, string msg){
        this->userId = user;
        this->msg = msg;
    }
    string toString(){
        return "[" + this->userId + ": " + this->msg + "]";
    }
    TO_OSTREAM(Zap)
};

class Chat;

class User{
    map<string, Chat*> lista_chat;
public:
    string userId;

    User(string chatId = ""){
        this->userId = chatId;
    }

    vector<string> getChats(){
        return poo::map_keys(this->lista_chat);
    }

    string getOverview();

    void assertChat(string chat){
        if(lista_chat.count(chat) == 0)
            throw "fail: user " + this->userId + " nao esta no chat " + chat;
    }

    void invite(string chatId, User * elem);

    void leave(string chatId);

    void sendZap(string msg, string chatId);

    string toString(){
        return userId;
    }

    TO_OSTREAM(User)
    friend class Chat;
};

struct Registro{
    User* user;
    int unreadCount;
    Registro(User * user = nullptr){
        this->user = user;
        this->unreadCount = 0;
    }
};

class Chat {
    map<string, Registro> lista_reg;
    list<Zap> lista_zap;    

public:
    static bool enableInOutMsgs;
    static const string systemUsername;
    string id;

    Chat(string nome = ""){
        this->id = nome;
    }

    void addFirstUser(User * creator){
        if(lista_zap.size() != 0)
            throw string("") + "A lista ja foi criada";
        this->lista_reg[creator->userId] = Registro(creator);
        creator->lista_chat[id] = this;
    }

    vector<string> getUsers(){
        return poo::map_keys(lista_reg);
    }

    void assertUser(string userId){
        if(lista_reg.count(userId) == 0)
            throw "fail: user " + userId + " nao esta no chat " + this->id;
    }

    void deliverZap(Zap zap){
        if(zap.userId != systemUsername)
            this->assertUser(zap.userId);
        this->lista_zap.push_front(zap);
        for(auto& registro : lista_reg)
            if(registro.second.user->userId != zap.userId)
                registro.second.unreadCount++;
    }

    list<Zap> getUnread(string userId){
        this->assertUser(userId);
        list<Zap> lista;
        auto& unread = this->lista_reg[userId].unreadCount;
        auto it_zap = this->lista_zap.begin();
        while((int) lista.size() < unread){
            if(it_zap->userId != userId)
                lista.push_back(*it_zap);
            it_zap++;
        }
        unread = 0;
        if(lista.size() == 0)
            lista.push_back(Zap(systemUsername, "voce nao tem novas mensagens"));
        return lista;
    }
    int getUnreadCount(string userId){
        assertUser(userId);
        return this->lista_reg[userId].unreadCount;
    }

    bool hasUser(string userId){
        return lista_reg.count(userId);
    }

    string toString(){
        return id;
    }

    TO_OSTREAM(Chat)
    friend class User;
};

bool Chat::enableInOutMsgs = false;
const string Chat::systemUsername("system");

string User::getOverview(){
    string saida = "[";
    for(auto par : this->lista_chat){
        saida += par.first;
        int unread = par.second->getUnreadCount(userId);
        if(unread > 0)
            saida += "(" + to_string(unread) + ")";
        saida += " ";
    }
    if(saida.size() > 1)
        saida.pop_back();//ultimo espaco
    return saida + "]";
}

void User::sendZap(string msg, string chatId){
    assertChat(chatId);
    lista_chat[chatId]->deliverZap(Zap(this->userId, msg));
}

void User::invite(string chatId, User *elem){
    this->assertChat(chatId);
    Chat * chat = lista_chat[chatId];
    if(chat->hasUser(elem->userId))
        return;
    chat->lista_reg[elem->userId] = Registro(elem);
    elem->lista_chat[chatId] = chat;
    if(Chat::enableInOutMsgs)
        chat->deliverZap(Zap(Chat::systemUsername, elem->userId + " foi adicionado"));
}

void User::leave(string chatId){
    this->assertChat(chatId);
    if(Chat::enableInOutMsgs)
        this->lista_chat[chatId]->deliverZap(Zap(Chat::systemUsername, this->userId + " saiu do grupo"));
    this->lista_chat[chatId]->lista_reg.erase(this->userId);
    this->lista_chat.erase(chatId);
}


#endif // ALU_DIS
