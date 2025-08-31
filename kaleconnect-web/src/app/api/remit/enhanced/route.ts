import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createWithFreighter } from "@/lib/soroban/remittance";
import { appendAudit } from "@/lib/audit";
import { checkHighValueRemit } from "@/lib/compliance";

const CreateRemittanceSchema = z.object({
  fromCurrency: z.string().min(1),
  toCurrency: z.string().min(1),
  amount: z.number().positive(),
  recipientAddress: z.string().min(1),
  recipientName: z.string().min(1),
  purpose: z.string().min(1),
  walletAddress: z.string().optional(),
  userId: z.string().default("anonymous"),
});

const EstimateSchema = z.object({
  fromCurrency: z.string().min(1),
  toCurrency: z.string().min(1),
  amount: z.number().positive(),
});

// POST - Criar nova remessa
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = CreateRemittanceSchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verificar compliance
    const tempRecord = {
      id: "temp",
      from: data.fromCurrency,
      to: data.toCurrency,
      amount: data.amount,
      feePct: 0.8,
      status: "created" as const,
      createdAt: new Date().toISOString(),
      userId: data.userId,
    };

    const compliance = checkHighValueRemit(tempRecord);
    
    // Se falhou na compliance, retornar erro
    if (!compliance.approved) {
      appendAudit(data.userId, "remit.compliance_failed", { 
        input: data, 
        compliance,
        reason: compliance.reason 
      });
      
      return NextResponse.json(
        { 
          error: "Transação não aprovada pela compliance", 
          reason: compliance.reason,
          requiresKyc: compliance.requiresKyc 
        },
        { status: 403 }
      );
    }

    // Tentar criar via Freighter (blockchain)
    let remittanceResult;
    if (data.walletAddress) {
      try {
        remittanceResult = await createWithFreighter(
          data.fromCurrency,
          data.toCurrency,
          data.amount
        );
      } catch (error) {
        console.error("Erro ao criar remessa via Freighter:", error);
      }
    }

    // Criar record da remessa
    const remittanceId = remittanceResult?.id || 
      `remit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const record = {
      id: remittanceId,
      from: data.fromCurrency,
      to: data.toCurrency,
      amount: data.amount,
      recipientAddress: data.recipientAddress,
      recipientName: data.recipientName,
      purpose: data.purpose,
      feePct: 0.8,
      status: remittanceResult ? "submitted" : "created",
      txHash: remittanceResult?.txHash,
      createdAt: new Date().toISOString(),
      estimatedTime: "2-5 minutos",
      userId: data.userId,
      provider: remittanceResult ? "blockchain" : "mock"
    };

    // Log de auditoria
    appendAudit(data.userId, "remit.created", {
      input: data,
      record,
      compliance,
      blockchain: !!remittanceResult
    });

    return NextResponse.json(record, { status: 201 });

  } catch (error) {
    console.error("Erro ao processar remessa:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET - Estimar custos da remessa
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fromCurrency = searchParams.get("from");
    const toCurrency = searchParams.get("to");
    const amount = Number(searchParams.get("amount"));

    const parsed = EstimateSchema.safeParse({
      fromCurrency,
      toCurrency,
      amount
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Obter taxa de câmbio
    const ratesResponse = await fetch(
      `${req.nextUrl.origin}/api/rates?from=${data.fromCurrency}&to=${data.toCurrency}&amount=${data.amount}`
    );
    const rates = await ratesResponse.json();

    // Calcular estimativas
    const networkFee = 0.1; // Taxa fixa da rede
    const serviceFee = data.amount * (rates.feePct / 100);
    const totalFees = networkFee + serviceFee;
    const estimatedReceive = rates.toAmount;
    const estimatedTime = "2-5 minutos";

    const estimate = {
      from: data.fromCurrency,
      to: data.toCurrency,
      amount: data.amount,
      exchangeRate: rates.rate,
      serviceFeePercent: rates.feePct,
      serviceFee,
      networkFee,
      totalFees,
      estimatedReceive,
      estimatedTime,
      validUntil: new Date(Date.now() + 5 * 60 * 1000), // 5 minutos
    };

    return NextResponse.json(estimate);

  } catch (error) {
    console.error("Erro ao calcular estimativa:", error);
    return NextResponse.json(
      { error: "Erro ao calcular estimativa" },
      { status: 500 }
    );
  }
}
