const injectionCheck = (params) => {
  if (params.length === 0)
    throw new Error('Params should be not empty array')
  params.forEach((param) => {
    if (param.toString().includes('or') || param.toString().includes('OR') ||
      param.toString().includes('and') || param.toString().includes('AND'))
      throw new Error('Found SQL Injection')
  })
  return true
}

module.exports = (db, logger) => {
  return {
    createRider: async (req, res) => {
      const startLatitude = Number(req.body.start_lat);
      const startLongitude = Number(req.body.start_long);
      const endLatitude = Number(req.body.end_lat);
      const endLongitude = Number(req.body.end_long);
      const riderName = req.body.rider_name;
      const driverName = req.body.driver_name;
      const driverVehicle = req.body.driver_vehicle;

      if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
        return res.send({
          error_code: "VALIDATION_ERROR",
          message: "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
        });
      }

      if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
        return res.send({
          error_code: "VALIDATION_ERROR",
          message: "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
        });
      }

      if (typeof riderName !== "string" || riderName.length < 1) {
        return res.send({
          error_code: "VALIDATION_ERROR",
          message: "Rider name must be a non empty string"
        });
      }

      if (typeof driverName !== "string" || driverName.length < 1) {
        return res.send({
          error_code: "VALIDATION_ERROR",
          message: "Driver name must be a non empty string"
        });
      }

      if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
        return res.send({
          error_code: "VALIDATION_ERROR",
          message: "Vehicle name must be a non empty string"
        });
      }

      const values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];
      try {
        if (injectionCheck(values))
          await db.run("INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)", values, async function (err) {
            await db.get("SELECT * FROM Rides WHERE rideID = ?", this.lastID, (_, rows) => {
              res.send(rows)
            })
          })
      } catch (err) {
        logger.error(err.message)
        return res.send({
          error_code: "SERVER_ERROR",
          message: "Unknown error"
        });
      }
    },

    getRiders: async (req, res) => {
      try {
        const { page = 1, size = 5 } = req.query;
        if (injectionCheck([page, size]))
          await db.all("SELECT * FROM Rides LIMIT ?,?", [(page - 1) * size, size], (_, rows) => {
            if (rows.length === 0) {
              return res.send({
                error_code: "RIDES_NOT_FOUND_ERROR",
                message: "Could not find any rides"
              });
            }
            res.send(rows);
          })
      } catch (err) {
        logger.error(err.message)
        return res.send({
          error_code: "SERVER_ERROR",
          message: "Unknown error"
        });
      }
    },

    getRiderById: async (req, res) => {
      try {
        if (injectionCheck([req.params.id]))
          await db.all(`SELECT * FROM Rides WHERE rideID="${req.params.id}"`, (_, rows) => {
            if (rows.length === 0) {
              return res.send({
                error_code: "RIDES_NOT_FOUND_ERROR",
                message: "Could not find any rides"
              });
            }
            res.send(rows);
          })
      } catch (err) {
        logger.error(err.message)
        return res.send({
          error_code: "SERVER_ERROR",
          message: "Unknown error"
        });
      }
    }
  }
}