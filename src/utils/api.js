import Axios from "axios";

export default class Api {
  backendURL = "https://backend.sorobix.xyz";

  async generateKey() {
    try {
      const resp = await Axios({
        method: "post",
        url: this.backendURL + `/api/account`,
        data: { username: "sorobix" },
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      if (err.response.status === 500 || err.response.status === 401) {
        return "err";
      }
      return err.response.data;
    }
  }
  async formatCode(data) {
    try {
      const resp = await Axios({
        method: "post",
        url: this.backendURL + `/formatter`,
        data,
      });
      console.log(resp);
      return resp;
    } catch (err) {
      return err.response;
    }
  }

  async deployContract(data) {
    try {
      const resp = await Axios({
        method: "post",
        url: this.backendURL + `/api/deploy`,
        data,
      });
      return resp.data;
    } catch (err) {
      const errorMessage = {
        status: false,
        message: "Unexpected error! Please try again.",
      };

      if (!err.response) {
        return errorMessage;
      }
      if (err.response.status === 500 || err.response.status === 401) {
        return errorMessage;
      }
      return err.response.data;
    }
  }
  async compileContract(data) {
    try {
      const resp = await Axios({
        method: "post",
        url: this.backendURL + `/api/compile`,
        data,
      });
      return resp.data;
    } catch (err) {
      const errorMessage = {
        status: false,
        message: "Unexpected error! Please try again.",
      };
      if (!err.response) {
        return errorMessage;
      }
      if (err.response.status === 500 || err.response.status === 401) {
        return errorMessage;
      }
      console.log(err.response);
      return err.response.data;
    }
  }

  async invokeContract(data) {
    try {
      const resp = await Axios({
        method: "post",
        url: this.backendURL + `/api/invoke`,
        data,
      });
      return resp.data;
    } catch (err) {
      if (!err.response) {
        return "err";
      }
      if (err.response.status === 500 || err.response.status === 401) {
        return "err";
      }
      return err.response.data;
    }
  }
}
