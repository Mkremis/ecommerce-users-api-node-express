class Message {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }

  getStatus() {
    return this.status;
  }

  setStatus(status) {
    if (status === "fail" || status === "success") {
      this.status = status;
    } else {
      console.error("Status must be 'fail' or 'success'");
    }
  }

  getMessage() {
    return this.message;
  }

  setMessage(message) {
    this.message = message;
  }
}

export default Message;
