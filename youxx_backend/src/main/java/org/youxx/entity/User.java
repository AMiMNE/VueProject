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
@Schema(description = "用户实体（管理员新增/编辑用户时作为请求体；普通用户请勿使用本结构，密码等字段不对外）")
public class User {

    @Schema(description = "用户 ID，新增时不传，由后端生成", example = "U001")
    private String id;

    @Schema(description = "用户名", example = "zhangsan")
    private String username;

    @Schema(description = "密码（明文传入，后端加密存储；查询响应中不会返回）", example = "123456")
    private String password;

    @Schema(description = "手机号", example = "13800000000")
    private String phone;

    @Schema(description = "邮箱", example = "zhangsan@example.com")
    private String email;

    @Schema(description = "角色: ADMIN / USER", example = "USER")
    private String role;

    @Schema(description = "状态: NORMAL / DISABLED", example = "NORMAL")
    private String status;

    @Schema(description = "头像资源路径", example = "/upload_resources/user_icon/default.png")
    private String avatar;

    @Schema(description = "创建时间，由数据库自动填充", example = "2026-09-18 10:00:00")
    private LocalDateTime createTime;

    @Schema(description = "更新时间，由数据库自动填充", example = "2026-09-18 10:00:00")
    private LocalDateTime updateTime;
}
