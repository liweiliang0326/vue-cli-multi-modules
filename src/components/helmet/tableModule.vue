<template>
  <div class="table_module_box">
    <table
      class="table_module"
      style="border-collapse:separate; border-spacing:1px 0;"
    >
      <thead class="table_module_head">
        <tr class="table_module_head_tr">
          <th
            class="table_module_head_tr_th"
            v-for="(item, index) in tableData.head"
            :key="index"
          >
            {{ item }}
          </th>
        </tr>
      </thead>

      <template v-if="tableData.body && tableData.body.length >= 1">
        <tbody class="table_module_body">
          <tr
            class="table_module_body_tr"
            v-for="(item, index) in tableData.body"
            :key="index"
            :class="{ activit: activit === index }"
          >
            <!-- 序号 -->
            <td class="tbody_num">{{ index + 1 }}</td>
            <!-- 设备名称 -->
            <td class="tbody_device_name">
              {{ item.deviceName }}
            </td>
            <!-- 使用者 -->
            <td class="tbody_user">
              {{ item.userName }}
            </td>
            <!-- 工序 -->
            <td v-if="type === 'viewPicture'" class="tbody_process">
              {{ item.processName2 }}
            </td>
            <!-- 时间 -->
            <td
              v-if="type === 'videoPlayBack' || type === 'viewPicture'"
              class="tbody_date"
            >
              {{ item.createTime }}
            </td>
            <!-- 时长 -->
            <td v-if="type === 'videoPlayBack'" class="tbody_time">
              {{ item.fileLength }}
            </td>
            <!-- 类型 -->
            <td v-if="type === 'videoPlayBack'" class="tbody_type">
              视频
            </td>
            <!-- 操作 -->
            <td class="tbody_action" @click="showData(item, index)">
              {{
                type === "live"
                  ? "直播"
                  : type === "videoPLay"
                  ? "回放"
                  : "查看"
              }}
            </td>
          </tr>
        </tbody>
      </template>
    </table>
    <template
      v-if="(tableData.body && tableData.body.length < 1) || !tableData.body"
    >
      <!-- 数据为空 -->
      <div class="no_data_box rowFlex allCenter">
        <a-empty description="暂无数据" />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "tableModule",
  props: ["type", "tableData"],
  data() {
    return {
      activit: null
    };
  },
  mounted() {
    console.log("type", this.type);
  },
  methods: {
    showData(item, index) {
      this.activit = index;
      this.$emit("showData", item);
    }
  }
};
</script>
<style lang="less" scoped>
// @import "@/styles/base.less";
@import "../../styles/base.less";
.table_module {
  width: 100%;
  text-align: center;
  background: #fff;
  color: #7fcedd;
  cursor: auto;

  .table_module_head {
    background: #203a5a;

    tr {
      th {
        height: 40px;
        font-weight: normal;
      }
    }
  }

  .table_module_body {
    tr {
      &:nth-of-type(2n) {
        background: #f5f5f5;
      }

      &.activit {
        background: #ddd !important;
      }

      td {
        height: 40px;
        max-width: 60px;
        font-size: 12px;
        // white-space: pre-wrap;

        &.tbody_num {
          width: 40px;
        }

        &.tbody_action {
          color: #f59a23;
          cursor: pointer;

          & > ul {
            margin: 0;
          }
        }
      }
    }
  }
}

.no_data_box {
  .wh(100%, 300px);
  margin: 0 auto;
}
</style>
