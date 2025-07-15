import savingsGoalsData from "@/services/mockData/savingsGoals.json";

class SavingsGoalService {
  constructor() {
    this.savingsGoals = [...savingsGoalsData];
  }

  async getAll() {
    await this.delay();
    return [...this.savingsGoals];
  }

  async getById(id) {
    await this.delay();
    return this.savingsGoals.find(goal => goal.Id === parseInt(id));
  }

  async create(goalData) {
    await this.delay();
    const newGoal = {
      ...goalData,
      Id: Math.max(...this.savingsGoals.map(g => g.Id)) + 1,
      currentAmount: goalData.currentAmount || 0
    };
    this.savingsGoals.push(newGoal);
    return { ...newGoal };
  }

  async update(id, goalData) {
    await this.delay();
    const index = this.savingsGoals.findIndex(goal => goal.Id === parseInt(id));
    if (index !== -1) {
      this.savingsGoals[index] = { ...this.savingsGoals[index], ...goalData };
      return { ...this.savingsGoals[index] };
    }
    throw new Error("Savings goal not found");
  }

  async addToGoal(id, amount) {
    await this.delay();
    const goal = this.savingsGoals.find(g => g.Id === parseInt(id));
    if (goal) {
      goal.currentAmount = Math.min(goal.targetAmount, goal.currentAmount + amount);
      return { ...goal };
    }
    throw new Error("Savings goal not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.savingsGoals.findIndex(goal => goal.Id === parseInt(id));
    if (index !== -1) {
      this.savingsGoals.splice(index, 1);
      return true;
    }
    throw new Error("Savings goal not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export default new SavingsGoalService();