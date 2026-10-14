/**
 * @jest-environment node
 *
 * Rapport SEO (scripts/lib/fresh-chrome.mjs) : un Chrome qui refuse la connexion juste après son
 * lancement est remplacé par un Chrome neuf, au plus trois essais ; toute autre erreur remonte
 * sans nouvel essai ; chaque Chrome lancé est fermé.
 */
import { describe, expect, test } from '@jest/globals';
import {
  ATTEMPTS,
  auditInFreshChrome,
  isConnectionRefused,
} from '../../scripts/lib/fresh-chrome.mjs';

const refused = port =>
  Object.assign(new Error(`connect ECONNREFUSED 127.0.0.1:${port}`), { code: 'ECONNREFUSED' });

/** Chrome simulés, un port par lancement ; trace des lancements, fermetures et messages */
function session(failures) {
  const trace = [];
  let port = 9000;
  let audits = 0;
  return {
    trace,
    io: {
      launch: async () => {
        port += 1;
        const chrome = { port, kill: async () => trace.push(`kill ${chrome.port}`) };
        trace.push(`launch ${chrome.port}`);
        return chrome;
      },
      audit: async (url, auditPort) => {
        audits += 1;
        if (audits <= failures.length) throw failures[audits - 1](auditPort);
        return { url, port: auditPort };
      },
      log: message => trace.push(message.trim().slice(0, 30)),
    },
  };
}

describe('rapport SEO : Chrome neuf si la connexion est refusée', () => {
  test('refus puis connexion : le rapport du second Chrome, le premier fermé', async () => {
    const { trace, io } = session([refused]);
    await expect(auditInFreshChrome('https://site', io)).resolves.toEqual({
      url: 'https://site',
      port: 9002,
    });
    expect(trace).toEqual([
      'launch 9001',
      'Chrome a refusé la connexion (',
      'kill 9001',
      'launch 9002',
      'kill 9002',
    ]);
  });

  test('refus à chaque essai : abandon après trois Chrome, tous fermés', async () => {
    const { trace, io } = session(Array.from({ length: ATTEMPTS }, () => refused));
    await expect(auditInFreshChrome('https://site', io)).rejects.toThrow('ECONNREFUSED');
    expect(trace.filter(line => line.startsWith('launch'))).toHaveLength(ATTEMPTS);
    expect(trace.filter(line => line.startsWith('kill'))).toHaveLength(ATTEMPTS);
  });

  test('autre erreur (page, audit) : remontée sans nouvel essai', async () => {
    const { trace, io } = session([() => new Error('NO_FCP')]);
    await expect(auditInFreshChrome('https://site', io)).rejects.toThrow('NO_FCP');
    expect(trace).toEqual(['launch 9001', 'kill 9001']);
  });

  test('refus et coupures reconnus, le reste non', () => {
    expect(isConnectionRefused(refused(1))).toBe(true);
    expect(isConnectionRefused(new Error('read ECONNRESET'))).toBe(true);
    expect(isConnectionRefused(new Error('socket hang up'))).toBe(true);
    expect(isConnectionRefused(new Error('PROTOCOL_TIMEOUT'))).toBe(false);
    expect(isConnectionRefused(undefined)).toBe(false);
  });
});
