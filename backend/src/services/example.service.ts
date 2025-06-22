import { IExample } from '../types/example.types';

export class ExampleService {
  // This is just a mock implementation
  // In a real application, this would interact with a database
  private examples: IExample[] = [
    { id: '1', name: 'Example 1', description: 'First example', createdAt: new Date() },
    { id: '2', name: 'Example 2', description: 'Second example', createdAt: new Date() },
  ];

  async findAll(): Promise<IExample[]> {
    // Simulate async database operation
    return Promise.resolve(this.examples);
  }

  async findById(id: string): Promise<IExample | null> {
    const example = this.examples.find((e) => e.id === id);
    return Promise.resolve(example || null);
  }

  async create(data: Omit<IExample, 'id' | 'createdAt'>): Promise<IExample> {
    const newExample: IExample = {
      id: String(this.examples.length + 1),
      ...data,
      createdAt: new Date(),
    };

    this.examples.push(newExample);
    return Promise.resolve(newExample);
  }

  async update(
    id: string,
    data: Partial<Omit<IExample, 'id' | 'createdAt'>>
  ): Promise<IExample | null> {
    const index = this.examples.findIndex((e) => e.id === id);

    if (index === -1) {
      return Promise.resolve(null);
    }

    this.examples[index] = {
      ...this.examples[index],
      ...data,
      updatedAt: new Date(),
    };

    return Promise.resolve(this.examples[index]);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.examples.findIndex((e) => e.id === id);

    if (index === -1) {
      return Promise.resolve(false);
    }

    this.examples.splice(index, 1);
    return Promise.resolve(true);
  }
}
