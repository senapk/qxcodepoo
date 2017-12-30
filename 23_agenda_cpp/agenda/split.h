#ifndef SPLIT
#define SPLIT
#include <sstream>
#include <vector>

std::vector<std::string> split(std::string line, char delim){
    std::vector<std::string> vet;
    std::stringstream ss(line);
    std::string palavra;
    while(std::getline(ss, palavra, delim))
        vet.push_back(palavra);
    return vet;
}

template <class T>
T cast(std::string word){
    T value;
    std::stringstream ss(word);
    ss >> value;
    if(!ss)
        throw "Conversao invalida da palavra " + word;
    return value;
}

inline int Int(std::string word){
    return cast<int>(word);
}

inline int Float(std::string word){
    return cast<float>(word);
}

std::string tabulate(std::string in, std::string prefix){
    auto lista = split(in, '\n');
    auto saida = std::string("");
    for(auto line : lista)
        saida += prefix + line + "\n";
    return saida;
}

#endif // SPLIT

