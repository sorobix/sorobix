import Axios from "axios";

export default class Api {
  backendURL = "https://sorobixbackend.eastus.cloudapp.azure.com";

  async generateKey() {
    try {
      const resp = await Axios({
        method: "get",
        url: this.backendURL + `/account/generate`,
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
  async formatCode(data){
        try {
          const resp = await Axios({
            method: "post",
            url: `https://sorobixfmt.eastus.cloudapp.azure.com/`,
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
        url: this.backendURL + `/contract/deploy`,
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
  async compileContract(data) {
    try {
      const resp = await Axios({
        method: "post",
        url: this.backendURL + `/contract/compile`,
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

  async invokeContract(data) {
    try {
      const resp = await Axios({
        method: "post",
        url: this.backendURL + `/contract/invoke`,
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
