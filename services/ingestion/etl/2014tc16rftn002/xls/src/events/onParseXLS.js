import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import XLSX from 'xlsx';

// ETL utilities.
import ensureExtensions from '@eubfr/lib/etl/ensureExtensions';
import extractMessage from '@eubfr/lib/etl/extractMessage';
import handleError from '@eubfr/lib/etl/handleError';

import MessengerFactory from '@eubfr/logger-messenger/src/lib/MessengerFactory';
import { STATUS } from '@eubfr/logger-messenger/src/lib/status';

import transformRecord from '../lib/transform';

export const handler = async (event, context) => {
  const { BUCKET, REGION, STAGE } = process.env;

  if (!BUCKET || !REGION || !STAGE) {
    throw new Error(
      'BUCKET, REGION and STAGE environment variables are required!'
    );
  }

  try {
    const snsMessage = extractMessage(event);
    const { key } = snsMessage.object;

    if (!ensureExtensions({ file: key, extensions: ['.xls', '.xlsx'] })) {
      throw new Error('XLS or XLSX file expected for this ETL.');
    }

    const messenger = MessengerFactory.Create({ context });
    const s3 = new AWS.S3();

    await messenger.send({
      message: {
        computed_key: key,
        status_message: 'Start parsing XLS...',
        status_code: STATUS.PARSING,
      },
      to: ['logs'],
    });

    // Get file
    const readStream = s3
      .getObject({ Bucket: snsMessage.bucket.name, Key: key })
      .createReadStream();

    return new Promise((resolve, reject) => {
      // Put data in buffer
      const buffers = [];
      readStream.on('data', data => {
        buffers.push(data);
      });

      readStream.on('error', async e =>
        handleError(
          { messenger, key, statusCode: STATUS.ERROR },
          { error: e, callback: reject }
        )
      );

      // Manage data
      readStream.on('end', async () => {
        let dataString = '';

        // Parse file
        const buffer = Buffer.concat(buffers);
        const workbook = XLSX.read(buffer);
        const sheetNameList = workbook.SheetNames;
        const parsedRows = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetNameList[0]]
        );

        // Remove first row "LIST OF OPERATIONS APPROVED UNDER THE FIRST CALL FOR PROJECTS (2016/2017)".
        parsedRows.shift();
        // Get column name in English.
        const columnsMap = parsedRows.shift();
        // Remove column with Spanish.
        parsedRows.shift();
        // Remove column with French.
        parsedRows.shift();
        // Remove column with Portugese.
        parsedRows.shift();

        // Work with the rest of the data.
        const improvedData = parsedRows
          .map(row => {
            const improvedRow = {};

            // Re-map keys.
            // Update: 1/16/18 => "Start date"
            // __EMPTY => "Acronym", etc.

            // Some rows are not actual projects, but a sort of separators.
            // Take into account rows which have exactly 15 fields, which a regular project row is.
            Object.keys(row).forEach(columnKey => {
              // Check whether the given property has a column for it.
              if (columnsMap[columnKey]) {
                const columnName = columnsMap[columnKey].trim();
                improvedRow[columnName] = row[columnKey];
              }
            });

            return improvedRow;
          })
          // Keep only such rows which contain sufficient number of useful fields.
          // This removes the last few rows which contain details about the spreadsheet.
          .filter(row => Object.keys(row).length === 12);

        improvedData.forEach(record => {
          const data = transformRecord(record);
          dataString += `${JSON.stringify(data)}\n`;
        });

        // Load data
        const params = {
          Bucket: BUCKET,
          Key: `${key}.ndjson`,
          Body: dataString,
          ContentType: 'application/x-ndjson',
        };

        await s3.upload(params).promise();

        await messenger.send({
          message: {
            computed_key: key,
            status_message:
              'XLS parsed successfully. Results will be uploaded to ElasticSearch soon...',
            status_code: STATUS.PARSED,
          },
          to: ['logs'],
        });

        return resolve('XLS parsed successfully');
      });
    });
  } catch (e) {
    throw e;
  }
};

export default handler;
