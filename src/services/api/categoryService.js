import categoriesData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    await this.delay();
    return [...this.categories];
  }

  async getById(id) {
    await this.delay();
    return this.categories.find(category => category.Id === parseInt(id));
  }

  async getByType(type) {
    await this.delay();
    return this.categories.filter(category => category.type === type);
  }

  async create(categoryData) {
    await this.delay();
    const newCategory = {
      ...categoryData,
      Id: Math.max(...this.categories.map(c => c.Id)) + 1
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, categoryData) {
    await this.delay();
    const index = this.categories.findIndex(category => category.Id === parseInt(id));
    if (index !== -1) {
      this.categories[index] = { ...this.categories[index], ...categoryData };
      return { ...this.categories[index] };
    }
    throw new Error("Category not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.categories.findIndex(category => category.Id === parseInt(id));
    if (index !== -1) {
      this.categories.splice(index, 1);
      return true;
    }
    throw new Error("Category not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export default new CategoryService();