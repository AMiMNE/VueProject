package org.youxx.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/** 用户视图对象：屏蔽 password 等敏感字段 */
@Data
@Schema(description = "用户信息（不含密码）")
public class UserVO {

    @Schema(description = "用户 ID", example = "A001")
    private String id;

    @Schema(description = "用户名", example = "admin")
    private String username;

    @Schema(description = "手机号", example = "13800000000")
    private String phone;

    @Schema(description = "邮箱", example = "admin@example.com")
    private String email;

    @Schema(description = "角色: ADMIN / USER", example = "ADMIN")
    private String role;

    @Schema(description = "状态: NORMAL / DISABLED", example = "NORMAL")
    private String status;

    @Schema(description = "头像资源路径", example = "/upload_resources/user_icon/default.png")
    private String avatar;

    @Schema(description = "创建时间", example = "2026-09-18 10:00:00")
    private LocalDateTime createTime;

    @Schema(description = "更新时间", example = "2026-09-18 10:00:00")
    private LocalDateTime updateTime;
}
