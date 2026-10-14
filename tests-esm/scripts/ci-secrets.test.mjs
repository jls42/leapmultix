/**
 * @jest-environment node
 *
 * Journaux publics de la CI : le dépôt est public, ses journaux aussi. Le bucket, la
 * distribution et le rôle AWS (numéro de compte compris) ne s'y lisent pas : le workflow les
 * prend dans les secrets, dont GitHub masque la valeur, jamais dans les variables, et l'action
 * AWS masque le numéro de compte.
 */
import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';

const WORKFLOW = fs.readFileSync('.github/workflows/ci.yml', 'utf8');

/** Bloc de l'étape qui configure les identifiants AWS, jusqu'à l'étape suivante */
function awsCredentialsStep() {
  const start = WORKFLOW.indexOf('aws-actions/configure-aws-credentials@');
  const next = WORKFLOW.indexOf('- name:', start);
  return WORKFLOW.slice(start, next === -1 ? undefined : next);
}

describe('journaux publics de la CI', () => {
  test.each(['S3_BUCKET', 'CLOUDFRONT_DISTRIB', 'AWS_DEPLOY_ROLE_ARN'])(
    '%s ne vient que des secrets',
    name => {
      expect(WORKFLOW).not.toContain(`vars.${name}`);
      expect(WORKFLOW).toContain(`secrets.${name}`);
    }
  );

  test('l’action AWS assume le rôle tiré des secrets et masque le numéro de compte', () => {
    const step = awsCredentialsStep();
    expect(step).toContain('role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}');
    expect(step).toMatch(/^\s+mask-aws-account-id: true$/m);
  });
});
