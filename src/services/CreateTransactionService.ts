import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && value > total)
      throw new AppError('Insufficient income!', 400);

    const categoryRepository = getRepository(Category);

    let findCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!findCategory) {
      const createCategory = categoryRepository.create({ title: category });
      findCategory = await categoryRepository.save(createCategory);
    }

    const createTransaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: findCategory.id,
    });

    const transaction = await transactionRepository.save(createTransaction);

    return transaction;
  }
}

export default CreateTransactionService;
