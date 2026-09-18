package org.youxx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/** 收货地址请求 */
@Data
@Schema(description = "收货地址请求：新增与修改共用")
public class UserAddressRequest {

    @Schema(description = "收货人姓名", example = "张三", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @Schema(description = "收货人手机号", example = "13800000000", requiredMode = Schema.RequiredMode.REQUIRED)
    private String phone;

    @Schema(description = "详细地址", example = "浙江省杭州市西湖区文一西路 100 号 1 幢 201 室",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String detail;

    @Schema(description = "是否设为默认地址", example = "true")
    private Boolean isDefault;
}
