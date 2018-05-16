<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## AgriCsvTransform

Map fields for AGRI producer, CSV file types

Example input data: [stub](https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/agri/csv/test/stubs/record.json)

Transform function: [implementation details](https://github.com/ec-europa/eubfr-data-lake/blob/master/services/ingestion/etl/agri/csv/src/lib/transform.js)

**Parameters**

-   `record` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Piece of data to transform before going to harmonized storage.

Returns **Project** JSON matching the type fields.

### getFundingArea

Converts a single string to an array

**Parameters**

-   `record` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The row received from parsed file

**Examples**

```javascript
input => "Research & innovation; Investment for growth; Transport"
output => ["Research & innovation", "Investment for growth", "Transport"]
```

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** List of string values for `funding_area` field

### getCoordinators

Preprocess coordinators

**Parameters**

-   `record` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The row received from parsed file

**Examples**

```javascript
input => "Eva Maria Plunger (VERBUND AG); foo; bar"
output => ["Eva Maria Plunger (VERBUND AG)", "foo", "bar"]
```

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** List of {Coordinator} objects for `coordinators` field

### getPartners

Preprocess partners

**Parameters**

-   `record` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The row received from parsed file

**Examples**

```javascript
input => "foo, bar, baz"
output => ["foo", "bar", "baz"]
```

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** List of {Partner} objects for `partners` field

### getLocations

Preprocess locations

Input fields taken from the `record` are:

-   `Project location longitude`
-   `Project location latitude`
-   `Project country(ies)`
-   `Project address(es)`
-   `Project postal code(s)`
-   `Project town(s)`

**Parameters**

-   `record` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The row received from parsed file

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** List of {Location} objects for `project_locations` field

### getRelatedLinks

Preprocess related links

Depends on record['Related links'] field

**Parameters**

-   `record` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The row received from parsed file

**Examples**

```javascript
input => "<a href=\"https://ec.europa.eu/inea/en/ten-t/ten-t-projects/projects-by-country/multi-country/2013-eu-92069-s\">INEA</a>;<a href=\"https://europa.eu/investeu/projects/central-european-green-corridors_en\">InvestEU</a>"
output => [
   { label: "INEA", url: "https://ec.europa.eu/inea/en/ten-t/ten-t-projects/projects-by-country/multi-country/2013-eu-92069-s" }
   { label: "InvestEU", url: "https://europa.eu/investeu/projects/central-european-green-corridors_en" }
 ]
```

Returns **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** List of {RelatedLink}

### formatDate

Format date

**Parameters**

-   `date` **[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)** Date in timestamp

**Examples**

```javascript
input => "1388530800"
output => "2013-12-31T23:00:00.000Z"
```

Returns **[Date](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)** The date formatted into an ISO 8601 date format

### getMedia

Prepare media information

**Parameters**

-   `record` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The row received from parsed file

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Media>** 