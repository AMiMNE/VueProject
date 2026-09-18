package org.youxx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

/** 批量状态更新请求 */
@Data
@Schema(description = "商品批量上下架请求")
public class UpdateBatchStatusRequest {

    @Schema(description = "商品 ID 列表", example = "[\"P001\", \"P002\"]",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private List<String> ids;

    @Schema(description = "目标状态: ONSHELF / OFFSHELF", example = "OFFSHELF",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String status;
}
