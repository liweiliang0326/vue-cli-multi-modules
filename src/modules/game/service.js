import http from "@/api/axios.js";

export default {

  /**
   * 
   * 各请求方式示例
   * 
  */

  // get-查询
  httpGetDocumentDictType() {
    return http.get("/game/document/dict/list/type");
  },

  // post-新增
  httpPostFinishDataCatalogList(data) {
    return http.post("/game/finishDataCatalog/list", data);
  },

  // put-修改
  httpPutFinishDataCatalog(data) {
    return http.put("/game/finishDataCatalog", data);
  },
  
  // delete-删除
  httpDeleteFinishDataCatalog(data) {
    return http.delete("/game/finishDataCatalog", {params: data});
  }

};
