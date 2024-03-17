class ApiError extends Error {
  constructor(message, status = 500, data) {
    console.log("Inside this call");
    super(message);
    this.status = status;
    this.data = data;
  }
}

module.exports = ApiError;
