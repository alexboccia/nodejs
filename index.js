// módulos externos
const chalk = require('chalk');
const inquirer = require('inquirer');

// módulo interno (core)
const fs = require('fs');

// inicializando o programa
operation();

function operation() {

  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Selecione uma das opções abaixo:',
      choices: ['Criar Conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair']
    }
  ])
  .then(answer => {
    const action = answer['action'];

    console.log(action);
  })
  .catch(err => console.log(err));

};
