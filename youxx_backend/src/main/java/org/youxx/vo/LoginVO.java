package org.youxx.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/** 登录返回结果（含 token 与基本身份信息） */
@Data
@Schema(description = "登录返回结果")
public class LoginVO {

    @Schema(description = "JWT 令牌，前端需持久化，并在后续请求的 token 请求头中携带",
            example = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJB...")
    private String token;

    @Schema(description = "用户 ID", example = "A001")
    private String userId;

    @Schema(description = "用户名", example = "admin")
    private String username;

    @Schema(description = "角色: ADMIN / USER", example = "ADMIN")
    private String role;
}
