package org.youxx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/** 注册请求 */
@Data
@Schema(description = "注册请求")
public class RegisterRequest {

    @Schema(description = "用户名，需全局唯一", example = "zhangsan", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;

    @Schema(description = "密码（明文，后端加密存储）", example = "123456", requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;

    @Schema(description = "手机号", example = "13800000000")
    private String phone;
}
