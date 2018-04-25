/**
 * @jest-environment node
 */

import onObjectCreated from '../../../src/events/onObjectCreated';

describe(`Function onCreate in "@eubfr/ingestion-manager"`, () => {
  test('The function expects API, INDEX, REGION and STAGE environment variables', async () => {
    const event = {};
    const context = { awsRequestId: 'foo' };
    const callback = error => {
      expect(error.message).toEqual(
        'API, INDEX, REGION and STAGE environment variables are required!'
      );
    };

    expect.assertions(1);

    await onObjectCreated(event, context, callback);
  });
});