// módulos externos
const chalk = require('chalk');
const inquirer = require('inquirer');

// módulo interno (core)
const fs = require('fs');
const { constants } = require('buffer');

// inicializando o programa
operation();

function operation() {
  
  console.log('\n---------------------------------------------------------------------------------------------\n');
  console.log(chalk.greenBright("MENU PRINCIPAL -> CAIXA ELETRÔNICO EM NODEJS \n"));
  console.log('---------------------------------------------------------------------------------------------\n');

  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.greenBright('SELECIONE UMA DAS OPÇÕES ABAIXO:'),
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
      typeAccount(action);

    } else if(action === 'Consultar Saldo') {
      selectAccountType();

    } else if(action === 'Depositar') {
      typeAccount(action);

    } else if(action === 'Sacar') {
      typeAccount(action);

    } else if('Sair') {
      console.log('\n---------------------------------------------------------------------------------------------');
      console.log(chalk.greenBright('\n OBRIGADO POR UTILIZAR O CAIXA ELETRÔNICO EM NODEJS.\n'));
      console.log('---------------------------------------------------------------------------------------------\n');
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
      message: 'SELECIONE O TIPO DE CONTA:',
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
          let folderName = 'checkingAccounts/';
          let typeAccount = 'Conta Corrente';
          deposit(folderName, typeAccount);
        } else if(actionAccount === 'Criar Conta') {
          createCheckingAccount();
        } else if(actionAccount === 'Sacar') {
          let folderName = 'checkingAccounts/';
          let typeAccount = 'Conta Corrente';
          withDraw(folderName, typeAccount);
        }
        break;
      case 'Conta Poupanca':
        if(actionAccount === 'Depositar') {
          let folderName = 'savingAccounts/';
          let typeAccount = 'Conta Poupança';
          deposit(folderName, typeAccount);

        } else if(actionAccount === 'Criar Conta') {
          createSavingAccount();

        } else if(actionAccount === 'Sacar') {
          let folderName = 'savingAccounts/';
          let typeAccountName = 'Conta Poupança';
          withDraw(folderName, typeAccountName);
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
      message: "DIGITE O NÚMERO DA CONTA:",
    }
  ])
  .then((answer) => {
    const createCheckingAccount = answer['createCheckingAccount'];

    // criar diretório para armazenar contas
    if(!fs.existsSync('checkingAccounts')) {
      fs.mkdirSync('checkingAccounts');
    };

    // validar se o nome da conta já existe
    if(fs.existsSync(`checkingAccounts/${createCheckingAccount}.json`)) {

      console.log('\n---------------------------------------------------------------------------------------------\n');
      console.log(chalk.redBright(`OPS! O NÚMERO DE CONTA "${createCheckingAccount}" JÁ EXISTE! TENTE OUTRO NÚMERO.`));
      console.log('\n---------------------------------------------------------------------------------------------\n');

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
    console.log('\n---------------------------------------------------------------------------------------------\n');
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
      message: "DIGITE O NÚMERO DA CONTA:",
    }
  ])
  .then((answer) => {
    const createSavingAccount = answer['createSavingAccount'];

    // criar diretório para armazenar contas
    if(!fs.existsSync('savingAccounts')) {
      fs.mkdirSync('savingAccounts');
    };

    // validar se o nome da conta já existe
    if(fs.existsSync(`savingAccounts/${createSavingAccount}.json`)) {

      console.log('\n---------------------------------------------------------------------------------------------\n');
      console.log(chalk.redBright(`OPS! O NÚMERO DE CONTA "${createSavingAccount}" JÁ EXISTE! TENTE OUTRO NÚMERO.`));
      console.log('\n---------------------------------------------------------------------------------------------\n');

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
    console.log('\n---------------------------------------------------------------------------------------------\n');
    console.log(chalk.green(`CONTA POUPANÇA: ${createSavingAccount}, FOI CRIADA COM SUCESSO!\n`));
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
      message: 'DIGITE O NÚMERO DA CONTA:'
    }
  ]).then((answer) => {
    const accountName = answer['accountName'];

    // verificar se a conta existe
    if(!checkAccount(folderName, typeAccount, accountName)) {
      return deposit(folderName, typeAccount);
    }

    // adicionar valor na conta
    inquirer.prompt([
      {
        name: 'amount',
        message: 'INFORME O VALOR DO DEPÓSITO:',
      },
    ])
    .then((answer) => {

      const amount = answer['amount'];
      
      // add an amount
      if(typeAccount === 'Conta Corrente'){
        addAmount('checkingAccounts', accountName, amount);
      } else if(typeAccount === 'Conta Poupança') {
        addAmount('savingAccounts', accountName, amount);
      }

      operation();

    })
    .catch(err => console.log(err));

  })
  .catch(err => console.log(err));
};

