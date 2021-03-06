// @flow

import sanitizeBudgetItem from '@eubfr/lib/budget/budgetFormatter';
import getCountryCode from '@eubfr/lib/location/getCountryCode';
import type { Project } from '@eubfr/types';

/**
 * Preprocess `action`.
 *
 * Seeks for values in the following precedence:
 * - `Action`
 * - `Key Action`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getAction = record => record.Action || record['Key Action'] || '';

/**
 * Preprocess `budget`.
 *
 * Seeks for values in the following precedence:
 * - `EU Grant award in euros ...`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Budget}
 */
const getBudget = record => ({
  total_cost: sanitizeBudgetItem(),
  eu_contrib: sanitizeBudgetItem({
    value:
      record[
        "EU Grant award in euros (This amount represents the grant awarded after the selection stage and is indicative. Please note that any changes made during or after the project's lifetime will not be reflected here.)"
      ],
    currency: 'EUR',
    raw:
      record[
        "EU Grant award in euros (This amount represents the grant awarded after the selection stage and is indicative. Please note that any changes made during or after the project's lifetime will not be reflected here.)"
      ],
  }),
  private_fund: sanitizeBudgetItem(),
  public_fund: sanitizeBudgetItem(),
  other_contrib: sanitizeBudgetItem(),
  funding_area: [],
  mmf_heading: '',
});

/**
 * Preprocess `call_year`.
 *
 * Seeks for values in the following precedence:
 * - `Call year`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getCallYear = record => record['Call year'] || '';

/**
 * Preprocess `description`.
 *
 * Seeks for values in the following precedence:
 * - `Project Summary`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getDescription = record => record['Project Summary'] || '';

/**
 * Preprocess `programme_name`.
 *
 * Seeks for values in the following precedence:
 * - `Programme Funding`
 * - `Programme`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProgramme = record =>
  record.Programme || record['Programme Funding'] || '';

/**
 * Preprocess `project_id`.
 *
 * Seeks for values in the following precedence:
 * - `Project Identifier`
 * - `Project Number`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectId = record =>
  record['Project Number'] || record['Project Identifier'] || '';

/**
 * Preprocess locations.
 *
 * Seeks for values in the following precedence:
 *
 * - `Participating countries`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Array} List of {Location} objects for `project_locations` field
 */
const getLocations = record =>
  record['Participating countries']
    .split(',')
    .filter(loc => loc)
    .map(country => ({
      address: '',
      centroid: null,
      country_code: getCountryCode(country),
      location: null,
      nuts: [],
      postal_code: '',
      region: '',
      town: '',
    }));

/**
 * Preprocess `project_website`.
 *
 * Seeks for values in the following precedence:
 * - `Project Website`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectWebsite = record => record['Project Website'] || '';

/**
 * Preprocess `results`.
 *
 * Seeks for values in the following precedence:
 * - `Results Available`
 * - `Results Platform Project Card`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {Result}
 */
const getResults = record => {
  const available = record['Results Available'] || '';
  const result = record['Results Platform Project Card'] || '';
  return { available, result };
};

/**
 * Preprocess `status`.
 *
 * Seeks for values in the following precedence:
 * - `Project Status`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getProjectStatus = record => record['Project Status'] || '';

/**
 * Preprocess `sub_programme_name`.
 *
 * Seeks for values in the following precedence:
 * - `Sub-programme`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getSubProgramme = record => record['Sub-programme'] || '';

/**
 * Preprocess `success_story`.
 *
 * Seeks for values in the following precedence:
 * - `Is Success Story`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getSuccessStory = record => record['Is Success Story'] || '';

/**
 * Preprocess `themes`.
 *
 * Seeks for values in the following precedence:
 * - `Topics`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getThemes = record =>
  (record.Topics != null &&
    record.Topics !== '' &&
    record.Topics.split(',')
      .filter(a => a)
      .map(a => a.trim())) ||
  [];

/**
 * Preprocess coordinators.
 *
 * Seeks for values in the following precedence:
 *
 * - `Coordinator's name`
 * - `Coordinating organisation name`
 * - `Coordinator organisation type`
 * - `Coordinator's address`
 * - `Coordinator's region`
 * - `Coordinator's country`
 * - `Coordinator's website`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Array} A list with a single {Coordinator} object
 */
const getCoordinators = record => [
  {
    name:
      record["Coordinator's name"] ||
      record['Coordinating organisation name'] ||
      '',
    type: record['Coordinator organisation type'] || '',
    address: record["Coordinator's address"] || '',
    region: record["Coordinator's region"] || '',
    role: 'coordinator',
    country: record["Coordinator's country"] || '',
    website: record["Coordinator's website"] || '',
    phone: '',
    email: '',
  },
];

