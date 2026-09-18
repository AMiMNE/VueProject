package org.youxx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/** 登录请求 */
@Data
@Schema(description = "登录请求")
public class LoginRequest {

    @Schema(description = "用户名", example = "admin", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;

    @Schema(description = "密码（明文）", example = "123456", requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;
}