// helper para verificar se a conta existe
function checkAccount(folderName, typeAccount, accountName) {

  if(!fs.existsSync(`${folderName}/${accountName}.json`)) {

    console.log('\n---------------------------------------------------------------------------------------------\n');
    console.log(chalk.redBright(`A CONTA CORRENTE NÚMERO ${accountName} NÃO EXISTE, TENTE NOVAMENTE.\n`));
    console.log('---------------------------------------------------------------------------------------------\n');

    return false;
  }

  return true;
}

function addAmount(folderName, accountName, amount) {

  let accountData = folderName === 'checkingAccounts' ? getAccount(accountName) : getAccountSavings(accountName);

  if(!amount) {
    console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente'));
    console.log(`addAmount: ${folderName} / ${accountName} R$ ${amount}`);
    return deposit();
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

  fs.writeFileSync(
    `${folderName}/${accountName}.json`,
    JSON.stringify(accountData),
    function(err) {
      console.log(err)
    },
  );

  const convertCurrency = parseFloat(amount).toFixed();

  console.log('\n---------------------------------------------------------------------------------------------\n');
  console.log(chalk.green(`VALOR DE R$${parseFloat(convertCurrency).toFixed(2)} FOI DEPOSITADO EM SUA CONTA!\n`));
  console.log('---------------------------------------------------------------------------------------------\n');

}

// ler o arquivo conta corrente
function getAccount(accountName) {
  
  if(fs.existsSync(`checkingAccounts/${accountName}.json`)) {
    const accountJSON = fs.readFileSync(`checkingAccounts/${accountName}.json`, {
      encoding: 'utf8',
      flag: 'r',
    });
    return JSON.parse(accountJSON);
  }

}

// ler o arquivo conta poupanca
function getAccountSavings(accountName) {

  if(fs.existsSync(`savingAccounts/${accountName}.json`)) {
    const accountJSON = fs.readFileSync(`savingAccounts/${accountName}.json`, {
      encoding: 'utf8',
      flag: 'r',
    });
    return JSON.parse(accountJSON);
  }

}

// exibir o valor da conta
function getAccountBalance(typeAccount) {
  
  if(typeAccount === 'Conta Corrente') {
    inquirer.prompt ([
      {
        name: 'accountName',
        message: 'INFORME O NÚMERO DA CONTA CORRENTE:',
      },
    ])
    .then(answer => {
      const accountName = answer['accountName'];
      const accountData = getAccount(accountName);

      // validar se o nome da conta já existe
      if(fs.existsSync(`checkingAccounts/${accountName}.json`)) {
        
        console.log('\n---------------------------------------------------------------------------------------------');
        console.log(chalk.greenBright(`\n SALDO NA CONTA CORRENTE É DE R$${parseFloat(accountData.balance).toFixed(2)} \n`));
        console.log('---------------------------------------------------------------------------------------------\n');

        operation();

      } else {

        console.log('\n---------------------------------------------------------------------------------------------\n');
        console.log(chalk.redBright(`ESTE NÚMERO DE CONTA ${accountName} NÁO EXISTE! TENTE NOVAMENTE.\n`));
        console.log('---------------------------------------------------------------------------------------------\n');

        return getAccountBalance(typeAccount);
      };

    })
    .catch(err => console.log(err));
    
  }

  if(typeAccount === 'Conta Poupanca') {
    
    inquirer.prompt ([
      {
        name: 'accountName',
        message: 'INFORME O NÚMERO DA CONTA POUPANÇA?',
      },
    ])
    .then(answer => {
      const accountName = answer['accountName'];
      const accountData = getAccountSavings(accountName);

      // validar se o nome da conta já existe
      if(fs.existsSync(`savingAccounts/${accountName}.json`)) {

        const convertCurrency = parseFloat(accountData.balance).toFixed(2);
        
        console.log('\n---------------------------------------------------------------------------------------------');
        console.log(chalk.greenBright(`\n SALDO NA CONTA POUPANÇA É DE R$${convertCurrency} \n`));
        console.log('---------------------------------------------------------------------------------------------\n');

        inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'SELECIONE UMA DAS OPÇÕES:',
            choices: [
              'Consultar Novo Saldo', 
              'Retornar ao Menu Principal'
            ],
          }
        ])
        .then((answer) => {
          const action = answer['action'];

          if(action === 'Consultar Novo Saldo') {
            selectAccountType();
          } else {
            operation();
          }
        })
        .catch(err => console.log(err));

      } else {

        console.log('\n---------------------------------------------------------------------------------------------\n');
        console.log(chalk.redBright(`A ${action} NÚMERO ${accountName} NÃO EXISTE, TENTE NOVAMENTE.\n`));
        console.log('---------------------------------------------------------------------------------------------\n');

        return getAccountBalance(typeAccount);
      };

    })
    .catch(err => console.log(err));
    
  }

}

