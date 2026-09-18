package org.youxx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/** 修改密码请求 */
@Data
@Schema(description = "修改密码请求")
public class UpdatePasswordRequest {

    @Schema(description = "原密码（明文）", example = "123456", requiredMode = Schema.RequiredMode.REQUIRED)
    private String oldPassword;

    @Schema(description = "新密码（明文）", example = "654321", requiredMode = Schema.RequiredMode.REQUIRED)
    private String newPassword;
}
