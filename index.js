// módulos externos
const chalk = require('chalk');
const inquirer = require('inquirer');

// módulo interno (core)
const fs = require('fs');

// inicializando o programa
operation();

function operation() {
  console.log(chalk.bgGreenBright.black(" CAIXA ELETRÔNICO 24 HORAS \n"));

  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Selecione uma das opções abaixo:',
      choices: [
        'Criar Conta', 
        'Consultar Saldo', 
        'Depositar', 
        'Sacar', 
        'Sair',
      ]
    },
  ])
  .then(answer => {
    const action = answer['action'];

    if(action === 'Criar Conta') {
      typeAccount();
    } else if(action === 'Consultar Saldo') {

    } else if(action === 'Depositar') {
      const actionAccount = action;
      typeAccount(actionAccount);
    } else if(action === 'Sacar') {
      
    } else if('Sair') {
      console.log(chalk.bgBlue.black('\n Obrigado por usar o caixa eltrônico 24 Horas. \n'));
      process.exit();
    };
  
  })
  .catch(err => console.log(err));

};

// create account 
function createAccount() {
  console.log(chalk.bgGreen.black('Parabéns! Por escolher o nosso banco.'));
  console.log(chalk.green('Escolha as opções a seguir'));

  typeAccount();

};

function typeAccount(actionAccount) {

  inquirer.prompt([
    {
      type: 'list',
      name: 'typeAccount',
      message: 'Escolha abaixo o tipo de conta que desejar realizar a operação:',
      choices: [
        'Conta Corrente', 
        'Conta Poupanca'
      ],
    },
  ])
  .then(answer => {
    const typeAccount = answer['typeAccount'];
    switch(typeAccount) {
      case 'Conta Corrente':
        if(actionAccount === 'Depositar') {
          const folderName = 'checkingAccounts/';
          const typeAccount = 'Conta Corrente';
          deposit(folderName, typeAccount);
        } else {
          createCheckingAccount();
        }
        break;
      case 'Conta Poupanca':
        if(actionAccount === 'Depositar') {
          const folderName = 'savingAccounts/';
          const typeAccount = 'Conta Poupança';
          deposit(folderName, typeAccount);
        } else {
          createSavingAccount();
        }
      break;
      default:
        console.log('Opção inválida');
    }
  })
  .catch(err => console.log(err));

};

// criar Conta Corrente
function createCheckingAccount() {
  inquirer.prompt([
    {
      name: "createCheckingAccount",
      message: "Digite o número da sua conta:",
    }
  ])
  .then((answer) => {
    const createCheckingAccount = answer['createCheckingAccount'];

    console.log('\n---------------------------------------------------------------------------------------------\n');

    // criar diretório para armazenar contas
    if(!fs.existsSync('checkingAccounts')) {
      fs.mkdirSync('checkingAccounts');
    };

    // validar se o nome da conta já existe
    if(fs.existsSync(`checkingAccounts/${createCheckingAccount}.json`)) {
      console.log(chalk.bgRed.black('Este número de conta já existe!'));
      return typeAccount();
    };

    // criar o registro da conta
    fs.writeFileSync(
      `checkingAccounts/${createCheckingAccount}.json`,
      '{ "type": "Conta Corrente", "ID": ' + JSON.stringify(createCheckingAccount) + ', "balance": 0, "data": ' + JSON.stringify(new Date()) + ' }', 
      function(err) {
        console.log(err);
    });

    // mensagem de criaçào da conta
    console.log(chalk.green(`CONTA CORRENTE: ${createCheckingAccount}, foi criada com sucesso! \n`));
    console.log('---------------------------------------------------------------------------------------------\n');

    // retorna para o índice de operações
    operation();

  })
  .catch(err => console.log(err));
};

// Criar Conta Poupança
function createSavingAccount() {
  inquirer.prompt([
    {
      name: "createSavingAccount",
      message: "Digite o número da sua conta:",
    }
  ])
  .then((answer) => {
    const createSavingAccount = answer['createSavingAccount'];

    console.log('\n---------------------------------------------------------------------------------------------\n');

    // criar diretório para armazenar contas
    if(!fs.existsSync('savingAccounts')) {
      fs.mkdirSync('savingAccounts');
    };

    // validar se o nome da conta já existe
    if(fs.existsSync(`savingAccounts/${createSavingAccount}.json`)) {
      console.log(chalk.bgRed.black('Este número de conta já existe!'));
      return typeAccount();
    };

    // criar o registro da conta
    fs.writeFileSync(
      `savingAccounts/${createSavingAccount}.json`,
      '{ "type": "Conta Poupança", "ID": ' + JSON.stringify(createSavingAccount) + ', "balance": 0, "data": ' + JSON.stringify(new Date()) + ' }', 
      function(err) {
        console.log(err);
    });

    // mensagem de criaçào da conta
    console.log(chalk.green(`CONTA POUPANÇA: ${createSavingAccount}, foi criada com sucesso! \n`));
    console.log('---------------------------------------------------------------------------------------------\n');

    // retorna para o índice de operações
    operation();

  })
  .catch(err => console.log(err));
};

// depositar dinheiro
function deposit(folderName, typeAccount) {

  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Qual o número da sua conta?'
    }
  ]).then((answer) => {
    const accountName = answer['accountName'];

    // verificar se a conta existe
    if(!checkAccount(folderName, typeAccount, accountName)) {
      return deposit(folderName, typeAccount);
    }

  })
  .catch(err => console.log(err));
};

// helper para verificar se a conta existe
function checkAccount(folderName, typeAccount, accountName) {
  if(!fs.existsSync(`${folderName}${accountName}.json`)) {
    console.log(chalk.bgRed.black('Essa ' + `${typeAccount}` + ' não existe, tente novamente. '));
    return false;
  }

  return true;
}

