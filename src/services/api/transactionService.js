import transactionsData from "@/services/mockData/transactions.json";

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async getAll() {
    await this.delay();
    return [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getById(id) {
    await this.delay();
    return this.transactions.find(transaction => transaction.Id === parseInt(id));
  }

  async getByDateRange(startDate, endDate) {
    await this.delay();
    return this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
  }

  async getByCategory(category) {
    await this.delay();
    return this.transactions.filter(transaction => transaction.category === category);
  }

  async getByType(type) {
    await this.delay();
    return this.transactions.filter(transaction => transaction.type === type);
  }

  async create(transactionData) {
    await this.delay();
    const newTransaction = {
      ...transactionData,
      Id: Math.max(...this.transactions.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    this.transactions.push(newTransaction);
    return { ...newTransaction };
  }

  async update(id, transactionData) {
    await this.delay();
    const index = this.transactions.findIndex(transaction => transaction.Id === parseInt(id));
    if (index !== -1) {
      this.transactions[index] = { ...this.transactions[index], ...transactionData };
      return { ...this.transactions[index] };
    }
    throw new Error("Transaction not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.transactions.findIndex(transaction => transaction.Id === parseInt(id));
    if (index !== -1) {
      this.transactions.splice(index, 1);
      return true;
    }
    throw new Error("Transaction not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export default new TransactionService();