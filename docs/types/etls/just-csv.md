<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## JustCsvTransform

Map fields for JUST producer, CSV file types

Example input data: [stub][1]

Transform function: [implementation details][2]

**Parameters**

- `record` **[Object][3]** Piece of data to transform before going to harmonized storage.

Returns **Project** JSON matching the type fields.

### getLocations

Preprocess locations

Input fields taken from the `record` are:

- `field_prj_longitude`
- `field_prj_latitude`
- \`field_prj_country_iso

**Parameters**

- `record` **[Object][3]** The row received from parsed file

Returns **[Array][4]** List of {Location} objects for `project_locations` field

### getBudget

Preprocess budget

**Parameters**

- `record` **[Object][3]** The row received from parsed file

Returns **Budget**

### getRelatedLinks

Preprocess related links

Depends on record['Related links'] field

**Parameters**

- `record` **[Object][3]** The row received from parsed file

**Examples**

```javascript
input => "<a href=\"https://ec.europa.eu/inea/en/ten-t/ten-t-projects/projects-by-country/multi-country/2013-eu-92069-s\">INEA</a>;<a href=\"https://europa.eu/investeu/projects/central-european-green-corridors_en\">InvestEU</a>"
output => [
   { label: "INEA", url: "https://ec.europa.eu/inea/en/ten-t/ten-t-projects/projects-by-country/multi-country/2013-eu-92069-s" }
   { label: "InvestEU", url: "https://europa.eu/investeu/projects/central-european-green-corridors_en" }
 ]
```

Returns **[Array][4]** List of {RelatedLink}

[1]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/just/csv/test/stubs/record.json
[2]: https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/just/csv/src/lib/transform.js
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array