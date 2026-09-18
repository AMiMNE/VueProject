package org.youxx.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.youxx.common.result.PageResult;
import org.youxx.common.result.Result;
import org.youxx.dto.UpdateBatchStatusRequest;
import org.youxx.dto.UpdateDiscountRequest;
import org.youxx.dto.UpdateStatusRequest;
import org.youxx.entity.Product;
import org.youxx.entity.ProductCategory;
import org.youxx.service.ProductService;
import org.youxx.vo.UploadVO;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
@Tag(name = "商品", description = "商品查询、分类，以及管理员侧的商品维护")
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "查询商品分类列表", description = "无需登录")
    @SecurityRequirements
    @GetMapping("/category/list")
    public Result<List<ProductCategory>> listCategories() {
        List<ProductCategory> categories = productService.listCategories();
        return Result.success(categories);
    }

    @Operation(summary = "分页查询商品列表", description = "无需登录，前台首页与后台商品列表共用")
    @SecurityRequirements
    @GetMapping("/list")
    public Result<PageResult<Product>> list(
            @Parameter(description = "关键字，匹配商品名称", example = "可乐") @RequestParam(required = false) String keyword,
            @Parameter(description = "分类 ID，取值来自 /api/product/category/list", example = "drinks")
            @RequestParam(required = false) String categoryId,
            @Parameter(description = "状态过滤: ONSHELF / OFFSHELF", example = "ONSHELF")
            @RequestParam(required = false) String status,
            @Parameter(description = "页码，从 1 开始", example = "1") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页条数", example = "10") @RequestParam(defaultValue = "10") int size) {
        PageResult<Product> result = productService.listProducts(keyword, categoryId, status, page, size);
        return Result.success(result);
    }

    @Operation(summary = "查询商品详情")
    @GetMapping("/{id}")
    public Result<Product> detail(
            @Parameter(description = "商品 ID", example = "P001", required = true) @PathVariable String id) {
        Product product = productService.getProduct(id);
        return Result.success(product);
    }

    @Operation(summary = "查询热销商品", description = "无需登录，返回 is_hot = 1 且在售的商品")
    @SecurityRequirements
    @GetMapping("/hot")
    public Result<List<Product>> hot() {
        List<Product> products = productService.listHotProducts();
        return Result.success(products);
    }

    @Operation(summary = "【管理员】新增商品", description = "请求体为 Product 实体，image_url 建议先调用 /upload 获取")
    @PostMapping
    public Result<Product> add(@RequestBody Product product) {
        // 管理员新增商品：字段较多，保留 entity 入参
        Product created = productService.addProduct(product);
        return Result.success(created);
    }

    @Operation(summary = "【管理员】编辑商品")
    @PutMapping("/{id}")
    public Result<Product> update(
            @Parameter(description = "商品 ID", example = "P001", required = true) @PathVariable String id,
            @RequestBody Product product) {
        // 管理员编辑商品：同上，保留 entity 入参
        Product updated = productService.updateProduct(id, product);
        return Result.success(updated);
    }

    @Operation(summary = "【管理员】修改商品上下架状态")
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(
            @Parameter(description = "商品 ID", example = "P001", required = true) @PathVariable String id,
            @RequestBody UpdateStatusRequest request) {
        productService.updateStatus(id, request.getStatus());
        return Result.success();
    }

    @Operation(summary = "【管理员】批量修改商品上下架状态")
    @PutMapping("/batch/status")
    public Result<Void> updateBatchStatus(@RequestBody UpdateBatchStatusRequest request) {
        productService.updateBatchStatus(request.getIds(), request.getStatus());
        return Result.success();
    }

    @Operation(summary = "【管理员】修改商品折扣")
    @PutMapping("/{id}/discount")
    public Result<Void> updateDiscount(
            @Parameter(description = "商品 ID", example = "P001", required = true) @PathVariable String id,
            @RequestBody UpdateDiscountRequest request) {
        productService.updateDiscount(id, request.getDiscount());
        return Result.success();
    }

    @Operation(summary = "【管理员】删除商品")
    @DeleteMapping("/{id}")
    public Result<Void> delete(
            @Parameter(description = "商品 ID", example = "P001", required = true) @PathVariable String id) {
        productService.deleteProduct(id);
        return Result.success();
    }

    @Operation(summary = "【管理员】上传商品图片",
            description = "multipart/form-data 上传，返回的 url 直接写入商品的 imageUrl 字段。"
                    + "图片按分类归档到 /upload_resources/products/{categoryId}/ 下")
    @PostMapping("/upload")
    public Result<UploadVO> upload(
            @Parameter(description = "图片文件，单文件最大 10MB", required = true)
            @RequestParam("file") MultipartFile file,
            @Parameter(description = "商品分类 ID，决定图片归档目录", example = "drinks", required = true)
            @RequestParam("categoryId") String categoryId) {
        String url = productService.uploadImage(file, categoryId);
        UploadVO vo = new UploadVO();
        vo.setUrl(url);
        return Result.success(vo);
    }
}
