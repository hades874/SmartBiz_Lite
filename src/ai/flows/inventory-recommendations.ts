'use server';

/**
 * @fileOverview Provides smart inventory recommendations and low stock alerts.
 *
 * - getInventoryRecommendations - A function that generates inventory reorder recommendations.
 * - InventoryRecommendationsInput - The input type for the getInventoryRecommendations functionूं
 * - InventoryRecommendationsOutput - The return type for the getInventoryRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { inventoryDataSchema } from '@/lib/schemas';

const InventoryRecommendationsInputSchema = z.object({
  inventoryItems: z.array(inventoryDataSchema).describe('An array of inventory items.'),
});

export type InventoryRecommendationsInput = z.infer<typeof InventoryRecommendationsInputSchema>;

const InventoryRecommendationSchema = z.object({
  productId: z.string().describe('The ID of the product.'),
  reorderQuantity: z.number().describe('The recommended reorder quantity for the product.'),
  reason: z.string().describe('The reason for the reorder recommendation.'),
});

const InventoryRecommendationsOutputSchema = z.object({
  recommendations: z.array(InventoryRecommendationSchema).describe('An array of inventory reorder recommendations.'),
  alerts: z.array(z.string()).describe('An array of low stock alerts.'),
});

export type InventoryRecommendationsOutput = z.infer<typeof InventoryRecommendationsOutputSchema>;

export async function getInventoryRecommendations(
  input: InventoryRecommendationsInput
): Promise<InventoryRecommendationsOutput> {
  return inventoryRecommendationsFlow(input);
}

const inventoryRecommendationsPrompt = ai.definePrompt({
  name: 'inventoryRecommendationsPrompt',
  input: {schema: InventoryRecommendationsInputSchema},
  output: {schema: InventoryRecommendationsOutputSchema},
  prompt: `You are an AI assistant helping a distributor in Bangladesh manage their inventory. Your response must be in the Bangla language and tailored for a Bangladeshi audience.
  Analyze the following inventory data and provide reorder recommendations and low stock alerts.

  Inventory Data:
  {{#each inventoryItems}}
  - Product ID: {{id}}, Product: {{productName}}, Current Stock: {{currentStock}} {{unit}}, Reorder Level: {{reorderLevel}} {{unit}}, Cost Price: {{costPrice}}, Selling Price: {{sellingPrice}}
  {{/each}}

  Recommendations:
  - Provide a reorder quantity for each product where the 'currentStock' is below its 'reorderLevel'. The ID must be returned as 'productId'.
  - Explain the reasoning behind each reorder recommendation (e.g., "Stock is below reorder point").

  Alerts:
  - Generate a concise alert message for each product where the 'currentStock' is below its 'reorderLevel'.

  Format your response as a JSON object with "recommendations" and "alerts" fields.
  The "recommendations" field should be an array of objects with "productId", "reorderQuantity", and "reason" fields.
  The "alerts" field should be an array of strings, each representing a low stock alert (e.g., "Premium Wireless Mouse is low on stock.").
  `,
});

const inventoryRecommendationsFlow = ai.defineFlow(
  {
    name: 'inventoryRecommendationsFlow',
    inputSchema: InventoryRecommendationsInputSchema,
    outputSchema: InventoryRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await inventoryRecommendationsPrompt(input);
    return output!;
  }
);
