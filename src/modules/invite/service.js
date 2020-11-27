import http from "@/api/axios.js";

export default {
  getDocumentDictType() {
    return http.get("/invite/document/dict/list/type");
  }
};
