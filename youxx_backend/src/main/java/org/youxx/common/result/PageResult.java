package org.youxx.common.result;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "分页结果")
public class PageResult<T> {

    @Schema(description = "当前页数据列表")
    private List<T> records;

    @Schema(description = "总记录数", example = "18")
    private long total;

    @Schema(description = "当前页码，从 1 开始", example = "1")
    private int page;

    @Schema(description = "每页条数", example = "10")
    private int size;

    @Schema(description = "总页数", example = "2")
    private int totalPages;

    public static <T> PageResult<T> of(List<T> records, long total, int page, int size) {
        int totalPages = (int) Math.ceil((double) total / size);
        if (totalPages < 1) {
            totalPages = 1;
        }
        return PageResult.<T>builder()
                .records(records)
                .total(total)
                .page(page)
                .size(size)
                .totalPages(totalPages)
                .build();
    }
}
