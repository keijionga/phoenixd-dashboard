import { Router, Request, Response } from 'express';
import { phoenixd } from '../index.js';

export const phoenixdRouter = Router();

// Create Bolt11 Invoice
phoenixdRouter.post('/createinvoice', async (req: Request, res: Response) => {
  try {
    const { description, descriptionHash, amountSat, expirySeconds, externalId, webhookUrl } =
      req.body;
    // phoenixd requires either description or descriptionHash
    const desc = description || descriptionHash ? undefined : 'Phoenixd Dashboard Payment';
    const result = await phoenixd.createInvoice({
      description: description || desc,
      descriptionHash,
      amountSat: amountSat ? parseInt(amountSat) : undefined,
      expirySeconds: expirySeconds ? parseInt(expirySeconds) : undefined,
      externalId,
      webhookUrl,
    });
    res.json(result);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Create Bolt12 Offer
phoenixdRouter.post('/createoffer', async (req: Request, res: Response) => {
  try {
    const { description, amountSat } = req.body;
    const result = await phoenixd.createOffer({
      description,
      amountSat: amountSat ? parseInt(amountSat) : undefined,
    });
    res.json({ offer: result });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get Lightning Address
phoenixdRouter.get('/getlnaddress', async (_req: Request, res: Response) => {
  try {
    const result = await phoenixd.getLnAddress();
    res.json({ address: result });
  } catch (error) {
    console.error('Error getting LN address:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Pay Bolt11 Invoice
phoenixdRouter.post('/payinvoice', async (req: Request, res: Response) => {
  try {
    const { invoice, amountSat } = req.body;
    const result = await phoenixd.payInvoice({
      invoice,
      amountSat: amountSat ? parseInt(amountSat) : undefined,
    });
    res.json(result);
  } catch (error) {
    console.error('Error paying invoice:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Pay Bolt12 Offer
phoenixdRouter.post('/payoffer', async (req: Request, res: Response) => {
  try {
    const { offer, amountSat, message } = req.body;
    const result = await phoenixd.payOffer({
      offer,
      amountSat: parseInt(amountSat),
      message,
    });
    res.json(result);
  } catch (error) {
    console.error('Error paying offer:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Pay Lightning Address
phoenixdRouter.post('/paylnaddress', async (req: Request, res: Response) => {
  try {
    const { address, amountSat, message } = req.body;
    const result = await phoenixd.payLnAddress({
      address,
      amountSat: parseInt(amountSat),
      message,
    });
    res.json(result);
  } catch (error) {
    console.error('Error paying LN address:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Send to On-chain Address
phoenixdRouter.post('/sendtoaddress', async (req: Request, res: Response) => {
  try {
    const { address, amountSat, feerateSatByte } = req.body;
    const result = await phoenixd.sendToAddress({
      address,
      amountSat: parseInt(amountSat),
      feerateSatByte: parseInt(feerateSatByte),
    });
    res.json({ txId: result });
  } catch (error) {
    console.error('Error sending to address:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Bump Fee
phoenixdRouter.post('/bumpfee', async (req: Request, res: Response) => {
  try {
    const { feerateSatByte } = req.body;
    const result = await phoenixd.bumpFee(parseInt(feerateSatByte));
    res.json({ txId: result });
  } catch (error) {
    console.error('Error bumping fee:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Decode Invoice
phoenixdRouter.post('/decodeinvoice', async (req: Request, res: Response) => {
  try {
    const { invoice } = req.body;
    const result = await phoenixd.decodeInvoice(invoice);
    res.json(result);
  } catch (error) {
    console.error('Error decoding invoice:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Decode Offer
phoenixdRouter.post('/decodeoffer', async (req: Request, res: Response) => {
  try {
    const { offer } = req.body;
    const result = await phoenixd.decodeOffer(offer);
    res.json(result);
  } catch (error) {
    console.error('Error decoding offer:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Export CSV
phoenixdRouter.post('/export', async (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    const result = await phoenixd.exportCsv(
      from ? parseInt(from) : undefined,
      to ? parseInt(to) : undefined
    );
    res.json({ message: result });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});
