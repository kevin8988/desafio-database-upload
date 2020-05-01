import parse from 'csv-parse';

import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

import CreateTransactionService from './CreateTransactionService';

interface TransactionObject {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

interface Request {
  csvContent: string;
}

class ImportTransactionsService {
  async execute({ csvContent }: Request): Promise<Transaction[]> {
    const transactions: Array<TransactionObject> = [];

    const parserCSV = parse(csvContent, { from_line: 2 }).on('data', row => {
      const [title, type, value, category] = row.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value || !category)
        throw new AppError('Missing Infos!', 400);

      transactions.push({
        title,
        type,
        value,
        category,
      });
    });

    await new Promise(resolve => parserCSV.on('end', resolve));

    const createTransactionService = new CreateTransactionService();
    const createdTransactions = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const transaction of transactions) {
      // eslint-disable-next-line no-await-in-loop
      const createdTransaction = await createTransactionService.execute(
        transaction,
      );
      createdTransactions.push(createdTransaction);
    }

    return createdTransactions;
  }
}
export default ImportTransactionsService;
