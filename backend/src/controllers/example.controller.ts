import { Request, Response } from 'express';
import { ExampleService } from '../services/example.service';
import { AgentService } from '../services/agent.service';
import { AppError } from '../utils/AppError';
import { IExample } from '../types/example.types';
import { asyncHandler } from '../utils/asyncHandler';

export class ExampleController {
  private exampleService: ExampleService;
  private agentService: AgentService;

  constructor() {
    this.exampleService = new ExampleService();
    this.agentService = new AgentService();
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const examples = await this.exampleService.findAll();

    res.json({
      success: true,
      data: examples,
      total: examples.length,
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const example = await this.exampleService.findById(id);

    if (!example) {
      throw new AppError(`Example with id ${id} not found`, 404);
    }

    res.json({
      success: true,
      data: example,
    });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const newExample = await this.exampleService.create(
      req.body as Omit<IExample, 'id' | 'createdAt'>
    );

    res.status(201).json({
      success: true,
      data: newExample,
      message: 'Example created successfully',
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const updatedExample = await this.exampleService.update(
      id,
      req.body as Partial<Omit<IExample, 'id' | 'createdAt'>>
    );

    if (!updatedExample) {
      throw new AppError(`Example with id ${id} not found`, 404);
    }

    res.json({
      success: true,
      data: updatedExample,
      message: 'Example updated successfully',
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const deleted = await this.exampleService.delete(id);

    if (!deleted) {
      throw new AppError(`Example with id ${id} not found`, 404);
    }

    res.json({
      success: true,
      message: 'Example deleted successfully',
    });
  };

  /**
   * Research travel information based on user query
   */
  public researchTravel = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.body as { query: string };

    if (!query) {
      res.status(400).json({
        success: false,
        error: 'Travel query is required',
      });
      return;
    }

    const travelInfo = await this.agentService.researchTravel(query);

    res.status(200).json({
      success: true,
      data: travelInfo,
    });
  });
}
