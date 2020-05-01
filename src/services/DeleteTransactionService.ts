import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (!id) throw new AppError('Please, enter an id.', 400);

    const transaction = await transactionRepository.findOne({ where: { id } });

    if (!transaction) throw new AppError('Transaction dont exists.', 400);

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
