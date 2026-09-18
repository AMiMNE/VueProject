package org.youxx.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/** 用户资料更新请求（不含 id、角色、状态等敏感字段） */
@Data
@Schema(description = "用户资料更新请求：仅可修改以下三个字段，密码走独立接口")
public class UserUpdateRequest {

    @Schema(description = "手机号", example = "13800000000")
    private String phone;

    @Schema(description = "邮箱", example = "zhangsan@example.com")
    private String email;

    @Schema(description = "头像资源路径，由 /api/user/avatar/upload 返回",
            example = "/upload_resources/user_icon/359c7016-b030-474c-a2a6-8baa6819cc49.jpg")
    private String avatar;
}
