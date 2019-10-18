const accounts = {
  a: 100,
  b: 0,
  c: 20,
}

const getAccount = () => {
  const accountName = prompt('Enter an account name')
  if (!Object.prototype.hasOwnProperty.call(accounts, accountName)) {
    throw new Error(`No such account: ${accountName}`)
  }
  return accountName
}

const transfer1 = (from, amount) => {
  if (accounts[from] < amount) return
  accounts[from] -= amount
  accounts[getAccount()] += amount
}

const transfer2 = (from, amount) => {
  if (accounts[from] < amount) return
  let progress = 0
  try {
    accounts[from] -= amount
    progress = 1
    accounts[getAccount()] += amount
    progress = 2
  } finally {
    if (progress === 1) {
      accounts[from] += amount
    }
  }
}

const InputError = class InputError extends Error {}

const promptDirection = (question) => {
  const result = prompt(question)
  if (result.toLowerCase() === 'left') return 'L'
  if (result.toLowerCase() === 'right') return 'R'
  throw new InputError('Invalid direction: ' + result)
}

module.exports = { getAccount, transfer1, transfer2, promptDirection }
