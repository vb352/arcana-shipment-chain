// Cloudflare Worker API integration
const WORKER_URL = import.meta.env.VITE_WORKER_URL || "https://your-worker.workers.dev";

export interface ContractArtifact {
  abi: any[];
  bytecode: string;
}

export interface PrepareResponse {
  data: string;
  to: string;
  value?: string;
}

export interface StageResponse {
  stage: "OPEN" | "LOCKED" | "CLOSED";
  depositor: string;
  beneficiary: string;
  amount: string;
}

export const getContractArtifact = async (): Promise<ContractArtifact> => {
  const response = await fetch(`${WORKER_URL}/contract-artifact`);
  if (!response.ok) throw new Error("Failed to fetch contract artifact");
  return response.json();
};

export const prepareApprove = async (
  owner: string,
  spender: string,
  amount: string
): Promise<PrepareResponse> => {
  const response = await fetch(`${WORKER_URL}/prepare/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ owner, spender, amount }),
  });
  if (!response.ok) throw new Error("Failed to prepare approve");
  return response.json();
};

export const prepareDeposit = async (
  contractAddress: string,
  depositor: string
): Promise<PrepareResponse> => {
  const response = await fetch(`${WORKER_URL}/prepare/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contractAddress, depositor }),
  });
  if (!response.ok) throw new Error("Failed to prepare deposit");
  return response.json();
};

export const getStage = async (contractAddress: string): Promise<StageResponse> => {
  const response = await fetch(`${WORKER_URL}/stage?contractAddress=${contractAddress}`);
  if (!response.ok) throw new Error("Failed to get stage");
  return response.json();
};

export const agentRelease = async (
  contractAddress: string,
  evidenceCid: string,
  agentKey: string
): Promise<{ txHash: string }> => {
  const response = await fetch(`${WORKER_URL}/agent/release`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AGENT-KEY": agentKey,
    },
    body: JSON.stringify({ contractAddress, evidenceCid }),
  });
  if (!response.ok) throw new Error("Failed to release funds");
  return response.json();
};

export const agentRevert = async (
  contractAddress: string,
  evidenceCid: string,
  agentKey: string
): Promise<{ txHash: string }> => {
  const response = await fetch(`${WORKER_URL}/agent/revert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AGENT-KEY": agentKey,
    },
    body: JSON.stringify({ contractAddress, evidenceCid }),
  });
  if (!response.ok) throw new Error("Failed to revert funds");
  return response.json();
};
