import { z } from 'zod';

export const salesDataSchema = z.object({
  id: z.string(),
  date: z.string(),
  productName: z.string(),
  productId: z.string().optional(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalAmount: z.number(),
  customerName: z.string().optional(),
  customerId: z.string().optional(),
  paymentStatus: z.enum(['paid', 'pending', 'partial']),
  category: z.string().optional(),
  customerAvatarUrl: z.string().url().optional(),
});


export const inventoryDataSchema = z.object({
  id: z.string(),
  productName: z.string(),
  currentStock: z.number(),
  unit: z.string(),
  reorderLevel: z.number(),
  status: z.enum(['ok', 'low', 'overstock']),
  costPrice: z.number(),
  sellingPrice: z.number(),
  category: z.string().optional(),
  lastRestocked: z.string().optional(),
});


export const customerDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  firstPurchase: z.string(),
  lastPurchase: z.string(),
  totalPurchases: z.number(),
  totalSpent: z.number(),
  averageOrderValue: z.number(),
  segment: z.enum(['high-value', 'regular', 'at-risk', 'lost']).optional(),
});

export const BusinessAgentInputSchema = z.object({
  query: z.string().describe("The user's question or message to the agent."),
  salesData: z.array(salesDataSchema).describe('An array of sales records.'),
  inventoryData: z.array(inventoryDataSchema).describe('An array of inventory items.'),
  customerData: z.array(customerDataSchema).describe('An array of customer data.'),
});

export const BusinessAgentOutputSchema = z.object({
  response: z.string().describe("The AI agent's response to the user's query."),
});
