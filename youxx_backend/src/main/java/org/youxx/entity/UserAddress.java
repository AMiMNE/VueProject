package org.youxx.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "收货地址")
public class UserAddress {

    @Schema(description = "地址 ID", example = "1")
    private Long id;

    @Schema(description = "所属用户 ID，由后端从 token 解析填充", example = "U001")
    private String userId;

    @Schema(description = "收货人姓名", example = "张三")
    private String name;

    @Schema(description = "收货人手机号", example = "13800000000")
    private String phone;

    @Schema(description = "详细地址", example = "浙江省杭州市西湖区文一西路 100 号 1 幢 201 室")
    private String detail;

    @Schema(description = "是否默认地址（对应数据库 0/1）", example = "true")
    private Boolean isDefault;

    @Schema(description = "创建时间", example = "2026-09-18 10:00:00")
    private LocalDateTime createTime;
}
