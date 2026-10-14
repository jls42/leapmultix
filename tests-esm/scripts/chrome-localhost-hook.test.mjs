/**
 * @jest-environment node
 *
 * Hook de l'agent chrome-devtools-tester (.claude/hooks/chrome-localhost-only.mjs) : il ne
 * navigue que vers le serveur local, refuse initScript, et, posé par le plugin pour toute la
 * session, ne gêne jamais l'agent principal ni un autre agent. Le script est lancé comme Claude
 * Code le lance : JSON du hook sur l'entrée standard, code 2 pour refuser.
 */
import { describe, expect, test } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const HOOK = path.resolve('.claude/hooks/chrome-localhost-only.mjs');
const TESTER = 'chrome-devtools-tester';
const PLUGIN_TESTER = 'chrome-devtools-tester:chrome-devtools-tester';

/** Lance le hook ; rend son code de sortie et sa sortie d'erreur */
function hook(input, args = []) {
  const result = spawnSync(process.execPath, [HOOK, ...args], {
    input: typeof input === 'string' ? input : JSON.stringify(input),
    encoding: 'utf8',
  });
  return { status: result.status, stderr: result.stderr };
}

const navigate = (agent, toolInput) => ({
  hook_event_name: 'PreToolUse',
  tool_name: 'mcp__chrome-devtools__navigate_page',
  ...(agent ? { agent_type: agent } : {}),
  tool_input: toolInput,
});

describe('hook de l’agent Chrome : le serveur local seulement', () => {
  test.each([
    'http://localhost:8080/',
    'http://localhost:8081/index.html#arcade',
    'http://127.0.0.1:5000/',
    'http://localhost/',
  ])('%s : accepté', url => {
    expect(hook(navigate(TESTER, { type: 'url', url })).status).toBe(0);
  });

  test.each([
    'https://leapmultix.jls42.org/',
    'https://localhost:8080/',
    'http://localhost@ailleurs.example/',
    'http://localhost.ailleurs.example/',
    'http://127.0.0.2/',
    'file:///etc/passwd',
    'javascript:alert(1)',
    'pas une adresse',
  ])('%s : refusé, raison donnée à l’agent', url => {
    const { status, stderr } = hook(navigate(TESTER, { type: 'url', url }));
    expect(status).toBe(2);
    expect(stderr).toContain('Adresse refusée');
  });

  test('retour, avance ou rechargement de la page ouverte : acceptés', () => {
    for (const type of ['back', 'forward', 'reload']) {
      expect(hook(navigate(TESTER, { type })).status).toBe(0);
    }
  });

  test('initScript refusé, même vers le serveur local', () => {
    const input = navigate(TESTER, {
      type: 'url',
      url: 'http://localhost:8080/',
      initScript: 'location.href = "https://ailleurs.example"',
    });
    const { status, stderr } = hook(input);
    expect(status).toBe(2);
    expect(stderr).toContain('initScript');
  });

  test('l’agent du plugin est visé comme celui du dépôt', () => {
    const input = navigate(PLUGIN_TESTER, { type: 'url', url: 'https://leapmultix.jls42.org/' });
    expect(hook(input).status).toBe(2);
  });

  test('agent principal ou autre agent : jamais gêné par le hook du plugin', () => {
    const url = 'https://leapmultix.jls42.org/';
    expect(hook(navigate(null, { type: 'url', url })).status).toBe(0);
    expect(hook(navigate('general-purpose', { type: 'url', url })).status).toBe(0);
  });

  test('--always (frontmatter de l’agent) : chaque appel vérifié, sans attendre agent_type', () => {
    const input = navigate(null, { type: 'url', url: 'https://leapmultix.jls42.org/' });
    expect(hook(input, ['--always']).status).toBe(2);
  });

  test('entrée illisible : refusée', () => {
    expect(hook('pas du JSON').status).toBe(2);
  });
});
