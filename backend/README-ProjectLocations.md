# Project Locations Management

This document describes how to use the API to update and manage project location data for the FarmFi application.

## Updating Project Locations

All projects have been migrated to use structured location data with the format:

```javascript
location: {
  address: String, // Human-readable address
  lat: Number,     // Latitude coordinate
  lng: Number      // Longitude coordinate
}
```

### Force All Projects to Use Cameroon Coordinates

The following endpoint will update all project locations to ensure they are within Cameroon:

```
POST /api/projects/update-locations
```

This endpoint:

1. Updates any projects with old string-based locations to use structured location objects
2. Assigns appropriate Cameroon coordinates based on project category (maize, coffee, avocado, rice, banana, etc.)
3. Resets any existing coordinates that are outside Cameroon's boundaries
4. Distributes locations appropriately across Cameroon's agricultural regions

#### Example request:

```bash
curl -X POST http://localhost:5000/api/projects/update-locations \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

#### Example response:

```json
{
   "success": true,
   "message": "Updated 5 projects with new coordinates and reset 3 locations to be within Cameroon",
   "totalProjects": 8
}
```

## Cameroon Location Regions

The system allocates coordinates based on the following region mapping:

| Crop Type | Cameroon Region      | Sample Addresses                      |
| --------- | -------------------- | ------------------------------------- |
| Maize     | North & Far North    | Garoua, Maroua, Yagoua                |
| Coffee    | West & Littoral      | Bafoussam, Dschang, Nkongsamba        |
| Avocado   | Southwest            | Buea, Limbe, Kumba                    |
| Rice      | Far North            | Yagoua, Kousseri, Kaele               |
| Banana    | Littoral & Southwest | Douala, Tiko, Penja                   |
| Other     | Various              | Yaoundé, Bamenda, Bertoua, Ngaoundéré |

## Technical Implementation

The project location data is validated against Cameroon's bounding box:

-  North: 13.0833°
-  South: 1.6546°
-  West: 8.3822°
-  East: 16.1921°

Any locations outside these boundaries will be automatically reassigned to appropriate coordinates within Cameroon.