// tipo de conta para consultar
function selectAccountType() {

  inquirer.prompt([
    {
      type: 'list',
      name: 'typeAccount',
      message: 'SELECIONE O TIPO DE CONTA:',
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
        getAccountBalance(typeAccount);
        break;
      case 'Conta Poupanca':
        getAccountBalance(typeAccount);
      break;
      default:
        console.log('Opção inválida');
    }
  })
  .catch(err => console.log(err));

};

// sacar valor da conta
function withDraw(folderName, typeAccountName) {

  inquirer.prompt([
    {
      name: "accountName",
      message: "INFORME O NÚMERO DA CONTA: "
    }
  ]).then((answer) => {

    const accountName = answer['accountName'];

    // verificar se a conta existe
    if(!checkAccount(folderName, typeAccountName, accountName)) {
      return typeAccount('Sacar');
    }

    inquirer.prompt([
      {
        name: "amount",
        message: "INFORME O VALOR QUE DESEJA SACAR:"
      }
    ])
    .then((answer) => {
      const amount = answer['amount'];

      removeAmount(folderName, typeAccountName, accountName, amount);

    })
    .catch(err => console.log(err));

  }).catch(err => console.console(err));
}

function removeAmount(folderName, typeAccountName, accountName, amount) {

  const accountData = typeAccountName === 'Conta Corrente' ? getAccount(accountName) : getAccountSavings(accountName);

  if(!amount) {

    console.log('\n---------------------------------------------------------------------------------------------\n');
    console.log(chalk.redBright(`INFORME UM VALOR VÁLIDO.\n`));
    console.log('---------------------------------------------------------------------------------------------\n');
  
    return typeAccount('Sacar');
  }

  if(accountData.balance < amount) {

    console.log('\n---------------------------------------------------------------------------------------------\n');
    console.log(chalk.redBright(`O VALOR R$${parseFloat(amount).toFixed(00)} É ACIMA DO SALDO EM CONTA. TENTE NOVAMENTE.\n`));
    console.log('---------------------------------------------------------------------------------------------\n');

    return typeAccount('Sacar');
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

  fs.writeFileSync(
    `${folderName}/${accountName}.json`,
    JSON.stringify(accountData),
    function(err) {
      console.log(err)
    },
  );

  console.log('\n---------------------------------------------------------------------------------------------\n');
  console.log(chalk.greenBright(`SAQUE DE R$${parseFloat(amount).toFixed(2)} EFETUADO COM SUCESSO.\n`));
  console.log('---------------------------------------------------------------------------------------------\n');

  operation();

}