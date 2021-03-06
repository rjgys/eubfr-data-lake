import { enrichFromCentroid } from '../plugins/centroid';
import { enrichFromCountry } from '../plugins/country';

export const enrich = async record => {
  if (!record.project_locations || record.project_locations.length === 0) {
    return record;
  }

  try {
    const enrichedRecord = JSON.parse(JSON.stringify(record));

    const newLocations = await Promise.all(
      enrichedRecord.project_locations
        .filter(loc => loc)
        .map(async loc => {
          let location = JSON.parse(JSON.stringify(loc));

          if (loc.centroid) {
            location = await enrichFromCentroid(location);
          }

          if (loc.country_code) {
            location = await enrichFromCountry(location);
          }

          return location;
        })
    );

    // Update locations
    enrichedRecord.project_locations = newLocations;

    return enrichedRecord;
  } catch (error) {
    throw error;
  }
};

export default enrich;
