package org.youxx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/** 通用状态更新请求（用户/订单/商品上下架复用） */
@Data
@Schema(description = "通用状态更新请求，不同接口取值见各接口说明")
public class UpdateStatusRequest {

    @Schema(description = """
            目标状态：
            - 用户: NORMAL / DISABLED
            - 商品: ONSHELF / OFFSHELF
            - 订单: PENDING / SHIPPED / COMPLETED / CANCELLED
            """, example = "NORMAL", requiredMode = Schema.RequiredMode.REQUIRED)
    private String status;
}
