//Check localStorage availability
if (typeof(Storage) !== "undefined") {
    console.log("Local Storage ready")
  } else {
    console.error("Local Storage unavailable. Some features may be unavailable")
  }