import budgetsData from "@/services/mockData/budgets.json";

class BudgetService {
  constructor() {
    this.budgets = [...budgetsData];
  }

  async getAll() {
    await this.delay();
    return [...this.budgets];
  }

  async getById(id) {
    await this.delay();
    return this.budgets.find(budget => budget.Id === parseInt(id));
  }

  async getByCategory(category) {
    await this.delay();
    return this.budgets.find(budget => budget.category === category);
  }

  async create(budgetData) {
    await this.delay();
    const newBudget = {
      ...budgetData,
      Id: Math.max(...this.budgets.map(b => b.Id)) + 1,
      spent: 0
    };
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

  async update(id, budgetData) {
    await this.delay();
    const index = this.budgets.findIndex(budget => budget.Id === parseInt(id));
    if (index !== -1) {
      this.budgets[index] = { ...this.budgets[index], ...budgetData };
      return { ...this.budgets[index] };
    }
    throw new Error("Budget not found");
  }

  async updateSpent(category, amount) {
    await this.delay();
    const budget = this.budgets.find(b => b.category === category);
    if (budget) {
      budget.spent = Math.max(0, budget.spent + amount);
      return { ...budget };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.budgets.findIndex(budget => budget.Id === parseInt(id));
    if (index !== -1) {
      this.budgets.splice(index, 1);
      return true;
    }
    throw new Error("Budget not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export default new BudgetService();