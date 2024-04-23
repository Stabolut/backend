class apiError extends Error {
  constructor(message, status = 500, data) {
  
    super(message);
    this.status = status;
    this.data = data;
  }
}

module.exports = apiError;
