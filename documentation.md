The goal of this project is to store and provide information about rides. There is information about start and end latitude/longtitude, rider and driver name, and driver vehicle.

Routes:
  1. POST '/rides'
    Parameters body:
      startLatitude, startLongitude, endLatitude, endLongitude, riderName, redriverName, driverVehicle. They are needed to create db entry.
    Validation:
      startLatitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively.
      endLatitude endLongitude must be between -90 - 90 and -180 to 180 degrees respectively.
      riderName must be a non empty string.
      driverName must be a non empty string.
      driverVehicle must be a non empty string.
    Returns:
      Created entry from db.

  2. GET '/rides'
    Parameters query:
      page, size
    Returns:
      Entries from db with count equal size param. Pagination included and specify with page param.

  3. GET '/rides/:id'
    Parameters:
      id
    Returns:
      Entry from db with specified id.
