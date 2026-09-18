package org.youxx.common.result;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

/**
 * 统一响应包装。
 * code = 1 表示成功，code = 0 表示失败（失败时 msg 为原因，data 为 null）。
 */
@Data
@Schema(description = "统一响应结构")
public class Result<T> implements Serializable {

    @Schema(description = "业务状态码: 1 成功 / 0 失败", example = "1")
    private Integer code;

    @Schema(description = "失败原因，成功时为 null", example = "参数校验失败")
    private String msg;

    @Schema(description = "业务数据，失败时为 null")
    private T data;

    public static <T> Result<T> success() {
        Result<T> result = new Result<>();
        result.code = 1;
        return result;
    }

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.data = data;
        result.code = 1;
        return result;
    }

    public static <T> Result<T> error(String msg) {
        Result result = new Result();
        result.code = 0;
        result.msg = msg;
        return result;
    }
}
