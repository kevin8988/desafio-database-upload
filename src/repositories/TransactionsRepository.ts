import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private getBalanceByType(
    type: string,
    transactions: Array<Transaction>,
  ): number {
    return transactions.reduce((accumulator, transaction) => {
      if (transaction.type === type) return accumulator + transaction.value;
      return accumulator;
    }, 0);
  }

  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find();

    const incomesTotal = this.getBalanceByType('income', transactions);
    const outcomesTotal = this.getBalanceByType('outcome', transactions);

    const balance = {
      income: incomesTotal,
      outcome: outcomesTotal,
      total: incomesTotal - outcomesTotal,
    };

    return balance;
  }
}

export default TransactionsRepository;
