import Axios from "axios";

export default class Api {
  backendURL = "https://sorobix.eastus.cloudapp.azure.com";

  async deployContract(data) {
    try {
      const resp = await Axios({
        method: "post",
        url: this.backendURL + `/deploy_contract`,
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
        url: this.backendURL + `/compile_contract`,
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
        url: this.backendURL + `/invoke_contract`,
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