/**
 * Preprocess partners.
 *
 * Seeks for values in the following precedence:
 *
 * - `Partner {n} name`
 * - `Partner {n} organisation type`
 * - `Partner {n} address`
 * - `Partner {n} region`
 * - `Partner {n} country`
 * - `Partner {n} website`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Array} A list of {Partner} objects
 */
const getPartners = record => {
  const partnerKeys = Object.keys(record).filter(elem => {
    const re = new RegExp('Partner ' + '([0-9]{1,2})' + ' name', 'g'); // eslint-disable-line
    return elem.match(re);
  });

  const partnerArray = [];

  for (let i = 1; i <= partnerKeys.length; i += 1) {
    if (record[`Partner ${i} name`]) {
      partnerArray.push({
        name: record[`Partner ${i} name`] || '',
        type: record[`Partner ${i} organisation type`] || '',
        address: record[`Partner ${i} address`] || '',
        region: record[`Partner ${i} region`] || '',
        role: 'partner',
        country: record[`Partner ${i} country`] || '',
        website: record[`Partner ${i} website`] || '',
        phone: '',
        email: '',
      });
    }
  }

  return partnerArray;
};

/**
 * Preprocess/format date.
 *
 * @memberof EacCsvTransform
 * @param {Date} date Date
 *
 * Supported formats:
 *
 * - `DD/MM/YYYY`
 * - `YYYY-MM-DD`
 *
 * @returns {Date} The date formatted into an ISO 8601 date format
 *
 */
const formatDate = date => {
  if (!date || typeof date !== 'string') return null;

  if (date.includes('/')) {
    const d = date.split(/\//);
    if (d.length !== 3) return null;

    const [day, month, year] = d;

    if (!day || !month || !year) return null;

    try {
      return new Date(Date.UTC(year, month - 1, day)).toISOString();
    } catch (e) {
      return null;
    }
  }

  try {
    return new Date(date).toISOString();
  } catch (e) {
    return null;
  }
};

/**
 * Get end date before formatting.
 *
 * Input fields taken from the `record` are:
 * - `Start Date`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getStartDate = record => record['Start date'] || null;

/**
 * Get end date before formatting.
 *
 * Input fields taken from the `record` are:
 * - `End Date`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from parsed file
 * @returns {String}
 */
const getEndDate = record => record['End date'] || null;

/**
 * Preprocess `title`.
 *
 * Seeks for values in the following precedence:
 * - `Project Title`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {String}
 */
const getProjectTitle = record => record['Project Title'] || '';

/**
 * Converts a single string with commas to an array.
 *
 * Input fields taken from the `record` are:
 *
 * - `Activity type`
 *
 * @memberof EacCsvTransform
 * @param {Object} record The row received from harmonized storage
 * @returns {Array} List of activity types
 *
 * @example
 * input => "foo, bar, baz"
 * output => ["foo", "bar", "baz"]
 */
const getTypes = record =>
  (record['Activity type'] != null &&
    record['Activity type'] !== '' &&
    record['Activity type']
      .split(',')
      .filter(a => a)
      .map(a => a.trim())) ||
  [];

/**
 * Map fields for EAC producer, XLS file types
 *
 * Example input data: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/eac/xls/test/stubs/record.json|stub}
 *
 * Transform function: {@link https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/eac/xls/src/lib/transform.js|implementation details}
 * @name EacCsvTransform
 * @param {Object} record Piece of data to transform before going to harmonized storage.
 * @returns {Project} JSON matching the type fields.
 */
export default (record: Object): Project | null => {
  if (!record) return null;

  // Map the fields
  return {
    action: getAction(record),
    budget: getBudget(record),
    call_year: getCallYear(record),
    description: getDescription(record),
    ec_priorities: [],
    media: [],
    programme_name: getProgramme(record),
    project_id: getProjectId(record),
    project_locations: getLocations(record),
    project_website: getProjectWebsite(record),
    complete: false,
    related_links: [],
    reporting_organisation: 'EAC',
    results: getResults(record),
    status: getProjectStatus(record),
    sub_programme_name: getSubProgramme(record),
    success_story: getSuccessStory(record),
    themes: getThemes(record),
    third_parties: getCoordinators(record).concat(getPartners(record)),
    timeframe: {
      from: formatDate(getStartDate(record)),
      from_precision: 'day',
      to: formatDate(getEndDate(record)),
      to_precision: 'day',
    },
    title: getProjectTitle(record),
    type: getTypes(record),
  };
};
