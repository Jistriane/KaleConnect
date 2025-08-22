import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse, type GenerateRegistrationOptionsOpts, type GenerateAuthenticationOptionsOpts, type VerifiedRegistrationResponse, type VerifiedAuthenticationResponse, type RegistrationResponseJSON, type AuthenticationResponseJSON, type PublicKeyCredentialDescriptorJSON } from "@simplewebauthn/server";

// Armazenamento em memória para DEMO (não use em produção)
export type CredentialRecord = {
  id: string;
  publicKey: Uint8Array;
  counter: number;
  transports?: AuthenticatorTransport[];
};

export type UserRecord = {
  id: string; // user handle
  username: string;
  credentials: CredentialRecord[];
};

const db = new Map<string, UserRecord>();
const challenges = new Map<string, string>(); // username -> challenge

// Ajuste para desenvolvimento local
// Observação: durante o desenvolvimento o Next pode mudar a porta (ex.: 3002 se 3000 estiver em uso).
// Aqui fixamos para a porta em uso atual do dev server. Se alterar, ajuste esta constante.
export const rpID = "localhost";
export const origin = `http://${rpID}:3000`;
export const rpName = "KaleConnect Dev";

function toBase64Url(input: string | Buffer | Uint8Array | ArrayBuffer): string {
  if (typeof input === 'string') return input;
  let buf: Buffer;
  if (Buffer.isBuffer(input)) {
    buf = input;
  } else if (input instanceof Uint8Array) {
    buf = Buffer.from(input);
  } else if (input instanceof ArrayBuffer) {
    buf = Buffer.from(new Uint8Array(input));
  } else {
    // Fallback: coerce via Uint8Array
    buf = Buffer.from(new Uint8Array(input as ArrayBuffer));
  }
  return buf.toString('base64url');
}

export function getOrCreateUser(username: string): UserRecord {
  let user = db.get(username);
  if (!user) {
    user = { id: crypto.randomUUID(), username, credentials: [] };
    db.set(username, user);
  }
  return user;
}

export async function registrationOptions(username: string) {
  const user = getOrCreateUser(username);
  const opts: GenerateRegistrationOptionsOpts = {
    rpName,
    rpID,
    userID: new TextEncoder().encode(user.id),
    userName: user.username,
    attestationType: "none",
    authenticatorSelection: { residentKey: "preferred", userVerification: "preferred" },
    // Use Base64URL string IDs directly per v13 types
    excludeCredentials: user.credentials.map<PublicKeyCredentialDescriptorJSON>(c => ({ id: c.id, type: "public-key", transports: c.transports })),
  };
  const options = await generateRegistrationOptions(opts);
  challenges.set(username, options.challenge);
  return options;
}

export async function verifyRegistration(username: string, response: RegistrationResponseJSON): Promise<VerifiedRegistrationResponse> {
  const expectedChallenge = challenges.get(username);
  if (!expectedChallenge) throw new Error("Challenge not found for user");
  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });
  if (verification.verified && verification.registrationInfo) {
    const { credential } = verification.registrationInfo as unknown as { credential: { id: Buffer | string | Uint8Array; publicKey: Uint8Array | string; counter: number } };
    const credentialID = credential.id;
    const credentialPublicKey = credential.publicKey;
    const counter = credential.counter;
    const user = getOrCreateUser(username);
    const credIdB64 = toBase64Url(credentialID);
    const exists = user.credentials.find(c => c.id === credIdB64);
    if (!exists) {
      user.credentials.push({
        id: credIdB64,
        publicKey: typeof credentialPublicKey === 'string' ? Buffer.from(credentialPublicKey, 'base64url') : new Uint8Array(credentialPublicKey),
        counter,
      });
    }
  }
  return verification;
}

export async function authenticationOptions(username: string) {
  const user = getOrCreateUser(username);
  const opts: GenerateAuthenticationOptionsOpts = {
    rpID,
    userVerification: "preferred",
    // Use Base64URL string IDs directly per v13 types
    allowCredentials: user.credentials.map<PublicKeyCredentialDescriptorJSON>(c => ({ id: c.id, type: "public-key" })),
  };
  const options = await generateAuthenticationOptions(opts);
  challenges.set(username, options.challenge);
  return options;
}

export async function verifyAuthentication(username: string, response: AuthenticationResponseJSON): Promise<VerifiedAuthenticationResponse> {
  const user = getOrCreateUser(username);
  const expectedChallenge = challenges.get(username);
  if (!expectedChallenge) throw new Error("Challenge not found for user");
  const dbCreds = new Map(user.credentials.map(c => [c.id, c] as const));

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: ((): { credentialID: Buffer; credentialPublicKey: Buffer; counter: number; transports?: AuthenticatorTransport[] } | undefined => {
      const id = response.rawId as string;
      const cred = dbCreds.get(id);
      if (!cred) return undefined;
      return {
        credentialID: Buffer.from(cred.id, "base64url"),
        credentialPublicKey: Buffer.from(cred.publicKey),
        counter: cred.counter,
        transports: cred.transports,
      };
    })(),
  } as unknown as Parameters<typeof verifyAuthenticationResponse>[0]);

  if (verification.verified && verification.authenticationInfo) {
    const { newCounter, credentialID } = verification.authenticationInfo as unknown as { newCounter: number; credentialID: Buffer | string | Uint8Array };
    const cred = user.credentials.find(c => c.id === toBase64Url(credentialID));
    if (cred) cred.counter = newCounter;
  }

  return verification;
}
