package org.youxx.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/** 文件上传返回结果 */
@Data
@Schema(description = "文件上传返回结果")
public class UploadVO {

    @Schema(description = "可访问的资源相对路径，前端拼上后端域名即可展示",
            example = "/upload_resources/products/drinks/water.png")
    private String url;
}
