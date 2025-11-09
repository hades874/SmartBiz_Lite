'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating sales forecasts.
 *
 * The flow takes sales data as input and returns a sales forecast for the next month.
 * It uses the Gemini API for time-series forecasting.
 *
 * @exports salesForecasting - A function that initiates the sales forecasting flow.
 * @exports SalesForecastingInput - The input type for the salesForecasting function.
 * @exports SalesForecastingOutput - The return type for the salesForecasting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SalesRecordSchema = z.object({
  id: z.string(),
  date: z.string().describe("The date of the sale in ISO 8601 format (YYYY-MM-DD)."),
  productName: z.string(),
  productId: z.string().optional(),
  quantity: z.number().describe("The number of units sold."),
  unitPrice: z.number().describe("The price of a single unit."),
  totalAmount: z.number().describe("The total amount for the sale (quantity * unitPrice)."),
  customerName: z.string().optional(),
  customerId: z.string().optional(),
  paymentStatus: z.enum(['paid', 'pending', 'partial']),
  category: z.string().optional(),
});

const SalesForecastingInputSchema = z.object({
  salesData: z.array(SalesRecordSchema).describe('An array of historical sales records.'),
});
export type SalesForecastingInput = z.infer<typeof SalesForecastingInputSchema>;

const SalesForecastItemSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  predictedSales: z.number().describe('The predicted total sales amount (in Taka) for the next 30 days.'),
  confidence: z.enum(['high', 'medium', 'low']).describe('The confidence level of the prediction, based on data volume and volatility.'),
  trend: z.enum(['increasing', 'stable', 'decreasing']).describe('The observed sales trend for this product.'),
});

const SalesForecastingOutputSchema = z.object({
  forecast: z.array(SalesForecastItemSchema).describe('An array of sales forecasts for each product.'),
  insights: z.array(z.string()).describe('Actionable insights derived from the sales patterns and forecast.'),
  recommendations: z.array(z.string()).describe('Strategic recommendations based on the forecast (e.g., marketing, stock adjustments).'),
});
export type SalesForecastingOutput = z.infer<typeof SalesForecastingOutputSchema>;

export async function salesForecasting(input: SalesForecastingInput): Promise<SalesForecastingOutput> {
  return salesForecastingFlow(input);
}

const salesForecastingPrompt = ai.definePrompt({
  name: 'salesForecastingPrompt',
  input: {schema: SalesForecastingInputSchema},
  output: {schema: SalesForecastingOutputSchema},
  prompt: `You are an expert business analyst for SMEs in Bangladesh. Your response must be in the Bangla language.

Analyze the provided historical sales data to generate a 30-day sales forecast for each distinct product.

Historical Sales Data (last 90 days):
{{json salesData}}

Based on the data, perform the following tasks:
1.  **Forecast Sales**: For each product, predict the **total sales amount (in Taka)** for the next 30 days. Do not predict the quantity; predict the revenue.
2.  **Determine Confidence**: Assess the confidence of your prediction (high, medium, or low) based on factors like sales volatility and the amount of historical data available.
3.  **Identify Trend**: Determine if the sales trend for each product is increasing, stable, or decreasing.
4.  **Generate Insights**: Provide 2-3 key insights based on sales patterns, product performance, or seasonality observed in the data.
5.  **Provide Recommendations**: Offer 2-3 actionable recommendations based on your forecast (e.g., "Increase stock for Product X," "Run a promotion for Product Y to boost sales").

Provide the full response in the specified JSON format.
`,
});

const salesForecastingFlow = ai.defineFlow(
  {
    name: 'salesForecastingFlow',
    inputSchema: SalesForecastingInputSchema,
    outputSchema: SalesForecastingOutputSchema,
  },
  async input => {
    const {output} = await salesForecastingPrompt(input);
    return output!;
  }
);
